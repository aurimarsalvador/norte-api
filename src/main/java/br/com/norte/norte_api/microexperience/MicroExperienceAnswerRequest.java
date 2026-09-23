package br.com.norte.norte_api.microexperience;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MicroExperienceAnswerRequest(
        @NotNull(message = "Diga o quanto voce gostou, de 1 a 5.")
        @Min(value = 1, message = "A nota deve estar entre 1 e 5.")
        @Max(value = 5, message = "A nota deve estar entre 1 e 5.")
        Integer enjoymentRating,

        @NotNull(message = "Diga o quanto voce achou dificil, de 1 a 5.")
        @Min(value = 1, message = "A nota deve estar entre 1 e 5.")
        @Max(value = 5, message = "A nota deve estar entre 1 e 5.")
        Integer difficultyRating,

        @Size(max = 1000, message = "O comentario deve ter no maximo 1000 caracteres.")
        String notes
) {
}
