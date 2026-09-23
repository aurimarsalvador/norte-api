package br.com.norte.norte_api.recommendation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CompatibilityCalculatorTest {

    private static final Long ANALISE = 1L;
    private static final Long EMPATIA = 2L;
    private static final Long CRIATIVIDADE = 3L;

    private final CompatibilityCalculator calculator = new CompatibilityCalculator();

    private static TraitProfile profileOf(Map<Long, String> percentages) {
        return new TraitProfile(percentages.entrySet().stream()
                .collect(java.util.stream.Collectors.toMap(
                        Map.Entry::getKey, entry -> new BigDecimal(entry.getValue()))));
    }

    @Test
    @DisplayName("pondera P(t) pelo peso que a profissao da a cada trait")
    void weightsEachTraitByProfessionImportance() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "100.00", EMPATIA, "50.00"));

        BigDecimal compatibility = calculator.calculate(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 5),
                new ProfessionTraitWeight(EMPATIA, 5)));

        // (100*5 + 50*5) / (10*100) * 100
        assertThat(compatibility).isEqualByComparingTo("75.00");
    }

    @Test
    @DisplayName("perfil no maximo em todos os traits exigidos chega a 100 por cento")
    void reachesOneHundredWhenProfileIsFull() {
        TraitProfile profile = profileOf(Map.of(
                ANALISE, "100.00", EMPATIA, "100.00", CRIATIVIDADE, "100.00"));

        BigDecimal compatibility = calculator.calculate(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 5),
                new ProfessionTraitWeight(EMPATIA, 5),
                new ProfessionTraitWeight(CRIATIVIDADE, 5)));

        assertThat(compatibility).isEqualByComparingTo("100.00");
    }

    @Test
    @DisplayName("trait exigido que o estudante nao pontuou derruba a compatibilidade")
    void unscoredRequiredTraitLowersCompatibility() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "100.00"));

        BigDecimal withoutRequirement = calculator.calculate(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 5)));
        BigDecimal withUnscoredRequirement = calculator.calculate(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 5),
                new ProfessionTraitWeight(EMPATIA, 5)));

        assertThat(withoutRequirement).isEqualByComparingTo("100.00");
        // EMPATIA entra com zero mas continua no denominador: e a decisao explicita do projeto.
        assertThat(withUnscoredRequirement).isEqualByComparingTo("50.00");
        assertThat(withUnscoredRequirement).isLessThan(withoutRequirement);
    }

    @Test
    @DisplayName("o peso do trait nao pontuado muda o quanto ele derruba")
    void weightOfUnscoredTraitControlsThePenalty() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "100.00"));

        BigDecimal marginalRequirement = calculator.calculate(profile, List.of(
                new ProfessionTraitWeight(ANALISE, 5),
                new ProfessionTraitWeight(EMPATIA, 1)));

        // Exigencia marginal (peso 1) pesa bem menos do que uma central: 500 / 600 * 100
        assertThat(marginalRequirement).isEqualByComparingTo("83.33");
    }

    @Test
    @DisplayName("profissao sem traits cadastrados devolve zero, sem dividir por zero")
    void returnsZeroForProfessionWithoutTraits() {
        TraitProfile profile = profileOf(Map.of(ANALISE, "100.00"));

        assertThatCode(() -> calculator.calculate(profile, List.of())).doesNotThrowAnyException();
        assertThat(calculator.calculate(profile, List.of())).isEqualByComparingTo("0.00");
        assertThat(calculator.calculate(profile, null)).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("perfil vazio zera a compatibilidade sem quebrar")
    void returnsZeroForEmptyProfile() {
        BigDecimal compatibility = calculator.calculate(TraitProfile.empty(), List.of(
                new ProfessionTraitWeight(ANALISE, 5),
                new ProfessionTraitWeight(EMPATIA, 3)));

        assertThat(compatibility).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("traits que a profissao nao exige nao influenciam o resultado")
    void ignoresTraitsOutsideTheProfession() {
        TraitProfile withExtra = profileOf(Map.of(
                ANALISE, "80.00", CRIATIVIDADE, "100.00"));
        TraitProfile withoutExtra = profileOf(Map.of(ANALISE, "80.00"));

        List<ProfessionTraitWeight> requirements = List.of(new ProfessionTraitWeight(ANALISE, 4));

        assertThat(calculator.calculate(withExtra, requirements))
                .isEqualByComparingTo(calculator.calculate(withoutExtra, requirements))
                .isEqualByComparingTo("80.00");
    }
}
