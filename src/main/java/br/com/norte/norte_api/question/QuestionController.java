package br.com.norte.norte_api.question;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {
    private final QuestionRepository questionRepository;
    private final AnswerOptionRepository answerOptionRepository;

    public QuestionController(QuestionRepository questionRepository, AnswerOptionRepository answerOptionRepository) {
        this.questionRepository = questionRepository;
        this.answerOptionRepository = answerOptionRepository;
    }

    @GetMapping
    public List<Question> findAll() {
        return questionRepository.findAll();
    }

    @GetMapping("/{questionId}/options")
    public List<AnswerOptionResponse> findOptions(@PathVariable Long questionId) {
        List<AnswerOption> options = answerOptionRepository.findByQuestionIdOrderByDisplayOrderAsc(questionId);

        List<AnswerOptionResponse> response = new ArrayList<>();

        for (AnswerOption option : options) {
            AnswerOptionResponse optionResponse =
                    new AnswerOptionResponse(
                            option.getId(),
                            option.getText(),
                            option.getDisplayOrder()
                    );

            response.add(optionResponse);
        }

        return response;
    }
}
