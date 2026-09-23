package br.com.norte.norte_api.feedback;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.catalog.Profession;
import br.com.norte.norte_api.catalog.ProfessionRepository;
import br.com.norte.norte_api.common.ResourceNotFoundException;
import br.com.norte.norte_api.student.Student;
import br.com.norte.norte_api.student.StudentService;

@Service
public class ProfessionFeedbackService {

    private final ProfessionFeedbackRepository feedbackRepository;
    private final ProfessionRepository professionRepository;
    private final StudentService studentService;

    public ProfessionFeedbackService(ProfessionFeedbackRepository feedbackRepository,
                                     ProfessionRepository professionRepository,
                                     StudentService studentService) {
        this.feedbackRepository = feedbackRepository;
        this.professionRepository = professionRepository;
        this.studentService = studentService;
    }

    /**
     * Upsert: reenviar o feedback troca o nivel de interesse em vez de acumular linhas. O
     * estudante muda de ideia durante a exploracao, e isso e esperado.
     */
    @Transactional
    public FeedbackResponse save(Long studentId, Long professionId, FeedbackRequest request) {
        Profession profession = professionRepository.findById(professionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Profissao", professionId));

        ProfessionFeedback feedback = feedbackRepository
                .findByStudentIdAndProfessionId(studentId, professionId)
                .map(existing -> {
                    existing.changeTo(request.interestLevel());
                    return existing;
                })
                .orElseGet(() -> {
                    Student student = studentService.requireById(studentId);
                    return feedbackRepository.save(
                            new ProfessionFeedback(student, profession, request.interestLevel()));
                });

        return FeedbackResponse.from(feedback);
    }

    @Transactional(readOnly = true)
    public Optional<InterestLevel> findInterestLevel(Long studentId, Long professionId) {
        return feedbackRepository.findByStudentIdAndProfessionId(studentId, professionId)
                .map(ProfessionFeedback::getInterestLevel);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> listByStudent(Long studentId) {
        return feedbackRepository.findByStudentIdWithProfession(studentId).stream()
                .map(FeedbackResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProfessionFeedback> listByStudentAndLevel(Long studentId, InterestLevel interestLevel) {
        return feedbackRepository.findByStudentIdAndInterestLevelWithProfession(studentId, interestLevel);
    }
}
