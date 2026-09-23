package br.com.norte.norte_api.student;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Informe o seu nome.")
        @Size(max = 150, message = "O nome deve ter no maximo 150 caracteres.")
        String name,

        @NotBlank(message = "Informe o seu e-mail.")
        @Email(message = "Informe um e-mail valido.")
        @Size(max = 180, message = "O e-mail deve ter no maximo 180 caracteres.")
        String email,

        @NotBlank(message = "Informe uma senha.")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres.")
        // Mesma regra do checklist da tela de cadastro: pelo menos uma letra e um numero.
        @Pattern(regexp = "(?s)(?=.*\\p{L})(?=.*\\d).*",
                message = "A senha deve ter pelo menos uma letra e um numero.")
        String password,

        @NotNull(message = "Informe o ano escolar.")
        @Min(value = 1, message = "O ano escolar deve estar entre 1 e 3.")
        @Max(value = 3, message = "O ano escolar deve estar entre 1 e 3.")
        Integer schoolYear
) {
}
