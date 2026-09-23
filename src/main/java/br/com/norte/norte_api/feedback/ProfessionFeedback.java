package br.com.norte.norte_api.feedback;

import java.time.Instant;

import br.com.norte.norte_api.catalog.Profession;
import br.com.norte.norte_api.student.Student;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "profession_feedbacks")
public class ProfessionFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profession_id", nullable = false)
    private Profession profession;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_level", nullable = false, length = 20)
    private InterestLevel interestLevel;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ProfessionFeedback() {
    }

    public ProfessionFeedback(Student student, Profession profession, InterestLevel interestLevel) {
        this.student = student;
        this.profession = profession;
        this.interestLevel = interestLevel;
        this.updatedAt = Instant.now();
    }

    public void changeTo(InterestLevel interestLevel) {
        this.interestLevel = interestLevel;
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public Profession getProfession() {
        return profession;
    }

    public InterestLevel getInterestLevel() {
        return interestLevel;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
