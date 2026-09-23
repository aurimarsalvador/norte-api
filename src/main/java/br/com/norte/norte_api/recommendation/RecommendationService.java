package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.assessment.Assessment;
import br.com.norte.norte_api.assessment.AssessmentAnswer;
import br.com.norte.norte_api.assessment.AssessmentAnswerRepository;
import br.com.norte.norte_api.assessment.AssessmentService;
import br.com.norte.norte_api.catalog.Profession;
import br.com.norte.norte_api.catalog.ProfessionTrait;
import br.com.norte.norte_api.catalog.ProfessionTraitRepository;
import br.com.norte.norte_api.question.OptionTraitWeightRepository;
import br.com.norte.norte_api.question.OptionTraitWeightRow;
import br.com.norte.norte_api.question.QuestionTraitMaxWeightRow;
import br.com.norte.norte_api.trait.Trait;
import br.com.norte.norte_api.trait.TraitRepository;

/**
 * Cola entre o motor puro e a persistencia.
 *
 * <p>Todo acesso a dados acontece em consultas em lote, antes de qualquer laco: o calculo
 * percorre dezenas de profissoes, e buscar os pesos de cada uma dentro do laco seria um N+1
 * garantido.
 */
@Service
public class RecommendationService {

    private final AssessmentService assessmentService;
    private final AssessmentAnswerRepository answerRepository;
    private final OptionTraitWeightRepository optionTraitWeightRepository;
    private final ProfessionTraitRepository professionTraitRepository;
    private final TraitRepository traitRepository;
    private final ProfileCalculator profileCalculator;
    private final CompatibilityCalculator compatibilityCalculator;
    private final ExplanationBuilder explanationBuilder;

    public RecommendationService(AssessmentService assessmentService,
                                 AssessmentAnswerRepository answerRepository,
                                 OptionTraitWeightRepository optionTraitWeightRepository,
                                 ProfessionTraitRepository professionTraitRepository,
                                 TraitRepository traitRepository,
                                 ProfileCalculator profileCalculator,
                                 CompatibilityCalculator compatibilityCalculator,
                                 ExplanationBuilder explanationBuilder) {
        this.assessmentService = assessmentService;
        this.answerRepository = answerRepository;
        this.optionTraitWeightRepository = optionTraitWeightRepository;
        this.professionTraitRepository = professionTraitRepository;
        this.traitRepository = traitRepository;
        this.profileCalculator = profileCalculator;
        this.compatibilityCalculator = compatibilityCalculator;
        this.explanationBuilder = explanationBuilder;
    }

    @Transactional(readOnly = true)
    public ProfileResponse calculateProfile(Long studentId, Long assessmentId) {
        Assessment assessment = assessmentService.requireOwnedAssessment(studentId, assessmentId);
        List<AssessmentAnswer> answers =
                answerRepository.findByAssessmentIdWithQuestionAndOption(assessmentId);

        TraitProfile profile = buildProfile(answers);
        Map<Long, Trait> traits = traitsById();

        List<TraitScoreResponse> scores = profile.sortedDescending().stream()
                .map(entry -> {
                    Trait trait = traits.get(entry.getKey());
                    return new TraitScoreResponse(trait.getId(), trait.getCode(), trait.getName(),
                            trait.getDescription(), entry.getValue());
                })
                .toList();

        return new ProfileResponse(assessment.getId(), assessment.getStatus(), answers.size(), scores);
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> recommend(Long studentId, Long assessmentId, int limit) {
        assessmentService.requireOwnedAssessment(studentId, assessmentId);

        TraitProfile profile =
                buildProfile(answerRepository.findByAssessmentIdWithQuestionAndOption(assessmentId));
        Map<Long, Trait> traits = traitsById();

        // Uma unica consulta traz a matriz profissao x trait inteira; o agrupamento e por id,
        // e nao pela entidade, para nao depender da identidade de instancia do Hibernate.
        Map<Long, Profession> professionsById = new LinkedHashMap<>();
        Map<Long, List<ProfessionTrait>> requirementsByProfession = new LinkedHashMap<>();
        for (ProfessionTrait professionTrait : professionTraitRepository.findAllWithTraitAndProfession()) {
            Profession profession = professionTrait.getProfession();
            professionsById.putIfAbsent(profession.getId(), profession);
            requirementsByProfession
                    .computeIfAbsent(profession.getId(), key -> new ArrayList<>())
                    .add(professionTrait);
        }

        List<RecommendationResponse> recommendations = new ArrayList<>(professionsById.size());
        professionsById.forEach((professionId, profession) -> recommendations.add(
                toRecommendation(profile, traits, profession, requirementsByProfession.get(professionId))));

        recommendations.sort(Comparator
                .comparing(RecommendationResponse::compatibility).reversed()
                .thenComparing(RecommendationResponse::professionName));

        return limit > 0 && limit < recommendations.size()
                ? List.copyOf(recommendations.subList(0, limit))
                : List.copyOf(recommendations);
    }

    /**
     * Compatibilidade de uma unica profissao, usada pela tela de detalhe.
     */
    @Transactional(readOnly = true)
    public RecommendationResponse recommendSingle(Long studentId, Long assessmentId, Profession profession) {
        assessmentService.requireOwnedAssessment(studentId, assessmentId);

        TraitProfile profile =
                buildProfile(answerRepository.findByAssessmentIdWithQuestionAndOption(assessmentId));

        return toRecommendation(profile, traitsById(), profession,
                professionTraitRepository.findByProfessionIdWithTrait(profession.getId()));
    }

    /**
     * Reconstroi P(t) a partir das respostas: uma consulta para os pesos das alternativas
     * escolhidas e outra, ja agregada no banco, para o maximo alcancavel em cada questao
     * respondida.
     */
    @Transactional(readOnly = true)
    public TraitProfile buildProfile(List<AssessmentAnswer> answers) {
        if (answers.isEmpty()) {
            return TraitProfile.empty();
        }

        List<Long> optionIds = answers.stream()
                .map(answer -> answer.getAnswerOption().getId())
                .toList();
        List<Long> questionIds = answers.stream()
                .map(answer -> answer.getQuestion().getId())
                .toList();

        Map<Long, Map<Long, Integer>> chosenByOption = new HashMap<>();
        for (OptionTraitWeightRow row : optionTraitWeightRepository.findWeightsByOptionIds(optionIds)) {
            chosenByOption.computeIfAbsent(row.answerOptionId(), key -> new HashMap<>())
                    .put(row.traitId(), row.weight());
        }

        Map<Long, Map<Long, Integer>> maxByQuestion = new HashMap<>();
        for (QuestionTraitMaxWeightRow row
                : optionTraitWeightRepository.findMaxWeightsByQuestionIds(questionIds)) {
            maxByQuestion.computeIfAbsent(row.questionId(), key -> new HashMap<>())
                    .put(row.traitId(), row.maxWeight());
        }

        List<AnsweredQuestionWeights> weights = answers.stream()
                .map(answer -> new AnsweredQuestionWeights(
                        answer.getQuestion().getId(),
                        chosenByOption.getOrDefault(answer.getAnswerOption().getId(), Map.of()),
                        maxByQuestion.getOrDefault(answer.getQuestion().getId(), Map.of())))
                .toList();

        return profileCalculator.calculate(weights);
    }

    private RecommendationResponse toRecommendation(TraitProfile profile,
                                                    Map<Long, Trait> traits,
                                                    Profession profession,
                                                    List<ProfessionTrait> professionTraits) {

        List<ProfessionTraitWeight> requirements = professionTraits.stream()
                .map(professionTrait -> new ProfessionTraitWeight(
                        professionTrait.getTrait().getId(), professionTrait.getWeight()))
                .toList();

        BigDecimal compatibility = compatibilityCalculator.calculate(profile, requirements);
        List<RecommendationReason> reasons = explanationBuilder.build(profile, requirements).stream()
                .map(contribution -> toReason(traits.get(contribution.traitId()), contribution))
                .toList();

        return new RecommendationResponse(
                profession.getId(),
                profession.getCode(),
                profession.getName(),
                profession.getSummary(),
                profession.getCareerArea().getCode(),
                profession.getCareerArea().getName(),
                compatibility,
                reasons
        );
    }

    private RecommendationReason toReason(Trait trait, TraitContribution contribution) {
        String description = "Voce pontuou "
                + contribution.percentage().stripTrailingZeros().toPlainString()
                + "% em " + trait.getName().toLowerCase()
                + ", e essa caracteristica pesa " + contribution.weight()
                + " de 5 no dia a dia dessa profissao.";

        return new RecommendationReason(
                trait.getId(),
                trait.getCode(),
                trait.getName(),
                contribution.percentage(),
                contribution.weight(),
                description
        );
    }

    private Map<Long, Trait> traitsById() {
        return traitRepository.findAll().stream()
                .collect(Collectors.toMap(Trait::getId, Function.identity()));
    }
}
