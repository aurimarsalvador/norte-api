package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;
import java.util.List;

/**
 * Uma profissao com a compatibilidade percentual e o porque dela.
 *
 * <p>{@code reasons} vem vazio quando nenhum trait alcancou o corte de confianca. Isso e
 * informacao, nao falha: a interface deve, nesse caso, apresentar a profissao como convite a
 * explorar, e nunca como indicacao.
 */
public record RecommendationResponse(
        Long professionId,
        String professionCode,
        String professionName,
        String summary,
        String careerAreaCode,
        String careerAreaName,
        BigDecimal compatibility,
        List<RecommendationReason> reasons
) {
}
