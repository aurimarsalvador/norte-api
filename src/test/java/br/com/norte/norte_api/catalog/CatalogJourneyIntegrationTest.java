package br.com.norte.norte_api.catalog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import br.com.norte.norte_api.support.AbstractIntegrationTest;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Cobre as rotas de catalogo, feedback, microexperiencia e painel.
 *
 * <p>Os controllers dessas features declaram {@code @RequestMapping} sem caminho na classe,
 * porque atendem prefixos diferentes. Este teste existe em boa parte para provar que o
 * prefixo /api/v1, aplicado centralmente via {@code addPathPrefix}, tambem vale nesse caso:
 * um engano ali deixaria endpoints inteiros fora da versao da API sem ninguem notar.
 */
@AutoConfigureMockMvc
class CatalogJourneyIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    private String token;

    @BeforeEach
    void registerStudent() throws Exception {
        String email = "bruno-" + System.nanoTime() + "@teste.com";
        String response = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Bruno","email":"%s","password":"senha12345","schoolYear":3}
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        token = jsonMapper.readTree(response).get("token").asString();
    }

    @Test
    @DisplayName("lista as seis areas profissionais seedadas")
    void listsCareerAreas() throws Exception {
        mockMvc.perform(get("/api/v1/career-areas").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(6))
                .andExpect(jsonPath("$[0].code").isNotEmpty());
    }

    @Test
    @DisplayName("sem questionario, o catalogo lista tudo mas sem percentual algum")
    void listsCatalogWithoutCompatibilityWhenThereIsNoAssessment() throws Exception {
        String response = mockMvc.perform(
                        get("/api/v1/professions").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(27))
                .andReturn().getResponse().getContentAsString();

        for (JsonNode profession : jsonMapper.readTree(response)) {
            // Melhor nenhum numero do que um numero sem lastro.
            assertThat(profession.get("compatibility").isNull()).isTrue();
            assertThat(profession.get("reasons")).isEmpty();
        }
    }

    @Test
    @DisplayName("filtra por area e recusa codigo de area inexistente com 404")
    void filtersByArea() throws Exception {
        mockMvc.perform(get("/api/v1/professions?areaCode=TECNOLOGIA")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(jsonPath("$[0].careerArea.code").value("TECNOLOGIA"));

        mockMvc.perform(get("/api/v1/professions?areaCode=NAO_EXISTE")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    @Test
    @DisplayName("detalhe traz area, traits exigidos e a microexperiencia associada")
    void showsProfessionDetail() throws Exception {
        long professionId = firstProfessionId();

        mockMvc.perform(get("/api/v1/professions/" + professionId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").isNotEmpty())
                .andExpect(jsonPath("$.typicalActivities").isNotEmpty())
                .andExpect(jsonPath("$.educationPath").isNotEmpty())
                .andExpect(jsonPath("$.careerArea.code").isNotEmpty())
                .andExpect(jsonPath("$.requiredTraits").isNotEmpty())
                .andExpect(jsonPath("$.requiredTraits[0].weight").isNumber())
                .andExpect(jsonPath("$.microExperience.title").isNotEmpty())
                // Sem assessmentId na consulta, nenhum percentual e afirmado.
                .andExpect(jsonPath("$.compatibility").doesNotExist())
                .andExpect(jsonPath("$.interestLevel").doesNotExist());
    }

    @Test
    @DisplayName("feedback faz upsert: reenviar troca o nivel em vez de duplicar")
    void upsertsFeedback() throws Exception {
        long professionId = firstProfessionId();

        mockMvc.perform(post("/api/v1/professions/" + professionId + "/feedback")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"interestLevel\":\"FAVORITE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.interestLevel").value("FAVORITE"));

        mockMvc.perform(post("/api/v1/professions/" + professionId + "/feedback")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"interestLevel\":\"NOT_INTERESTED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.interestLevel").value("NOT_INTERESTED"));

        mockMvc.perform(get("/api/v1/students/me/feedbacks")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].interestLevel").value("NOT_INTERESTED"));
    }

    @Test
    @DisplayName("microexperiencia aceita notas de 1 a 5 e recusa fora do intervalo")
    void respondsToMicroExperience() throws Exception {
        long professionId = firstProfessionId();

        String experiencia = mockMvc.perform(
                        get("/api/v1/professions/" + professionId + "/micro-experience")
                                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.instructions").isNotEmpty())
                .andExpect(jsonPath("$.estimatedMinutes").isNumber())
                .andReturn().getResponse().getContentAsString();

        long microExperienceId = jsonMapper.readTree(experiencia).get("id").asLong();

        mockMvc.perform(post("/api/v1/micro-experiences/" + microExperienceId + "/respond")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"enjoymentRating":5,"difficultyRating":2,"notes":"Gostei bastante."}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enjoymentRating").value(5))
                .andExpect(jsonPath("$.difficultyRating").value(2));

        mockMvc.perform(post("/api/v1/micro-experiences/" + microExperienceId + "/respond")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"enjoymentRating\":9,\"difficultyRating\":2}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors[0].field").value("enjoymentRating"));
    }

    @Test
    @DisplayName("painel de quem ainda nao comecou convida a comecar, sem quebrar")
    void buildsMyPathForStudentWithoutAssessment() throws Exception {
        mockMvc.perform(get("/api/v1/students/me/my-path")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.student.name").value("Bruno"))
                .andExpect(jsonPath("$.assessment").doesNotExist())
                .andExpect(jsonPath("$.topTraits").isEmpty())
                .andExpect(jsonPath("$.nextSteps").isEmpty())
                .andExpect(jsonPath("$.favorites").isEmpty());
    }

    @Test
    @DisplayName("o feedback dado aparece no painel e tira a profissao dos proximos passos")
    void reflectsFeedbackInMyPath() throws Exception {
        long professionId = firstProfessionId();

        mockMvc.perform(post("/api/v1/professions/" + professionId + "/feedback")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"interestLevel\":\"FAVORITE\"}"))
                .andExpect(status().isOk());

        String painel = mockMvc.perform(get("/api/v1/students/me/my-path")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.favorites.length()").value(1))
                .andReturn().getResponse().getContentAsString();

        JsonNode dados = jsonMapper.readTree(painel);
        assertThat(dados.get("favorites").get(0).get("professionId").asLong()).isEqualTo(professionId);
    }

    private long firstProfessionId() throws Exception {
        String response = mockMvc.perform(
                        get("/api/v1/professions").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return jsonMapper.readTree(response).get(0).get("id").asLong();
    }
}
