package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;

/**
 * Justificativa de uma recomendacao, sempre ancorada em numero: qual trait, quanto o
 * estudante pontuou nele e quanto a profissao o exige. O {@code description} ja vem pronto
 * para a tela para que nenhuma camada precise inventar texto.
 */
public record RecommendationReason(
        Long traitId,
        String traitCode,
        String traitName,
        BigDecimal percentage,
        Integer professionWeight,
        String description
) {
}
