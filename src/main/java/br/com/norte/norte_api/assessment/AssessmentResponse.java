package br.com.norte.norte_api.assessment;

import java.time.Instant;
import java.util.List;

public record AssessmentResponse(
        Long id,
        AssessmentStatus status,
        Instant startedAt,
        Instant completedAt,
        long answeredCount,
        long totalQuestions,
        long minimumAnswersToComplete,
        List<AssessmentAnswerResponse> answers
) {
}
