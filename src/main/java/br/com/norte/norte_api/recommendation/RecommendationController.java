package br.com.norte.norte_api.recommendation;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.validation.annotation.Validated;

import br.com.norte.norte_api.security.CurrentStudent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@Validated
@RequestMapping("/assessments")
public class RecommendationController {

    private static final int DEFAULT_LIMIT = 10;

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/{assessmentId}/profile")
    public ProfileResponse profile(@CurrentStudent Long studentId,
                                   @PathVariable Long assessmentId) {
        return recommendationService.calculateProfile(studentId, assessmentId);
    }

    @GetMapping("/{assessmentId}/recommendations")
    public List<RecommendationResponse> recommendations(
            @CurrentStudent Long studentId,
            @PathVariable Long assessmentId,
            @RequestParam(defaultValue = "" + DEFAULT_LIMIT)
            @Min(value = 1, message = "O limite minimo e 1.")
            @Max(value = 50, message = "O limite maximo e 50.") int limit) {

        return recommendationService.recommend(studentId, assessmentId, limit);
    }
}
