package br.com.norte.norte_api.feedback;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfessionFeedbackRepository extends JpaRepository<ProfessionFeedback, Long> {

    Optional<ProfessionFeedback> findByStudentIdAndProfessionId(Long studentId, Long professionId);

    @Query("""
            select f from ProfessionFeedback f
            join fetch f.profession p
            join fetch p.careerArea
            where f.student.id = :studentId
            order by f.updatedAt desc
            """)
    List<ProfessionFeedback> findByStudentIdWithProfession(@Param("studentId") Long studentId);

    @Query("""
            select f from ProfessionFeedback f
            join fetch f.profession p
            join fetch p.careerArea
            where f.student.id = :studentId and f.interestLevel = :interestLevel
            order by f.updatedAt desc
            """)
    List<ProfessionFeedback> findByStudentIdAndInterestLevelWithProfession(
            @Param("studentId") Long studentId,
            @Param("interestLevel") InterestLevel interestLevel);
}
