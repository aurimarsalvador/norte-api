package br.com.norte.norte_api.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProfessionRepository extends JpaRepository<Profession, Long> {

    Optional<Profession> findByCode(String code);

    @Query("""
            select p from Profession p
            join fetch p.careerArea
            order by p.name asc
            """)
    List<Profession> findAllWithArea();

    @Query("""
            select p from Profession p
            join fetch p.careerArea area
            where area.code = :areaCode
            order by p.name asc
            """)
    List<Profession> findAllWithAreaByAreaCode(@Param("areaCode") String areaCode);

    @Query("""
            select p from Profession p
            join fetch p.careerArea
            where p.id = :id
            """)
    Optional<Profession> findByIdWithArea(@Param("id") Long id);

    @Query("""
            select p from Profession p
            join fetch p.careerArea
            where p.id in :ids
            """)
    List<Profession> findAllWithAreaByIdIn(@Param("ids") List<Long> ids);
}
