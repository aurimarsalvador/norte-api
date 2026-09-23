package br.com.norte.norte_api.feedback;

import java.time.Instant;

public record FeedbackResponse(
        Long professionId,
        String professionCode,
        String professionName,
        InterestLevel interestLevel,
        Instant updatedAt
) {

    public static FeedbackResponse from(ProfessionFeedback feedback) {
        return new FeedbackResponse(
                feedback.getProfession().getId(),
                feedback.getProfession().getCode(),
                feedback.getProfession().getName(),
                feedback.getInterestLevel(),
                feedback.getUpdatedAt()
        );
    }
}
