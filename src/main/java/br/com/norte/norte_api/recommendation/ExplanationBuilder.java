package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;

/**
 * Escolhe os traits que justificam uma compatibilidade.
 *
 * <p>Ordena por contribuicao P(t) * W_k(t) decrescente, descarta quem esta abaixo de
 * {@value #MINIMUM_PERCENTAGE_VALUE}% e devolve no maximo {@value #MAX_REASONS}.
 *
 * <p><b>Quando nenhum trait passa do corte, devolve lista vazia.</b> Nao rebaixa o criterio
 * nem escolhe "o melhor dos ruins": uma justificativa fraca apresentada como forte e
 * exatamente o tipo de afirmacao determinista que o produto se propoe a nao fazer. Cabe a
 * interface mostrar um texto exploratorio neutro nesse caso.
 *
 * <p>Empates de contribuicao sao desempatados pelo id do trait, so para a saida ser estavel.
 *
 * <p>Classe pura: sem Spring, sem JPA, sem estado.
 */
public class ExplanationBuilder {

    static final int MINIMUM_PERCENTAGE_VALUE = 60;

    public static final BigDecimal MINIMUM_PERCENTAGE = BigDecimal.valueOf(MINIMUM_PERCENTAGE_VALUE);

    public static final int MAX_REASONS = 3;

    private static final Comparator<TraitContribution> BY_CONTRIBUTION_DESC =
            Comparator.comparing(TraitContribution::contribution).reversed()
                    .thenComparing(TraitContribution::traitId);

    public List<TraitContribution> build(TraitProfile profile,
                                         Collection<ProfessionTraitWeight> requirements) {
        if (profile == null || requirements == null || requirements.isEmpty()) {
            return List.of();
        }

        return requirements.stream()
                .map(requirement -> new TraitContribution(
                        requirement.traitId(),
                        profile.percentageOf(requirement.traitId()),
                        requirement.weight()))
                .filter(contribution -> contribution.percentage().compareTo(MINIMUM_PERCENTAGE) >= 0)
                .sorted(BY_CONTRIBUTION_DESC)
                .limit(MAX_REASONS)
                .toList();
    }
}
