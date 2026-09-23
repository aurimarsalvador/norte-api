package br.com.norte.norte_api.recommendation;

import java.util.Map;

/**
 * Tudo que o motor precisa saber sobre UMA questao respondida.
 *
 * <p>Deliberadamente sem JPA e sem Spring: o {@link ProfileCalculator} e testavel montando
 * estes registros a mao, sem subir contexto nem banco.
 *
 * @param questionId          identificador da questao respondida
 * @param chosenOptionWeights pesos por trait da alternativa que o estudante escolheu; alimenta S_raw(t)
 * @param maxOptionWeights    maior peso por trait entre TODAS as alternativas desta questao; alimenta S_max(t)
 */
public record AnsweredQuestionWeights(
        Long questionId,
        Map<Long, Integer> chosenOptionWeights,
        Map<Long, Integer> maxOptionWeights
) {

    public AnsweredQuestionWeights {
        chosenOptionWeights = chosenOptionWeights == null ? Map.of() : Map.copyOf(chosenOptionWeights);
        maxOptionWeights = maxOptionWeights == null ? Map.of() : Map.copyOf(maxOptionWeights);
    }
}
