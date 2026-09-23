package br.com.norte.norte_api.assessment;

import jakarta.validation.constraints.NotNull;

public record AnswerRequest(
        @NotNull(message = "Informe a questao respondida.")
        Long questionId,

        @NotNull(message = "Informe a alternativa escolhida.")
        Long answerOptionId
) {
}
