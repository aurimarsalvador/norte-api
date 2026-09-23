package br.com.norte.norte_api.catalog;

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
 * O quanto um trait pesa no dia a dia de uma profissao, de 1 a 5.
 *
 * <p>O intervalo e garantido por CHECK no banco, e nao apenas por validacao Java: estes
 * pesos sao mantidos por seeds SQL, que nao passam pela aplicacao.
 */
@Entity
@Table(name = "profession_traits")
public class ProfessionTrait {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profession_id", nullable = false)
    private Profession profession;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trait_id", nullable = false)
    private Trait trait;

    @Column(nullable = false)
    private Integer weight;

    protected ProfessionTrait() {
    }

    public ProfessionTrait(Profession profession, Trait trait, Integer weight) {
        this.profession = profession;
        this.trait = trait;
        this.weight = weight;
    }

    public Long getId() {
        return id;
    }

    public Profession getProfession() {
        return profession;
    }

    public Trait getTrait() {
        return trait;
    }

    public Integer getWeight() {
        return weight;
    }
}
