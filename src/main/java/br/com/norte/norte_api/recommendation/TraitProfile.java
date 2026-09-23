package br.com.norte.norte_api.recommendation;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Perfil do estudante: P(t) em pontos percentuais, por trait.
 *
 * <p>Um trait ausente do mapa significa "nao foi possivel medir" (nenhuma questao respondida
 * dava pontos nele), o que e diferente de "mediu zero". Para o calculo de compatibilidade,
 * porem, ausente e zero se comportam igual — veja {@link #percentageOf(Long)} —, porque um
 * trait exigido que o estudante nao pontuou precisa mesmo derrubar a compatibilidade.
 */
public final class TraitProfile {

    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(ProfileCalculator.SCALE);

    private final Map<Long, BigDecimal> percentages;

    TraitProfile(Map<Long, BigDecimal> percentages) {
        this.percentages = Map.copyOf(percentages);
    }

    public static TraitProfile empty() {
        return new TraitProfile(Map.of());
    }

    /**
     * P(t) do trait, ou zero se ele nao foi medido. Nunca devolve null: quem consome a
     * formula de C(k) precisa somar um valor mesmo para o trait que o estudante nao pontuou.
     */
    public BigDecimal percentageOf(Long traitId) {
        return percentages.getOrDefault(traitId, ZERO);
    }

    public boolean measured(Long traitId) {
        return percentages.containsKey(traitId);
    }

    public boolean isEmpty() {
        return percentages.isEmpty();
    }

    public int size() {
        return percentages.size();
    }

    public Map<Long, BigDecimal> asMap() {
        return percentages;
    }

    /**
     * Traits medidos em ordem decrescente de P(t), com o id como criterio de desempate para
     * a saida ser estavel entre execucoes.
     */
    public List<Map.Entry<Long, BigDecimal>> sortedDescending() {
        return percentages.entrySet().stream()
                .sorted(Map.Entry.<Long, BigDecimal>comparingByValue().reversed()
                        .thenComparing(Map.Entry.comparingByKey()))
                .toList();
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        return other instanceof TraitProfile profile && percentages.equals(profile.percentages);
    }

    @Override
    public int hashCode() {
        return Objects.hash(percentages);
    }

    @Override
    public String toString() {
        Map<Long, BigDecimal> ordered = new LinkedHashMap<>();
        percentages.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry::getKey))
                .forEach(entry -> ordered.put(entry.getKey(), entry.getValue()));
        return "TraitProfile" + ordered;
    }
}
