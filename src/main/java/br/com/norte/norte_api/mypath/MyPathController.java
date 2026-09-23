package br.com.norte.norte_api.mypath;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.norte.norte_api.security.CurrentStudent;

@RestController
@RequestMapping("/students/me")
public class MyPathController {

    private final MyPathService myPathService;

    public MyPathController(MyPathService myPathService) {
        this.myPathService = myPathService;
    }

    @GetMapping("/my-path")
    public MyPathResponse myPath(@CurrentStudent Long studentId) {
        return myPathService.build(studentId);
    }
}
