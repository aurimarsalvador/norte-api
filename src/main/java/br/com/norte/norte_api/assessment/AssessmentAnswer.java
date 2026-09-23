package br.com.norte.norte_api.assessment;

import java.time.Instant;

import br.com.norte.norte_api.question.AnswerOption;
import br.com.norte.norte_api.question.Question;
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
 * Resposta do estudante a uma questao dentro de um assessment.
 *
 * <p>Existe no maximo uma por (assessment, questao) — garantido por UNIQUE no banco. Voltar e
 * trocar a resposta atualiza esta linha, e nao cria outra.
 */
@Entity
@Table(name = "assessment_answers")
public class AssessmentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answer_option_id", nullable = false)
    private AnswerOption answerOption;

    @Column(name = "answered_at", nullable = false)
    private Instant answeredAt;

    protected AssessmentAnswer() {
    }

    public AssessmentAnswer(Assessment assessment, Question question, AnswerOption answerOption) {
        this.assessment = assessment;
        this.question = question;
        this.answerOption = answerOption;
        this.answeredAt = Instant.now();
    }

    public void changeTo(AnswerOption answerOption) {
        this.answerOption = answerOption;
        this.answeredAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Assessment getAssessment() {
        return assessment;
    }

    public Question getQuestion() {
        return question;
    }

    public AnswerOption getAnswerOption() {
        return answerOption;
    }

    public Instant getAnsweredAt() {
        return answeredAt;
    }
}
