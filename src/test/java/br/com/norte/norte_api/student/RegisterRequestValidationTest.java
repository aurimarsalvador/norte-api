package br.com.norte.norte_api.student;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

/**
 * A regra de senha tem que ser a mesma do checklist da tela de cadastro, senao o formulario
 * libera o botao e a API recusa. Roda so o Bean Validation, sem subir contexto nem Docker.
 */
class RegisterRequestValidationTest {

    private static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = factory.getValidator();

    @AfterAll
    static void closeFactory() {
        factory.close();
    }

    private static Set<String> invalidFields(String password) {
        RegisterRequest request = new RegisterRequest("Ana", "ana@teste.com", password, 3);
        return validator.validate(request).stream()
                .map(ConstraintViolation::getPropertyPath)
                .map(Object::toString)
                .collect(Collectors.toSet());
    }

    @ParameterizedTest
    @ValueSource(strings = {"senha12345", "1234abcd", "ação2026", "Senha 1 com espaco"})
    @DisplayName("aceita senha com 8+ caracteres, uma letra e um numero")
    void acceptsPasswordWithLetterAndDigit(String password) {
        assertThat(invalidFields(password)).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(strings = {"12345678", "somenteletras", "!!!!@@@@", "abc1"})
    @DisplayName("recusa senha sem letra, sem numero ou curta demais")
    void rejectsPasswordMissingARule(String password) {
        assertThat(invalidFields(password)).containsExactly("password");
    }
}
