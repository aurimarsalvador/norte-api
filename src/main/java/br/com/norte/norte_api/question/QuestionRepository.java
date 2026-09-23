package br.com.norte.norte_api.question;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findByCode(String code);

    /**
     * Questoes ativas com as alternativas ja carregadas, em uma unica ida ao banco.
     * O {@code distinct} e necessario porque o join com as alternativas multiplica as linhas.
     */
    @Query("""
            select distinct q from Question q
            left join fetch q.options
            where q.active = true
            order by q.displayOrder asc
            """)
    List<Question> findActiveWithOptions();

    long countByActiveTrue();

    @Query("""
            select q from Question q
            left join fetch q.options
            where q.id = :id
            """)
    Optional<Question> findByIdWithOptions(@Param("id") Long id);
}
