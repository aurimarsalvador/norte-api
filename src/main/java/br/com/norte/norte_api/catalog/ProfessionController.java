package br.com.norte.norte_api.catalog;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.norte.norte_api.security.CurrentStudent;

@RestController
@RequestMapping
public class ProfessionController {

    private final ProfessionService professionService;

    public ProfessionController(ProfessionService professionService) {
        this.professionService = professionService;
    }

    @GetMapping("/career-areas")
    public List<CareerAreaResponse> listCareerAreas() {
        return professionService.listCareerAreas();
    }

    /**
     * Explorador de profissoes. Informe {@code assessmentId} para receber tambem a
     * compatibilidade e a justificativa de cada profissao.
     */
    @GetMapping("/professions")
    public List<ProfessionSummaryResponse> list(
            @CurrentStudent Long studentId,
            @RequestParam(required = false) String areaCode,
            @RequestParam(required = false) Long assessmentId) {

        return professionService.list(studentId, areaCode, assessmentId);
    }

    @GetMapping("/professions/{professionId}")
    public ProfessionDetailResponse findById(
            @CurrentStudent Long studentId,
            @PathVariable Long professionId,
            @RequestParam(required = false) Long assessmentId) {

        return professionService.findDetail(studentId, professionId, assessmentId);
    }
}
