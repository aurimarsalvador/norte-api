package br.com.norte.norte_api.assessment;

import java.time.Instant;

public record AssessmentAnswerResponse(
        Long questionId,
        String questionCode,
        Long answerOptionId,
        Instant answeredAt
) {

    public static AssessmentAnswerResponse from(AssessmentAnswer answer) {
        return new AssessmentAnswerResponse(
                answer.getQuestion().getId(),
                answer.getQuestion().getCode(),
                answer.getAnswerOption().getId(),
                answer.getAnsweredAt()
        );
    }
}
