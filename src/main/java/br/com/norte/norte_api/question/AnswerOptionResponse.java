package br.com.norte.norte_api.question;

public record AnswerOptionResponse(
        Long id,
        String text,
        Integer displayOrder
) {

    public static AnswerOptionResponse from(AnswerOption option) {
        return new AnswerOptionResponse(option.getId(), option.getText(), option.getDisplayOrder());
    }
}
