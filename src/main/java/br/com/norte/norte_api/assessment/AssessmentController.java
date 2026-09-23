package br.com.norte.norte_api.assessment;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.com.norte.norte_api.security.CurrentStudent;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentResponse startOrResume(@CurrentStudent Long studentId) {
        return assessmentService.startOrResume(studentId);
    }

    @GetMapping("/{assessmentId}")
    public AssessmentResponse findById(@CurrentStudent Long studentId,
                                       @PathVariable Long assessmentId) {
        return assessmentService.findById(studentId, assessmentId);
    }

    @PostMapping("/{assessmentId}/answers")
    public AssessmentResponse answer(@CurrentStudent Long studentId,
                                     @PathVariable Long assessmentId,
                                     @Valid @RequestBody AnswerRequest request) {
        return assessmentService.answer(studentId, assessmentId, request);
    }

    @PostMapping("/{assessmentId}/complete")
    public AssessmentResponse complete(@CurrentStudent Long studentId,
                                       @PathVariable Long assessmentId) {
        return assessmentService.complete(studentId, assessmentId);
    }
}
