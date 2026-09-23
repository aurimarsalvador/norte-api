package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Calcula P(t), o perfil de traits do estudante.
 *
 * <pre>
 *   S_raw(t) = soma dos pesos que t recebeu nas alternativas escolhidas
 *   S_max(t) = soma, por questao respondida, do maior peso que t poderia receber nela
 *   P(t)     = min(100, S_raw(t) / S_max(t) * 100)
 * </pre>
 *
 * <p><b>Leitura adotada para S_max(t).</b> A especificacao permitia entender S_max como o
 * maximo teorico do questionario inteiro ou apenas das questoes respondidas. Aqui vale a
 * segunda: o denominador considera somente as questoes que o estudante respondeu. E a unica
 * leitura em que P(t) significa "o quanto ele pontuou deste trait em relacao ao quanto
 * poderia ter pontuado", e nao penaliza quem parou no meio do questionario.
 *
 * <p><b>S_max(t) igual a zero.</b> O trait sai do perfil em vez de virar 0%. Nenhuma questao
 * respondida media aquele trait, entao afirmar 0% seria inventar uma informacao que nao foi
 * coletada — alem de dividir por zero.
 *
 * <p>Classe pura: sem Spring, sem JPA, sem estado.
 */
public class ProfileCalculator {

    public static final int SCALE = 2;

    static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    public TraitProfile calculate(List<AnsweredQuestionWeights> answers) {
        if (answers == null || answers.isEmpty()) {
            return TraitProfile.empty();
        }

        Map<Long, Integer> rawScores = new HashMap<>();
        Map<Long, Integer> maxScores = new HashMap<>();

        for (AnsweredQuestionWeights answer : answers) {
            answer.chosenOptionWeights().forEach((traitId, weight) ->
                    rawScores.merge(traitId, weight, Integer::sum));
            answer.maxOptionWeights().forEach((traitId, weight) ->
                    maxScores.merge(traitId, weight, Integer::sum));
        }

        Map<Long, BigDecimal> percentages = new HashMap<>();
        for (Map.Entry<Long, Integer> entry : maxScores.entrySet()) {
            int maximum = entry.getValue();
            if (maximum <= 0) {
                continue;
            }

            int raw = rawScores.getOrDefault(entry.getKey(), 0);
            BigDecimal percentage = BigDecimal.valueOf(raw)
                    .multiply(HUNDRED)
                    .divide(BigDecimal.valueOf(maximum), SCALE, RoundingMode.HALF_UP);

            percentages.put(entry.getKey(), percentage.min(HUNDRED).max(BigDecimal.ZERO.setScale(SCALE)));
        }

        return new TraitProfile(percentages);
    }
}
