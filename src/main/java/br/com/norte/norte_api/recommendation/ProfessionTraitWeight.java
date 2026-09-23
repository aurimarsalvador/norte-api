package br.com.norte.norte_api.recommendation;

/**
 * Exigencia de um trait por uma profissao, de 1 a 5. Versao pura de
 * {@code catalog.ProfessionTrait}, sem JPA, para o motor nao depender do modelo persistente.
 */
public record ProfessionTraitWeight(Long traitId, int weight) {
}
