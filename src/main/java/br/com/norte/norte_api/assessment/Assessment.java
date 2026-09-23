package br.com.norte.norte_api.assessment;

import java.time.Instant;

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

/**
 * Uma rodada do questionario feita por um estudante.
 *
 * <p>O par status/completedAt e coerente por construcao aqui e por CHECK no banco: nao existe
 * assessment COMPLETED sem data de conclusao, nem o contrario.
 */
@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssessmentStatus status;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    protected Assessment() {
    }

    public Assessment(Student student) {
        this.student = student;
        this.status = AssessmentStatus.IN_PROGRESS;
        this.startedAt = Instant.now();
    }

    public void complete() {
        this.status = AssessmentStatus.COMPLETED;
        this.completedAt = Instant.now();
    }

    public boolean isCompleted() {
        return status == AssessmentStatus.COMPLETED;
    }

    public boolean belongsTo(Long studentId) {
        return student.getId().equals(studentId);
    }

    public Long getId() {
        return id;
    }

    public Student getStudent() {
        return student;
    }

    public AssessmentStatus getStatus() {
        return status;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }
}
