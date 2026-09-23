package br.com.norte.norte_api.question;

/**
 * Projecao: peso que uma alternativa especifica atribui a um trait.
 */
public record OptionTraitWeightRow(Long answerOptionId, Long traitId, Integer weight) {
}
