package br.com.norte.norte_api.mypath;

import java.util.List;

import br.com.norte.norte_api.feedback.FeedbackResponse;
import br.com.norte.norte_api.microexperience.MicroExperienceAnswerView;
import br.com.norte.norte_api.recommendation.RecommendationResponse;
import br.com.norte.norte_api.recommendation.TraitScoreResponse;
import br.com.norte.norte_api.student.StudentResponse;

/**
 * Painel consolidado da jornada do estudante.
 *
 * <p>{@code assessment} nulo significa que ele ainda nao comecou o questionario, e nesse caso
 * traits e proximos passos vem vazios. E um estado normal do produto, nao um erro: a tela deve
 * convidar a comecar a jornada.
 */
public record MyPathResponse(
        StudentResponse student,
        MyPathAssessmentSummary assessment,
        List<TraitScoreResponse> topTraits,
        List<FeedbackResponse> favorites,
        List<FeedbackResponse> discarded,
        List<MicroExperienceAnswerView> microExperiences,
        List<RecommendationResponse> nextSteps
) {
}
