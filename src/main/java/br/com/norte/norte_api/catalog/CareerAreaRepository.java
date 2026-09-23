package br.com.norte.norte_api.catalog;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CareerAreaRepository extends JpaRepository<CareerArea, Long> {

    Optional<CareerArea> findByCode(String code);

    List<CareerArea> findAllByOrderByNameAsc();
}
