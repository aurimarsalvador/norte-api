package br.com.norte.norte_api.microexperience;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MicroExperienceResponseRepository extends JpaRepository<MicroExperienceResponse, Long> {

    Optional<MicroExperienceResponse> findByMicroExperienceIdAndStudentId(Long microExperienceId,
                                                                         Long studentId);

    @Query("""
            select r from MicroExperienceResponse r
            join fetch r.microExperience m
            join fetch m.profession
            where r.student.id = :studentId
            order by r.respondedAt desc
            """)
    List<MicroExperienceResponse> findByStudentIdWithExperience(@Param("studentId") Long studentId);
}
