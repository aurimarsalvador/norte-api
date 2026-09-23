package br.com.norte.norte_api.question;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

/**
 * Pergunta situacional do questionario.
 *
 * <p>{@code active} permite aposentar uma pergunta sem apagar as respostas historicas que
 * apontam para ela, e {@code code} da aos seeds uma referencia estavel.
 */
@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String code;

    @Column(nullable = false, length = 500)
    private String text;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private boolean active;

    @OneToMany(mappedBy = "question")
    @OrderBy("displayOrder asc")
    private List<AnswerOption> options = new ArrayList<>();

    protected Question() {
    }

    public Question(String code, String text, Integer displayOrder) {
        this.code = code;
        this.text = text;
        this.displayOrder = displayOrder;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getText() {
        return text;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public boolean isActive() {
        return active;
    }

    public List<AnswerOption> getOptions() {
        return List.copyOf(options);
    }
}
