package br.com.norte.norte_api.catalog;

import java.math.BigDecimal;
import java.util.List;

import br.com.norte.norte_api.feedback.InterestLevel;
import br.com.norte.norte_api.recommendation.RecommendationReason;

/**
 * Item da lista do explorador de profissoes.
 *
 * <p>{@code compatibility} e {@code reasons} so vem preenchidos quando a consulta informa um
 * questionario concluido. Sem isso o catalogo continua navegavel, apenas sem percentual: e
 * melhor nao mostrar numero nenhum do que mostrar um numero sem lastro.
 */
public record ProfessionSummaryResponse(
        Long id,
        String code,
        String name,
        String summary,
        CareerAreaResponse careerArea,
        BigDecimal compatibility,
        List<RecommendationReason> reasons,
        InterestLevel interestLevel
) {
}
