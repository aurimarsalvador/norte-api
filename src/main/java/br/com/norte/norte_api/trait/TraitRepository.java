package br.com.norte.norte_api.trait;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TraitRepository extends JpaRepository<Trait, Long> {

    Optional<Trait> findByCode(String code);

    List<Trait> findAllByOrderByNameAsc();
}
