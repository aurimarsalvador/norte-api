package br.com.norte.norte_api.question;

import java.util.List;

public record QuestionResponse(
        Long id,
        String code,
        String text,
        Integer displayOrder,
        List<AnswerOptionResponse> options
) {

    public static QuestionResponse from(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getCode(),
                question.getText(),
                question.getDisplayOrder(),
                question.getOptions().stream().map(AnswerOptionResponse::from).toList()
        );
    }
}
