package br.com.norte.norte_api.microexperience;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MicroExperienceRepository extends JpaRepository<MicroExperience, Long> {

    Optional<MicroExperience> findFirstByProfessionIdOrderByIdAsc(Long professionId);
}
