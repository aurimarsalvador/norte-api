package br.com.norte.norte_api.catalog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfessionTraitRepository extends JpaRepository<ProfessionTrait, Long> {

    /**
     * Carrega a matriz inteira de uma vez. As recomendacoes percorrem todas as profissoes,
     * entao buscar os pesos por profissao dentro do laco seria um N+1 garantido.
     */
    @Query("""
            select pt from ProfessionTrait pt
            join fetch pt.trait
            join fetch pt.profession
            """)
    List<ProfessionTrait> findAllWithTraitAndProfession();

    @Query("""
            select pt from ProfessionTrait pt
            join fetch pt.trait
            where pt.profession.id = :professionId
            order by pt.weight desc, pt.trait.name asc
            """)
    List<ProfessionTrait> findByProfessionIdWithTrait(@Param("professionId") Long professionId);
}
