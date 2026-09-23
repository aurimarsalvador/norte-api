package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collection;

/**
 * Calcula C(k), a compatibilidade percentual entre o perfil do estudante e uma profissao.
 *
 * <pre>
 *   C(k) = Soma[t em T_k]( P(t) * W_k(t) ) / Soma[t em T_k]( W_k(t) * 100 ) * 100
 * </pre>
 *
 * <p><b>Trait exigido que o estudante nao pontuou.</b> Entra com P(t) = 0 e <b>permanece no
 * denominador</b>. E o que a formula descreve literalmente e e o comportamento desejado:
 * nao pontuar algo que a profissao exige todos os dias tem de derrubar a compatibilidade,
 * nao ser silenciosamente ignorado.
 *
 * <p><b>T_k vazio.</b> Profissao sem nenhum trait cadastrado devolve zero em vez de dividir
 * por zero. Nao ha base para afirmar compatibilidade alguma.
 *
 * <p>Classe pura: sem Spring, sem JPA, sem estado.
 */
public class CompatibilityCalculator {

    private static final BigDecimal HUNDRED = ProfileCalculator.HUNDRED;
    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(ProfileCalculator.SCALE);

    public BigDecimal calculate(TraitProfile profile, Collection<ProfessionTraitWeight> requirements) {
        if (profile == null || requirements == null || requirements.isEmpty()) {
            return ZERO;
        }

        BigDecimal weightedScore = BigDecimal.ZERO;
        long totalWeight = 0;

        for (ProfessionTraitWeight requirement : requirements) {
            weightedScore = weightedScore.add(
                    profile.percentageOf(requirement.traitId())
                            .multiply(BigDecimal.valueOf(requirement.weight())));
            totalWeight += requirement.weight();
        }

        if (totalWeight <= 0) {
            return ZERO;
        }

        BigDecimal denominator = BigDecimal.valueOf(totalWeight).multiply(HUNDRED);

        return weightedScore.multiply(HUNDRED)
                .divide(denominator, ProfileCalculator.SCALE, RoundingMode.HALF_UP)
                .min(HUNDRED)
                .max(ZERO);
    }
}
