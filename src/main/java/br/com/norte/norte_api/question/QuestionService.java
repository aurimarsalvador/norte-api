package br.com.norte.norte_api.question;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.common.ResourceNotFoundException;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Transactional(readOnly = true)
    public List<QuestionResponse> listActiveQuestions() {
        return questionRepository.findActiveWithOptions().stream()
                .map(QuestionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public QuestionResponse findById(Long questionId) {
        Question question = questionRepository.findByIdWithOptions(questionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Questao", questionId));
        return QuestionResponse.from(question);
    }

    @Transactional(readOnly = true)
    public List<AnswerOptionResponse> listOptions(Long questionId) {
        return findById(questionId).options();
    }
}
