package br.com.norte.norte_api.question;

public record AnswerOptionResponse(
        Long id,
        String description,
        Integer displayOrder
) {
}
