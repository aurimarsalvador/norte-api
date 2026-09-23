package br.com.norte.norte_api.microexperience;

import java.time.Instant;

import br.com.norte.norte_api.student.Student;
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
 * O que o estudante relatou depois de fazer uma microexperiencia.
 *
 * <p>As duas notas sao independentes de proposito: gostar muito de algo dificil e um sinal
 * diferente de gostar muito de algo facil, e a jornada precisa distinguir os dois.
 */
@Entity
@Table(name = "micro_experience_responses")
public class MicroExperienceResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "micro_experience_id", nullable = false)
    private MicroExperience microExperience;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "enjoyment_rating", nullable = false)
    private Integer enjoymentRating;

    @Column(name = "difficulty_rating", nullable = false)
    private Integer difficultyRating;

    @Column(length = 1000)
    private String notes;

    @Column(name = "responded_at", nullable = false)
    private Instant respondedAt;

    protected MicroExperienceResponse() {
    }

    public MicroExperienceResponse(MicroExperience microExperience, Student student,
                                   Integer enjoymentRating, Integer difficultyRating, String notes) {
        this.microExperience = microExperience;
        this.student = student;
        this.enjoymentRating = enjoymentRating;
        this.difficultyRating = difficultyRating;
        this.notes = notes;
        this.respondedAt = Instant.now();
    }

    public void update(Integer enjoymentRating, Integer difficultyRating, String notes) {
        this.enjoymentRating = enjoymentRating;
        this.difficultyRating = difficultyRating;
        this.notes = notes;
        this.respondedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public MicroExperience getMicroExperience() {
        return microExperience;
    }

    public Student getStudent() {
        return student;
    }

    public Integer getEnjoymentRating() {
        return enjoymentRating;
    }

    public Integer getDifficultyRating() {
        return difficultyRating;
    }

    public String getNotes() {
        return notes;
    }

    public Instant getRespondedAt() {
        return respondedAt;
    }
}
