package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;

public record TraitScoreResponse(
        Long traitId,
        String code,
        String name,
        String description,
        BigDecimal percentage
) {
}
