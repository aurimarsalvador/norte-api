package br.com.norte.norte_api.microexperience;

import br.com.norte.norte_api.catalog.Profession;
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
 * Tarefa curta que coloca o estudante em contato com o gesto real de uma profissao.
 *
 * <p>O objetivo nao e avaliar desempenho: e gerar uma experiencia concreta sobre a qual o
 * estudante possa dizer se gostou e o quanto achou dificil.
 */
@Entity
@Table(name = "micro_experiences")
public class MicroExperience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profession_id", nullable = false)
    private Profession profession;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String instructions;

    @Column(name = "estimated_minutes", nullable = false)
    private Integer estimatedMinutes;

    protected MicroExperience() {
    }

    public MicroExperience(Profession profession, String title, String instructions,
                           Integer estimatedMinutes) {
        this.profession = profession;
        this.title = title;
        this.instructions = instructions;
        this.estimatedMinutes = estimatedMinutes;
    }

    public Long getId() {
        return id;
    }

    public Profession getProfession() {
        return profession;
    }

    public String getTitle() {
        return title;
    }

    public String getInstructions() {
        return instructions;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }
}
