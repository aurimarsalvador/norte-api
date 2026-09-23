package br.com.norte.norte_api.assessment;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.common.BusinessRuleException;
import br.com.norte.norte_api.common.ForbiddenOperationException;
import br.com.norte.norte_api.common.ResourceNotFoundException;
import br.com.norte.norte_api.question.AnswerOption;
import br.com.norte.norte_api.question.AnswerOptionRepository;
import br.com.norte.norte_api.question.Question;
import br.com.norte.norte_api.question.QuestionRepository;
import br.com.norte.norte_api.student.Student;
import br.com.norte.norte_api.student.StudentService;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentAnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;
    private final StudentService studentService;
    private final long minimumAnswers;

    public AssessmentService(AssessmentRepository assessmentRepository,
                             AssessmentAnswerRepository answerRepository,
                             QuestionRepository questionRepository,
                             AnswerOptionRepository answerOptionRepository,
                             StudentService studentService,
                             @Value("${norte.assessment.minimum-answers}") long minimumAnswers) {
        this.assessmentRepository = assessmentRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
        this.studentService = studentService;
        this.minimumAnswers = minimumAnswers;
    }

    /**
     * Reaproveita o assessment em aberto do estudante em vez de acumular rascunhos: quem
     * fecha o navegador no meio da jornada volta exatamente de onde parou.
     */
    @Transactional
    public AssessmentResponse startOrResume(Long studentId) {
        Assessment assessment = assessmentRepository
                .findFirstByStudentIdAndStatusOrderByStartedAtDesc(studentId, AssessmentStatus.IN_PROGRESS)
                .orElseGet(() -> {
                    Student student = studentService.requireById(studentId);
                    return assessmentRepository.save(new Assessment(student));
                });

        return toResponse(assessment);
    }

    @Transactional(readOnly = true)
    public AssessmentResponse findById(Long studentId, Long assessmentId) {
        return toResponse(requireOwnedAssessment(studentId, assessmentId));
    }

    @Transactional
    public AssessmentResponse answer(Long studentId, Long assessmentId, AnswerRequest request) {
        Assessment assessment = requireOwnedAssessment(studentId, assessmentId);

        if (assessment.isCompleted()) {
            throw new BusinessRuleException(
                    "Este questionario ja foi concluido e nao aceita novas respostas.");
        }

        Question question = questionRepository.findById(request.questionId())
                .orElseThrow(() -> ResourceNotFoundException.of("Questao", request.questionId()));

        if (!question.isActive()) {
            throw new BusinessRuleException("Esta questao nao faz mais parte do questionario.");
        }

        AnswerOption option = answerOptionRepository.findById(request.answerOptionId())
                .orElseThrow(() -> ResourceNotFoundException.of("Alternativa", request.answerOptionId()));

        if (!option.getQuestion().getId().equals(question.getId())) {
            throw new BusinessRuleException("A alternativa escolhida nao pertence a esta questao.");
        }

        answerRepository.findByAssessmentIdAndQuestionId(assessmentId, question.getId())
                .ifPresentOrElse(
                        existing -> existing.changeTo(option),
                        () -> answerRepository.save(new AssessmentAnswer(assessment, question, option)));

        return toResponse(assessment);
    }

    @Transactional
    public AssessmentResponse complete(Long studentId, Long assessmentId) {
        Assessment assessment = requireOwnedAssessment(studentId, assessmentId);

        if (assessment.isCompleted()) {
            return toResponse(assessment);
        }

        long answered = answerRepository.countByAssessmentId(assessmentId);
        if (answered < minimumAnswers) {
            throw new BusinessRuleException("Responda pelo menos " + minimumAnswers
                    + " questoes para concluir. Voce respondeu " + answered + ".");
        }

        assessment.complete();
        return toResponse(assessment);
    }

    /**
     * Carrega o assessment garantindo que ele pertence a quem esta pedindo. Responder 404 para
     * o questionario de outro estudante esconderia menos do que parece e confundiria o cliente;
     * a decisao aqui e devolver 403 explicitamente.
     */
    @Transactional(readOnly = true)
    public Assessment requireOwnedAssessment(Long studentId, Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Questionario", assessmentId));

        if (!assessment.belongsTo(studentId)) {
            throw new ForbiddenOperationException("Este questionario pertence a outro estudante.");
        }

        return assessment;
    }

    private AssessmentResponse toResponse(Assessment assessment) {
        List<AssessmentAnswer> answers =
                answerRepository.findByAssessmentIdWithQuestionAndOption(assessment.getId());

        return new AssessmentResponse(
                assessment.getId(),
                assessment.getStatus(),
                assessment.getStartedAt(),
                assessment.getCompletedAt(),
                answers.size(),
                questionRepository.countByActiveTrue(),
                minimumAnswers,
                answers.stream().map(AssessmentAnswerResponse::from).toList()
        );
    }
}
