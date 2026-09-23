package br.com.norte.norte_api.mypath;

import java.time.Instant;

import br.com.norte.norte_api.assessment.AssessmentStatus;

public record MyPathAssessmentSummary(
        Long id,
        AssessmentStatus status,
        Instant startedAt,
        Instant completedAt,
        long answeredQuestions
) {
}
