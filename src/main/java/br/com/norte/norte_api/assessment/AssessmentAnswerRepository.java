package br.com.norte.norte_api.assessment;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AssessmentAnswerRepository extends JpaRepository<AssessmentAnswer, Long> {

    Optional<AssessmentAnswer> findByAssessmentIdAndQuestionId(Long assessmentId, Long questionId);

    long countByAssessmentId(Long assessmentId);

    @Query("""
            select a from AssessmentAnswer a
            join fetch a.question q
            join fetch a.answerOption
            where a.assessment.id = :assessmentId
            order by q.displayOrder asc
            """)
    List<AssessmentAnswer> findByAssessmentIdWithQuestionAndOption(@Param("assessmentId") Long assessmentId);
}
