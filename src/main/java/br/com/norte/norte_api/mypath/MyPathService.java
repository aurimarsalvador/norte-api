package br.com.norte.norte_api.mypath;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.assessment.Assessment;
import br.com.norte.norte_api.assessment.AssessmentAnswerRepository;
import br.com.norte.norte_api.assessment.AssessmentRepository;
import br.com.norte.norte_api.assessment.AssessmentStatus;
import br.com.norte.norte_api.feedback.FeedbackResponse;
import br.com.norte.norte_api.feedback.InterestLevel;
import br.com.norte.norte_api.feedback.ProfessionFeedback;
import br.com.norte.norte_api.feedback.ProfessionFeedbackService;
import br.com.norte.norte_api.microexperience.MicroExperienceService;
import br.com.norte.norte_api.recommendation.ProfileResponse;
import br.com.norte.norte_api.recommendation.RecommendationResponse;
import br.com.norte.norte_api.recommendation.RecommendationService;
import br.com.norte.norte_api.recommendation.TraitScoreResponse;
import br.com.norte.norte_api.student.StudentService;

/**
 * Agregador de leitura do painel "Meu Caminho".
 *
 * <p>Nao tem regra propria: monta a visao chamando os servicos donos de cada pedaco. Se o
 * calculo do perfil mudar, este painel acompanha sozinho, porque nao guarda uma copia da
 * formula.
 */
@Service
public class MyPathService {

    /** Quantos traits o painel destaca. O perfil completo continua em /assessments/{id}/profile. */
    private static final int TOP_TRAITS = 5;

    /** Quantas profissoes sugerir como proximo passo. */
    private static final int NEXT_STEPS = 3;

    private final StudentService studentService;
    private final AssessmentRepository assessmentRepository;
    private final AssessmentAnswerRepository answerRepository;
    private final RecommendationService recommendationService;
    private final ProfessionFeedbackService feedbackService;
    private final MicroExperienceService microExperienceService;

    public MyPathService(StudentService studentService,
                         AssessmentRepository assessmentRepository,
                         AssessmentAnswerRepository answerRepository,
                         RecommendationService recommendationService,
                         ProfessionFeedbackService feedbackService,
                         MicroExperienceService microExperienceService) {
        this.studentService = studentService;
        this.assessmentRepository = assessmentRepository;
        this.answerRepository = answerRepository;
        this.recommendationService = recommendationService;
        this.feedbackService = feedbackService;
        this.microExperienceService = microExperienceService;
    }

    @Transactional(readOnly = true)
    public MyPathResponse build(Long studentId) {
        Optional<Assessment> assessment = latestAssessment(studentId);

        List<FeedbackResponse> favorites = toResponses(
                feedbackService.listByStudentAndLevel(studentId, InterestLevel.FAVORITE));
        List<FeedbackResponse> discarded = toResponses(
                feedbackService.listByStudentAndLevel(studentId, InterestLevel.NOT_INTERESTED));

        List<TraitScoreResponse> topTraits = List.of();
        List<RecommendationResponse> nextSteps = List.of();

        if (assessment.isPresent()) {
            Long assessmentId = assessment.get().getId();

            ProfileResponse profile = recommendationService.calculateProfile(studentId, assessmentId);
            topTraits = profile.traits().stream().limit(TOP_TRAITS).toList();

            nextSteps = suggestNextSteps(studentId, assessmentId);
        }

        return new MyPathResponse(
                studentService.findProfile(studentId),
                assessment.map(this::toSummary).orElse(null),
                topTraits,
                favorites,
                discarded,
                microExperienceService.listAnswersByStudent(studentId),
                nextSteps
        );
    }

    /**
     * Prefere o ultimo questionario concluido; se nao houver nenhum, mostra o que estiver em
     * andamento, para o painel refletir onde o estudante realmente parou.
     */
    private Optional<Assessment> latestAssessment(Long studentId) {
        Optional<Assessment> completed = assessmentRepository
                .findFirstByStudentIdAndStatusOrderByCompletedAtDesc(studentId, AssessmentStatus.COMPLETED);

        return completed.isPresent()
                ? completed
                : assessmentRepository.findFirstByStudentIdAndStatusOrderByStartedAtDesc(
                        studentId, AssessmentStatus.IN_PROGRESS);
    }

    /**
     * Proximo passo util e a profissao de alta compatibilidade que o estudante ainda nao
     * olhou. Uma que ele ja marcou, mesmo que como descartada, nao e novidade nenhuma.
     */
    private List<RecommendationResponse> suggestNextSteps(Long studentId, Long assessmentId) {
        Set<Long> alreadyReviewed = new HashSet<>();
        for (FeedbackResponse feedback : feedbackService.listByStudent(studentId)) {
            alreadyReviewed.add(feedback.professionId());
        }

        return recommendationService.recommend(studentId, assessmentId, 0).stream()
                .filter(recommendation -> !alreadyReviewed.contains(recommendation.professionId()))
                .limit(NEXT_STEPS)
                .toList();
    }

    private MyPathAssessmentSummary toSummary(Assessment assessment) {
        return new MyPathAssessmentSummary(
                assessment.getId(),
                assessment.getStatus(),
                assessment.getStartedAt(),
                assessment.getCompletedAt(),
                answerRepository.countByAssessmentId(assessment.getId())
        );
    }

    private List<FeedbackResponse> toResponses(List<ProfessionFeedback> feedbacks) {
        return feedbacks.stream().map(FeedbackResponse::from).toList();
    }
}
