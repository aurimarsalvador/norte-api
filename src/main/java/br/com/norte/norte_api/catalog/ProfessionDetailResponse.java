package br.com.norte.norte_api.catalog;

import java.math.BigDecimal;
import java.util.List;

import br.com.norte.norte_api.feedback.InterestLevel;
import br.com.norte.norte_api.microexperience.MicroExperienceView;
import br.com.norte.norte_api.recommendation.RecommendationReason;

/**
 * Perfil completo de uma profissao: area, o que se faz, como se forma, os traits exigidos e a
 * microexperiencia associada.
 *
 * <p>Quando a consulta informa um questionario, vem tambem a compatibilidade e as razoes dela.
 * {@code reasons} vazio com {@code compatibility} preenchido nao e defeito: significa que
 * nenhum trait alcancou o corte de confianca, e a tela deve tratar a profissao como convite a
 * explorar, nunca como indicacao.
 */
public record ProfessionDetailResponse(
        Long id,
        String code,
        String name,
        String summary,
        String description,
        String typicalActivities,
        String educationPath,
        CareerAreaResponse careerArea,
        List<ProfessionTraitResponse> requiredTraits,
        MicroExperienceView microExperience,
        BigDecimal compatibility,
        List<RecommendationReason> reasons,
        InterestLevel interestLevel
) {
}
