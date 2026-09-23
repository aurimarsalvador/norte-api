package br.com.norte.norte_api.feedback;

import jakarta.validation.constraints.NotNull;

public record FeedbackRequest(
        @NotNull(message = "Informe o nivel de interesse: FAVORITE, NEUTRAL ou NOT_INTERESTED.")
        InterestLevel interestLevel
) {
}
