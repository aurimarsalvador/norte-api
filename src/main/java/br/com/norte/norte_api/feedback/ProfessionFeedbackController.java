package br.com.norte.norte_api.feedback;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.norte.norte_api.security.CurrentStudent;
import jakarta.validation.Valid;

@RestController
@RequestMapping
public class ProfessionFeedbackController {

    private final ProfessionFeedbackService feedbackService;

    public ProfessionFeedbackController(ProfessionFeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/professions/{professionId}/feedback")
    public FeedbackResponse save(@CurrentStudent Long studentId,
                                 @PathVariable Long professionId,
                                 @Valid @RequestBody FeedbackRequest request) {
        return feedbackService.save(studentId, professionId, request);
    }

    @GetMapping("/students/me/feedbacks")
    public List<FeedbackResponse> listMine(@CurrentStudent Long studentId) {
        return feedbackService.listByStudent(studentId);
    }
}
