package br.com.norte.norte_api.catalog;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.common.ResourceNotFoundException;
import br.com.norte.norte_api.feedback.InterestLevel;
import br.com.norte.norte_api.feedback.ProfessionFeedback;
import br.com.norte.norte_api.feedback.ProfessionFeedbackRepository;
import br.com.norte.norte_api.microexperience.MicroExperienceService;
import br.com.norte.norte_api.microexperience.MicroExperienceView;
import br.com.norte.norte_api.recommendation.RecommendationResponse;
import br.com.norte.norte_api.recommendation.RecommendationService;

/**
 * Leitura do catalogo de profissoes.
 *
 * <p>A compatibilidade nunca e recalculada aqui: quando a consulta informa um questionario,
 * este servico pede o resultado ao {@link RecommendationService} e apenas o casa com as
 * profissoes. Duplicar a formula em um segundo lugar seria a forma mais rapida de as duas
 * telas passarem a discordar entre si.
 */
@Service
public class ProfessionService {

    private final ProfessionRepository professionRepository;
    private final ProfessionTraitRepository professionTraitRepository;
    private final CareerAreaRepository careerAreaRepository;
    private final ProfessionFeedbackRepository feedbackRepository;
    private final MicroExperienceService microExperienceService;
    private final RecommendationService recommendationService;

    public ProfessionService(ProfessionRepository professionRepository,
                             ProfessionTraitRepository professionTraitRepository,
                             CareerAreaRepository careerAreaRepository,
                             ProfessionFeedbackRepository feedbackRepository,
                             MicroExperienceService microExperienceService,
                             RecommendationService recommendationService) {
        this.professionRepository = professionRepository;
        this.professionTraitRepository = professionTraitRepository;
        this.careerAreaRepository = careerAreaRepository;
        this.feedbackRepository = feedbackRepository;
        this.microExperienceService = microExperienceService;
        this.recommendationService = recommendationService;
    }

    @Transactional(readOnly = true)
    public List<CareerAreaResponse> listCareerAreas() {
        return careerAreaRepository.findAllByOrderByNameAsc().stream()
                .map(CareerAreaResponse::from)
                .toList();
    }

    /**
     * Catalogo do explorador, opcionalmente filtrado por area e enriquecido com a
     * compatibilidade de um questionario.
     *
     * @param assessmentId questionario do estudante, ou {@code null} para listar sem percentuais
     */
    @Transactional(readOnly = true)
    public List<ProfessionSummaryResponse> list(Long studentId, String areaCode, Long assessmentId) {
        List<Profession> professions = areaCode == null || areaCode.isBlank()
                ? professionRepository.findAllWithArea()
                : professionRepository.findAllWithAreaByAreaCode(areaCode);

        if (professions.isEmpty() && areaCode != null && !areaCode.isBlank()) {
            careerAreaRepository.findByCode(areaCode)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Nao existe area profissional com o codigo " + areaCode + "."));
        }

        Map<Long, RecommendationResponse> byProfession = recommendationsByProfession(studentId, assessmentId);
        Map<Long, InterestLevel> feedbacks = feedbacksByProfession(studentId);

        List<ProfessionSummaryResponse> summaries = new ArrayList<>(professions.size());
        for (Profession profession : professions) {
            RecommendationResponse recommendation = byProfession.get(profession.getId());
            summaries.add(new ProfessionSummaryResponse(
                    profession.getId(),
                    profession.getCode(),
                    profession.getName(),
                    profession.getSummary(),
                    CareerAreaResponse.from(profession.getCareerArea()),
                    recommendation == null ? null : recommendation.compatibility(),
                    recommendation == null ? List.of() : recommendation.reasons(),
                    feedbacks.get(profession.getId())
            ));
        }

        // Com questionario, a ordem util e a da compatibilidade; sem ele, a alfabetica que o
        // repositorio ja devolveu. Profissao sem trait cadastrado nao aparece no calculo e cai
        // para o fim da lista em vez de derrubar a ordenacao.
        if (!byProfession.isEmpty()) {
            summaries.sort(Comparator
                    .comparing(ProfessionSummaryResponse::compatibility,
                            Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(ProfessionSummaryResponse::name));
        }

        return List.copyOf(summaries);
    }

    @Transactional(readOnly = true)
    public ProfessionDetailResponse findDetail(Long studentId, Long professionId, Long assessmentId) {
        Profession profession = professionRepository.findByIdWithArea(professionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Profissao", professionId));

        List<ProfessionTraitResponse> requiredTraits =
                professionTraitRepository.findByProfessionIdWithTrait(professionId).stream()
                        .map(ProfessionTraitResponse::from)
                        .toList();

        MicroExperienceView microExperience =
                microExperienceService.findByProfessionId(professionId).orElse(null);

        RecommendationResponse recommendation = assessmentId == null
                ? null
                : recommendationService.recommendSingle(studentId, assessmentId, profession);

        InterestLevel interestLevel = feedbackRepository
                .findByStudentIdAndProfessionId(studentId, professionId)
                .map(ProfessionFeedback::getInterestLevel)
                .orElse(null);

        return new ProfessionDetailResponse(
                profession.getId(),
                profession.getCode(),
                profession.getName(),
                profession.getSummary(),
                profession.getDescription(),
                profession.getTypicalActivities(),
                profession.getEducationPath(),
                CareerAreaResponse.from(profession.getCareerArea()),
                requiredTraits,
                microExperience,
                recommendation == null ? null : recommendation.compatibility(),
                recommendation == null ? List.of() : recommendation.reasons(),
                interestLevel
        );
    }

    private Map<Long, RecommendationResponse> recommendationsByProfession(Long studentId,
                                                                         Long assessmentId) {
        if (assessmentId == null) {
            return Map.of();
        }

        Map<Long, RecommendationResponse> byProfession = new LinkedHashMap<>();
        for (RecommendationResponse recommendation
                : recommendationService.recommend(studentId, assessmentId, 0)) {
            byProfession.put(recommendation.professionId(), recommendation);
        }
        return byProfession;
    }

    private Map<Long, InterestLevel> feedbacksByProfession(Long studentId) {
        Map<Long, InterestLevel> feedbacks = new HashMap<>();
        for (ProfessionFeedback feedback : feedbackRepository.findByStudentIdWithProfession(studentId)) {
            feedbacks.put(feedback.getProfession().getId(), feedback.getInterestLevel());
        }
        return feedbacks;
    }
}
