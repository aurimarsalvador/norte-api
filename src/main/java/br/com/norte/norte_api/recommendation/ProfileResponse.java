package br.com.norte.norte_api.recommendation;

import java.util.List;

import br.com.norte.norte_api.assessment.AssessmentStatus;

public record ProfileResponse(
        Long assessmentId,
        AssessmentStatus status,
        long answeredQuestions,
        List<TraitScoreResponse> traits
) {
}
