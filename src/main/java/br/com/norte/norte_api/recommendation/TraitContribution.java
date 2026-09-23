package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;

/**
 * O quanto um trait contribuiu para a compatibilidade com uma profissao.
 *
 * @param traitId    trait avaliado
 * @param percentage P(t) do estudante nesse trait
 * @param weight     W_k(t), o peso que a profissao da a esse trait
 */
public record TraitContribution(Long traitId, BigDecimal percentage, int weight) {

    /**
     * P(t) * W_k(t): o termo desse trait no numerador de C(k), e o criterio de ordenacao das
     * justificativas.
     */
    public BigDecimal contribution() {
        return percentage.multiply(BigDecimal.valueOf(weight));
    }
}
