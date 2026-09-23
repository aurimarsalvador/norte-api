package br.com.norte.norte_api.microexperience;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.common.ResourceNotFoundException;
import br.com.norte.norte_api.student.Student;
import br.com.norte.norte_api.student.StudentService;

@Service
public class MicroExperienceService {

    private final MicroExperienceRepository microExperienceRepository;
    private final MicroExperienceResponseRepository responseRepository;
    private final StudentService studentService;

    public MicroExperienceService(MicroExperienceRepository microExperienceRepository,
                                  MicroExperienceResponseRepository responseRepository,
                                  StudentService studentService) {
        this.microExperienceRepository = microExperienceRepository;
        this.responseRepository = responseRepository;
        this.studentService = studentService;
    }

    @Transactional(readOnly = true)
    public Optional<MicroExperienceView> findByProfessionId(Long professionId) {
        return microExperienceRepository.findFirstByProfessionIdOrderByIdAsc(professionId)
                .map(MicroExperienceView::from);
    }

    @Transactional(readOnly = true)
    public MicroExperienceView requireByProfessionId(Long professionId) {
        return findByProfessionId(professionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Esta profissao ainda nao tem microexperiencia cadastrada."));
    }

    /**
     * Upsert por (microexperiencia, estudante): refazer a tarefa e reavaliar substitui o
     * relato anterior em vez de duplica-lo.
     */
    @Transactional
    public MicroExperienceAnswerView respond(Long studentId, Long microExperienceId,
                                             MicroExperienceAnswerRequest request) {

        MicroExperience experience = microExperienceRepository.findById(microExperienceId)
                .orElseThrow(() -> ResourceNotFoundException.of("Microexperiencia", microExperienceId));

        MicroExperienceResponse response = responseRepository
                .findByMicroExperienceIdAndStudentId(microExperienceId, studentId)
                .map(existing -> {
                    existing.update(request.enjoymentRating(), request.difficultyRating(), request.notes());
                    return existing;
                })
                .orElseGet(() -> {
                    Student student = studentService.requireById(studentId);
                    return responseRepository.save(new MicroExperienceResponse(experience, student,
                            request.enjoymentRating(), request.difficultyRating(), request.notes()));
                });

        return MicroExperienceAnswerView.from(response);
    }

    @Transactional(readOnly = true)
    public List<MicroExperienceAnswerView> listAnswersByStudent(Long studentId) {
        return responseRepository.findByStudentIdWithExperience(studentId).stream()
                .map(MicroExperienceAnswerView::from)
                .toList();
    }
}
