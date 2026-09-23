package br.com.norte.norte_api.microexperience;

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
public class MicroExperienceController {

    private final MicroExperienceService microExperienceService;

    public MicroExperienceController(MicroExperienceService microExperienceService) {
        this.microExperienceService = microExperienceService;
    }

    @GetMapping("/professions/{professionId}/micro-experience")
    public MicroExperienceView findByProfession(@PathVariable Long professionId) {
        return microExperienceService.requireByProfessionId(professionId);
    }

    @PostMapping("/micro-experiences/{microExperienceId}/respond")
    public MicroExperienceAnswerView respond(@CurrentStudent Long studentId,
                                             @PathVariable Long microExperienceId,
                                             @Valid @RequestBody MicroExperienceAnswerRequest request) {
        return microExperienceService.respond(studentId, microExperienceId, request);
    }

    @GetMapping("/students/me/micro-experiences")
    public List<MicroExperienceAnswerView> listMine(@CurrentStudent Long studentId) {
        return microExperienceService.listAnswersByStudent(studentId);
    }
}
