package br.com.norte.norte_api.question;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OptionTraitWeightRepository extends JpaRepository<OptionTraitWeight, Long> {

    /**
     * Pesos das alternativas efetivamente escolhidas pelo estudante (numerador de P(t)).
     */
    @Query("""
            select new br.com.norte.norte_api.question.OptionTraitWeightRow(
                       w.answerOption.id, w.trait.id, w.weight)
            from OptionTraitWeight w
            where w.answerOption.id in :optionIds
            """)
    List<OptionTraitWeightRow> findWeightsByOptionIds(@Param("optionIds") List<Long> optionIds);

    /**
     * Maior peso alcancavel por trait em cada questao respondida (denominador de P(t)).
     * Agregado no banco: trazer todas as alternativas para somar em memoria seria desperdicio.
     */
    @Query("""
            select new br.com.norte.norte_api.question.QuestionTraitMaxWeightRow(
                       w.answerOption.question.id, w.trait.id, max(w.weight))
            from OptionTraitWeight w
            where w.answerOption.question.id in :questionIds
            group by w.answerOption.question.id, w.trait.id
            """)
    List<QuestionTraitMaxWeightRow> findMaxWeightsByQuestionIds(@Param("questionIds") List<Long> questionIds);
}
