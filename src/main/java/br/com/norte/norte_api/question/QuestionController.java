package br.com.norte.norte_api.question;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<QuestionResponse> findAll() {
        return questionService.listActiveQuestions();
    }

    @GetMapping("/{questionId}")
    public QuestionResponse findById(@PathVariable Long questionId) {
        return questionService.findById(questionId);
    }

    @GetMapping("/{questionId}/options")
    public List<AnswerOptionResponse> findOptions(@PathVariable Long questionId) {
        return questionService.listOptions(questionId);
    }
}
