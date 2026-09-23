package br.com.norte.norte_api.recommendation;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Expoe o motor como beans sem sujar as classes de dominio com anotacoes: elas continuam
 * instanciaveis com {@code new} dentro dos testes unitarios, sem contexto Spring.
 */
@Configuration
public class RecommendationEngineConfig {

    @Bean
    public ProfileCalculator profileCalculator() {
        return new ProfileCalculator();
    }

    @Bean
    public CompatibilityCalculator compatibilityCalculator() {
        return new CompatibilityCalculator();
    }

    @Bean
    public ExplanationBuilder explanationBuilder() {
        return new ExplanationBuilder();
    }
}
