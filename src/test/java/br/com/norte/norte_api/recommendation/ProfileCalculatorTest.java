package br.com.norte.norte_api.recommendation;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

/**
 * O calculo de P(t) e a base de todo o resto: um erro aqui se propaga em silencio para a
 * compatibilidade e para as justificativas. Por isso os casos de borda estao todos cobertos.
 */
class ProfileCalculatorTest {

    private static final Long ANALISE = 1L;
    private static final Long EMPATIA = 2L;
    private static final Long CRIATIVIDADE = 3L;

    private final ProfileCalculator calculator = new ProfileCalculator();

    @Test
    @DisplayName("soma os pesos das questoes respondidas e divide pelo maximo alcancavel nelas")
    void calculatesPercentageAcrossAnsweredQuestions() {
        TraitProfile profile = calculator.calculate(List.of(
                new AnsweredQuestionWeights(10L,
                        Map.of(ANALISE, 5, EMPATIA, 3),
                        Map.of(ANALISE, 5, EMPATIA, 4, CRIATIVIDADE, 2)),
                new AnsweredQuestionWeights(11L,
                        Map.of(ANALISE, 2),
                        Map.of(ANALISE, 5, CRIATIVIDADE, 3))));

        // ANALISE: 5 + 2 de 5 + 5 possiveis
        assertThat(profile.percentageOf(ANALISE)).isEqualByComparingTo("70.00");
        // EMPATIA: 3 de 4 possiveis, so a questao 10 media esse trait
        assertThat(profile.percentageOf(EMPATIA)).isEqualByComparingTo("75.00");
        // CRIATIVIDADE: media nas duas questoes, mas nenhuma alternativa escolhida pontuou
        assertThat(profile.percentageOf(CRIATIVIDADE)).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("estudante sem nenhuma resposta tem perfil vazio")
    void returnsEmptyProfileWithoutAnswers() {
        assertThat(calculator.calculate(List.of()).isEmpty()).isTrue();
        assertThat(calculator.calculate(null).isEmpty()).isTrue();
    }

    @Test
    @DisplayName("trait sem maximo alcancavel sai do perfil em vez de virar zero por cento")
    void omitsTraitWhenMaximumIsZero() {
        TraitProfile profile = calculator.calculate(List.of(
                new AnsweredQuestionWeights(10L,
                        Map.of(ANALISE, 3),
                        Map.of(ANALISE, 0))));

        // Nao foi medido: afirmar 0% seria inventar um dado que nao foi coletado.
        assertThat(profile.measured(ANALISE)).isFalse();
        assertThat(profile.isEmpty()).isTrue();
        // Ainda assim responde zero, porque C(k) precisa somar algo para o trait nao medido.
        assertThat(profile.percentageOf(ANALISE)).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("P(t) nunca passa de 100 por cento")
    void capsPercentageAtOneHundred() {
        TraitProfile profile = calculator.calculate(List.of(
                new AnsweredQuestionWeights(10L,
                        Map.of(ANALISE, 40),
                        Map.of(ANALISE, 5))));

        assertThat(profile.percentageOf(ANALISE)).isEqualByComparingTo("100.00");
    }

    @Test
    @DisplayName("distingue trait medido e nao pontuado de trait nao medido")
    void separatesScoredZeroFromNotMeasured() {
        TraitProfile profile = calculator.calculate(List.of(
                new AnsweredQuestionWeights(10L,
                        Map.of(ANALISE, 5),
                        Map.of(ANALISE, 5, EMPATIA, 4))));

        assertThat(profile.measured(EMPATIA)).isTrue();
        assertThat(profile.percentageOf(EMPATIA)).isEqualByComparingTo("0.00");
        assertThat(profile.measured(CRIATIVIDADE)).isFalse();
    }

    @Nested
    @DisplayName("arredondamento")
    class Rounding {

        @Test
        @DisplayName("usa duas casas com HALF_UP para o resultado ser reprodutivel")
        void roundsToTwoDecimalPlacesHalfUp() {
            TraitProfile oneThird = calculator.calculate(List.of(
                    new AnsweredQuestionWeights(10L, Map.of(ANALISE, 1), Map.of(ANALISE, 3))));
            TraitProfile twoThirds = calculator.calculate(List.of(
                    new AnsweredQuestionWeights(10L, Map.of(ANALISE, 2), Map.of(ANALISE, 3))));

            assertThat(oneThird.percentageOf(ANALISE)).isEqualTo(new BigDecimal("33.33"));
            assertThat(twoThirds.percentageOf(ANALISE)).isEqualTo(new BigDecimal("66.67"));
        }
    }

    @Test
    @DisplayName("ordena os traits do maior para o menor, com desempate estavel")
    void sortsDescending() {
        TraitProfile profile = calculator.calculate(List.of(
                new AnsweredQuestionWeights(10L,
                        Map.of(ANALISE, 2, EMPATIA, 4, CRIATIVIDADE, 4),
                        Map.of(ANALISE, 4, EMPATIA, 4, CRIATIVIDADE, 4))));

        // EMPATIA e CRIATIVIDADE empatam em 100: o id decide, para a saida nao oscilar.
        assertThat(profile.sortedDescending())
                .extracting(Map.Entry::getKey)
                .containsExactly(EMPATIA, CRIATIVIDADE, ANALISE);
    }
}
