package br.com.norte.norte_api.assessment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    Optional<Assessment> findFirstByStudentIdAndStatusOrderByStartedAtDesc(Long studentId,
                                                                          AssessmentStatus status);

    Optional<Assessment> findFirstByStudentIdAndStatusOrderByCompletedAtDesc(Long studentId,
                                                                            AssessmentStatus status);

    List<Assessment> findByStudentIdOrderByStartedAtDesc(Long studentId);
}
