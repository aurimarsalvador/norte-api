package br.com.norte.norte_api.recommendation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
 * Percurso completo contra o Postgres real, com as migrations e os seeds de verdade.
 *
 * <p>O primeiro teste confere na mao os percentuais de um conjunto minimo de respostas. E o
 * teste que pega erro de formula: os numeros abaixo foram calculados a partir dos pesos da
 * migration V15, e nao copiados da saida do codigo.
 */
@AutoConfigureMockMvc
class RecommendationJourneyIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    private String token;

    @BeforeEach
    void registerStudent() throws Exception {
        String email = "ana-" + System.nanoTime() + "@teste.com";
        String body = """
                {"name":"Ana","email":"%s","password":"senha12345","schoolYear":3}
                """.formatted(email);

        String response = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.student.email").value(email))
                // O hash da senha nunca pode aparecer em resposta alguma.
                .andExpect(jsonPath("$.student.passwordHash").doesNotExist())
                .andReturn().getResponse().getContentAsString();

        token = jsonMapper.readTree(response).get("token").asString();
    }

    @Test
    @DisplayName("uma unica resposta produz os percentuais calculados a mao a partir da V15")
    void singleAnswerProducesHandCheckedProfile() throws Exception {
        long assessmentId = startAssessment();
        JsonNode questions = listQuestions();

        JsonNode firstQuestion = questionByCode(questions, "Q01_PROBLEMA_TRAVADO");
        long optionId = optionByDisplayOrder(firstQuestion, 1);

        answer(assessmentId, firstQuestion.get("id").asLong(), optionId);

        String profile = mockMvc.perform(get("/api/v1/assessments/" + assessmentId + "/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answeredQuestions").value(1))
                .andReturn().getResponse().getContentAsString();

        JsonNode traits = jsonMapper.readTree(profile).get("traits");

        // Alternativa 1 da Q01 pontua ANALISE_LOGICA 5, CURIOSIDADE_CIENTIFICA 4 e
        // RESOLUCAO_PROBLEMAS 3. Os maximos alcancaveis na questao sao, respectivamente,
        // 5, 5 e 5, entao: 100%, 80% e 60%.
        assertThat(percentageOf(traits, "ANALISE_LOGICA")).isEqualByComparingTo("100.00");
        assertThat(percentageOf(traits, "CURIOSIDADE_CIENTIFICA")).isEqualByComparingTo("80.00");
        assertThat(percentageOf(traits, "RESOLUCAO_PROBLEMAS")).isEqualByComparingTo("60.00");

        // Medidos pela questao mas nao pontuados pela alternativa escolhida: zero, nao ausentes.
        assertThat(percentageOf(traits, "PERSISTENCIA")).isEqualByComparingTo("0.00");
        assertThat(percentageOf(traits, "TRABALHO_EQUIPE")).isEqualByComparingTo("0.00");

        // Nenhuma alternativa da Q01 mede criatividade: o trait fica fora do perfil.
        assertThat(traitCodes(traits)).doesNotContain("CRIATIVIDADE");

        // A lista chega ordenada do maior para o menor.
        List<BigDecimal> percentages = new ArrayList<>();
        traits.forEach(trait -> percentages.add(new BigDecimal(trait.get("percentage").asString())));
        assertThat(percentages).isSortedAccordingTo((first, second) -> second.compareTo(first));
    }

    @Test
    @DisplayName("responder, concluir, ver perfil, recomendacoes e o painel Meu Caminho")
    void fullJourney() throws Exception {
        long assessmentId = startAssessment();
        JsonNode questions = listQuestions();

        for (JsonNode question : questions) {
            answer(assessmentId, question.get("id").asLong(), optionByDisplayOrder(question, 1));
        }

        mockMvc.perform(post("/api/v1/assessments/" + assessmentId + "/complete")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.completedAt").isNotEmpty());

        String recommendations = mockMvc.perform(
                        get("/api/v1/assessments/" + assessmentId + "/recommendations?limit=5")
                                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode results = jsonMapper.readTree(recommendations);
        assertThat(results.size()).isEqualTo(5);

        BigDecimal previous = null;
        for (JsonNode recommendation : results) {
            BigDecimal compatibility = new BigDecimal(recommendation.get("compatibility").asString());

            assertThat(compatibility).isBetween(BigDecimal.ZERO, new BigDecimal("100.00"));
            if (previous != null) {
                assertThat(compatibility).isLessThanOrEqualTo(previous);
            }
            previous = compatibility;

            // Toda razao apresentada precisa estar acima do corte de confianca.
            for (JsonNode reason : recommendation.get("reasons")) {
                assertThat(new BigDecimal(reason.get("percentage").asString()))
                        .isGreaterThanOrEqualTo(new BigDecimal("60"));
                assertThat(reason.get("description").asString()).isNotBlank();
            }
            assertThat(recommendation.get("reasons").size())
                    .isLessThanOrEqualTo(ExplanationBuilder.MAX_REASONS);
        }

        mockMvc.perform(get("/api/v1/students/me/my-path")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.student.name").value("Ana"))
                .andExpect(jsonPath("$.assessment.status").value("COMPLETED"))
                .andExpect(jsonPath("$.topTraits").isNotEmpty())
                .andExpect(jsonPath("$.nextSteps").isNotEmpty());
    }

    @Test
    @DisplayName("respostas concentradas geram justificativa; a mais generica nao gera nenhuma")
    void producesJustificationsOnlyWhenTheProfileIsConcentrated() throws Exception {
        // Alternativa 4 de toda questao puxa consistentemente expressao artistica e
        // criatividade, o suficiente para passar do corte de 60%.
        JsonNode recomendacoesConcentradas = recommendationsAnsweringAlwaysOption(4);

        JsonNode melhor = recomendacoesConcentradas.get(0);
        assertThat(melhor.get("reasons")).isNotEmpty();
        for (JsonNode reason : melhor.get("reasons")) {
            assertThat(new BigDecimal(reason.get("percentage").asString()))
                    .isGreaterThanOrEqualTo(new BigDecimal("60"));
        }

        // As justificativas sao ordenadas por contribuicao P(t) x W(t), e nao pelo
        // percentual sozinho.
        BigDecimal contribuicaoAnterior = null;
        for (JsonNode reason : melhor.get("reasons")) {
            BigDecimal contribuicao = new BigDecimal(reason.get("percentage").asString())
                    .multiply(new BigDecimal(reason.get("professionWeight").asString()));
            if (contribuicaoAnterior != null) {
                assertThat(contribuicao).isLessThanOrEqualTo(contribuicaoAnterior);
            }
            contribuicaoAnterior = contribuicao;
        }

        // Ja a alternativa 1 em tudo espalha a pontuacao e nao concentra nada acima de 60:
        // o esperado e nenhuma justificativa, e nao uma justificativa fraca.
        JsonNode recomendacoesGenericas = recommendationsAnsweringAlwaysOption(1);
        for (JsonNode recomendacao : recomendacoesGenericas) {
            assertThat(recomendacao.get("reasons")).isEmpty();
        }
    }

    /** Responde todo o questionario sempre na alternativa indicada e devolve as recomendacoes. */
    private JsonNode recommendationsAnsweringAlwaysOption(int displayOrder) throws Exception {
        registerStudent();
        long assessmentId = startAssessment();

        for (JsonNode question : listQuestions()) {
            answer(assessmentId, question.get("id").asLong(), optionByDisplayOrder(question, displayOrder));
        }
        mockMvc.perform(post("/api/v1/assessments/" + assessmentId + "/complete")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        String response = mockMvc.perform(
                        get("/api/v1/assessments/" + assessmentId + "/recommendations?limit=5")
                                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return jsonMapper.readTree(response);
    }

    @Test
    @DisplayName("responder de novo a mesma questao troca a resposta em vez de somar outra")
    void answeringTwiceReplacesThePreviousAnswer() throws Exception {
        long assessmentId = startAssessment();
        JsonNode question = questionByCode(listQuestions(), "Q01_PROBLEMA_TRAVADO");
        long questionId = question.get("id").asLong();

        answer(assessmentId, questionId, optionByDisplayOrder(question, 1));
        mockMvc.perform(post("/api/v1/assessments/" + assessmentId + "/answers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"questionId":%d,"answerOptionId":%d}
                                """.formatted(questionId, optionByDisplayOrder(question, 2))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answeredCount").value(1));
    }

    @Test
    @DisplayName("concluir antes do minimo de respostas devolve 422 em formato RFC 7807")
    void rejectsCompletionBelowTheMinimum() throws Exception {
        long assessmentId = startAssessment();
        JsonNode question = questionByCode(listQuestions(), "Q01_PROBLEMA_TRAVADO");
        answer(assessmentId, question.get("id").asLong(), optionByDisplayOrder(question, 1));

        mockMvc.perform(post("/api/v1/assessments/" + assessmentId + "/complete")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.title").isNotEmpty())
                .andExpect(jsonPath("$.detail").isNotEmpty())
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    @Test
    @DisplayName("questionario de outro estudante devolve 403, e nao os dados dele")
    void refusesAssessmentOfAnotherStudent() throws Exception {
        long assessmentId = startAssessment();

        registerStudent(); // troca o token por um estudante novo

        mockMvc.perform(get("/api/v1/assessments/" + assessmentId + "/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    @Test
    @DisplayName("rota protegida sem token devolve 401 em formato RFC 7807")
    void rejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/v1/students/me/my-path"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.title").isNotEmpty())
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    @Test
    @DisplayName("cadastro invalido devolve 400 com a lista de campos que falharam")
    void reportsFieldValidationErrors() throws Exception {
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"","email":"nao-e-email","password":"123","schoolYear":9}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors").isArray())
                .andExpect(jsonPath("$.errors[*].field")
                        .value(org.hamcrest.Matchers.hasItems("email", "name", "password", "schoolYear")))
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    private long startAssessment() throws Exception {
        String response = mockMvc.perform(post("/api/v1/assessments")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andReturn().getResponse().getContentAsString();

        return jsonMapper.readTree(response).get("id").asLong();
    }

    private JsonNode listQuestions() throws Exception {
        String response = mockMvc.perform(get("/api/v1/questions"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        return jsonMapper.readTree(response);
    }

    private void answer(long assessmentId, long questionId, long answerOptionId) throws Exception {
        mockMvc.perform(post("/api/v1/assessments/" + assessmentId + "/answers")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"questionId":%d,"answerOptionId":%d}
                                """.formatted(questionId, answerOptionId)))
                .andExpect(status().isOk());
    }

    private static JsonNode questionByCode(JsonNode questions, String code) {
        for (JsonNode question : questions) {
            if (code.equals(question.get("code").asString())) {
                return question;
            }
        }
        throw new AssertionError("Questao " + code + " nao encontrada no questionario seedado.");
    }

    private static long optionByDisplayOrder(JsonNode question, int displayOrder) {
        for (JsonNode option : question.get("options")) {
            if (option.get("displayOrder").asInt() == displayOrder) {
                return option.get("id").asLong();
            }
        }
        throw new AssertionError("Alternativa de ordem " + displayOrder + " nao encontrada.");
    }

    private static BigDecimal percentageOf(JsonNode traits, String traitCode) {
        for (JsonNode trait : traits) {
            if (traitCode.equals(trait.get("code").asString())) {
                return new BigDecimal(trait.get("percentage").asString());
            }
        }
        throw new AssertionError("Trait " + traitCode + " ausente do perfil.");
    }

    private static List<String> traitCodes(JsonNode traits) {
        List<String> codes = new ArrayList<>();
        traits.forEach(trait -> codes.add(trait.get("code").asString()));
        return codes;
    }
}
