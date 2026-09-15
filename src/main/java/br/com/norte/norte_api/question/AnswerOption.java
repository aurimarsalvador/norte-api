package br.com.norte.norte_api.question;

import jakarta.persistence.*;

@Entity
@Table(name = "answer_options")
public class AnswerOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String text;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    protected AnswerOption() {}

    public AnswerOption(String text, Integer displayOrder, Question question) {
        this.text = text;
        this.displayOrder = displayOrder;
        this.question = question;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public Question getQuestion() {
        return question;
    }

}
