package br.com.norte.norte_api.question;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerOptionRepository extends JpaRepository<AnswerOption, Long> {

    List<AnswerOption> findByQuestionIdOrderByDisplayOrderAsc(Long questionId);
}
