package br.com.norte.norte_api.student;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.norte.norte_api.common.ConflictException;
import br.com.norte.norte_api.common.ResourceNotFoundException;
import br.com.norte.norte_api.security.JwtService;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public StudentService(StudentRepository studentRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (studentRepository.existsByEmail(email)) {
            throw new ConflictException("Ja existe uma conta cadastrada com este e-mail.");
        }

        Student student = new Student(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                request.schoolYear()
        );

        return authResponseFor(studentRepository.save(student));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Student student = studentRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), student.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return authResponseFor(student);
    }

    @Transactional(readOnly = true)
    public Student requireById(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> ResourceNotFoundException.of("Estudante", studentId));
    }

    @Transactional(readOnly = true)
    public StudentResponse findProfile(Long studentId) {
        return StudentResponse.from(requireById(studentId));
    }

    private AuthResponse authResponseFor(Student student) {
        JwtService.IssuedToken token = jwtService.generateToken(student);
        return new AuthResponse(token.value(), "Bearer", token.expiresAt(), StudentResponse.from(student));
    }

    /**
     * E-mail sempre normalizado antes de gravar ou comparar, senao o UNIQUE do banco deixaria
     * passar o mesmo endereco com caixa diferente.
     */
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
