package br.com.norte.norte_api.recommendation;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * A justificativa e o que separa o produto de um oraculo. Estes testes existem sobretudo para
 * garantir que ele prefira nao explicar a explicar mal.
 */
class ExplanationBuilderTest {

    private static final Long ANALISE = 1L;
    private static final Long EMPATIA = 2L;
    private static final Long CRIATIVIDADE = 3L;
    private static final Long ORGANIZACAO = 4L;
    private static final Long PERSISTENCIA = 5L;

    private final ExplanationBuilder builder = new ExplanationBuilder();

    private static TraitProfile profileOf(Map<Long, String> percentages) {
        return new TraitProfile(percentages.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey, entry -> new BigDecimal(entry.getValue()))));
    }

    @Test
    @DisplayName("devolve os tres traits de maior contribuicao, e nao os de maior percentual")
    void returnsTopThreeByContribution() {
        TraitProfile profile = profileOf(Map.of(
                ANALISE, "90.00",
                EMPATIA, "80.00",
                CRIATIVIDADE, "70.00",
                ORGANIZACAO, "65.00"));

        List<TraitContribution> reasons = builder.build(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 3),       // 270
                new ProfessionTraitWeight(EMPATIA, 5),       // 400
                new ProfessionTraitWeight(CRIATIVIDADE, 4),  // 280
                new ProfessionTraitWeight(ORGANIZACAO, 1))); // 65

        assertThat(reasons).extracting(TraitContribution::traitId)
                .containsExactly(EMPATIA, CRIATIVIDADE, ANALISE);
    }

    @Test
    @DisplayName("nenhum trait acima do corte devolve lista vazia, sem inventar justificativa")
    void returnsEmptyWhenNoTraitClearsTheThreshold() {
        TraitProfile profile = profileOf(Map.of(
                ANALISE, "59.99", EMPATIA, "40.00", CRIATIVIDADE, "0.00"));

        List<TraitContribution> reasons = builder.build(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 5),
                new ProfessionTraitWeight(EMPATIA, 5),
                new ProfessionTraitWeight(CRIATIVIDADE, 5)));

        assertThat(reasons).isEmpty();
    }

    @Test
    @DisplayName("exatamente 60 por cento entra: o corte e inclusivo")
    void includesTraitExactlyAtTheThreshold() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "60.00"));

        List<TraitContribution> reasons =
                builder.build(profile, List.of(new ProfessionTraitWeight(ANALISE, 3)));

        assertThat(reasons).hasSize(1);
        assertThat(reasons.getFirst().traitId()).isEqualTo(ANALISE);
    }

    @Test
    @DisplayName("um unico trait acima do corte devolve exatamente uma justificativa")
    void returnsSingleReason() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "95.00", EMPATIA, "10.00"));

        List<TraitContribution> reasons = builder.build(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 4),
                new ProfessionTraitWeight(EMPATIA, 5)));

        assertThat(reasons).hasSize(1);
        assertThat(reasons.getFirst().traitId()).isEqualTo(ANALISE);
    }

    @Test
    @DisplayName("nunca devolve mais de tres, mesmo com cinco traits acima do corte")
    void neverReturnsMoreThanThree() {
        TraitProfile profile = profileOf(Map.of(
                ANALISE, "100.00",
                EMPATIA, "95.00",
                CRIATIVIDADE, "90.00",
                ORGANIZACAO, "85.00",
                PERSISTENCIA, "80.00"));

        List<TraitContribution> reasons = builder.build(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 5),
                new ProfessionTraitWeight(EMPATIA, 5),
                new ProfessionTraitWeight(CRIATIVIDADE, 5),
                new ProfessionTraitWeight(ORGANIZACAO, 5),
                new ProfessionTraitWeight(PERSISTENCIA, 5)));

        assertThat(reasons).hasSize(ExplanationBuilder.MAX_REASONS);
    }

    @Test
    @DisplayName("empate na contribuicao e desempatado pelo id, para a saida ser estavel")
    void breaksContributionTiesDeterministically() {
        TraitProfile profile = profileOf(Map.of(
                PERSISTENCIA, "60.00",   // id 5, contribuicao 300
                CRIATIVIDADE, "60.00",   // id 3, contribuicao 300
                EMPATIA, "75.00"));      // id 2, contribuicao 375

        List<TraitContribution> reasons = builder.build(profile, List.of(
                new ProfessionTraitWeight(PERSISTENCIA, 5),
                new ProfessionTraitWeight(CRIATIVIDADE, 5),
                new ProfessionTraitWeight(EMPATIA, 5)));

        assertThat(reasons).extracting(TraitContribution::traitId)
                .containsExactly(EMPATIA, CRIATIVIDADE, PERSISTENCIA);
    }

    @Test
    @DisplayName("profissao sem traits nao gera justificativa")
    void returnsEmptyForProfessionWithoutTraits() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "100.00"));

        assertThat(builder.build(profile, List.of())).isEmpty();
        assertThat(builder.build(profile, null)).isEmpty();
        assertThat(builder.build(TraitProfile.empty(),
                List.of(new ProfessionTraitWeight(ANALISE, 5)))).isEmpty();
    }

    @Test
    @DisplayName("a contribuicao exposta e P(t) vezes o peso da profissao")
    void exposesTheContributionUsedForRanking() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "80.00"));

        List<TraitContribution> reasons =
                builder.build(profile, List.of(new ProfessionTraitWeight(ANALISE, 4)));

        assertThat(reasons.getFirst().contribution()).isEqualByComparingTo("320.00");
        assertThat(reasons.getFirst().percentage()).isEqualByComparingTo("80.00");
        assertThat(reasons.getFirst().weight()).isEqualTo(4);
    }
}
