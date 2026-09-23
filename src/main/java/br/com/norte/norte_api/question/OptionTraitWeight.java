package br.com.norte.norte_api.question;

import br.com.norte.norte_api.trait.Trait;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * O quanto escolher uma alternativa pontua um trait, de 1 a 5.
 *
 * <p>Insumo direto do motor: a soma dos pesos das alternativas escolhidas forma S_raw(t),
 * e o maior peso disponivel em cada questao respondida forma S_max(t).
 */
@Entity
@Table(name = "option_trait_weights")
public class OptionTraitWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answer_option_id", nullable = false)
    private AnswerOption answerOption;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trait_id", nullable = false)
    private Trait trait;

    @Column(nullable = false)
    private Integer weight;

    protected OptionTraitWeight() {
    }

    public OptionTraitWeight(AnswerOption answerOption, Trait trait, Integer weight) {
        this.answerOption = answerOption;
        this.trait = trait;
        this.weight = weight;
    }

    public Long getId() {
        return id;
    }

    public AnswerOption getAnswerOption() {
        return answerOption;
    }

    public Trait getTrait() {
        return trait;
    }

    public Integer getWeight() {
        return weight;
    }
}
