package br.com.norte.norte_api.question;

/**
 * Projecao: maior peso que um trait pode receber dentro de uma questao, considerando todas
 * as alternativas disponiveis nela. E o termo do denominador de P(t).
 */
public record QuestionTraitMaxWeightRow(Long questionId, Long traitId, Integer maxWeight) {
}
