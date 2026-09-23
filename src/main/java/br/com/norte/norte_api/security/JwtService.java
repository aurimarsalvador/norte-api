package br.com.norte.norte_api.security;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import br.com.norte.norte_api.student.Student;

/**
 * Emite os JWT assinados em HMAC-SHA256 usados como credencial da API.
 *
 * <p>O {@code subject} carrega o id do estudante: e o unico dado que o restante da aplicacao
 * precisa do token, e o {@link CurrentStudentArgumentResolver} o transforma em parametro de
 * controller.
 */
@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final String issuer;
    private final Duration expiration;

    public JwtService(JwtEncoder jwtEncoder,
                      @Value("${norte.security.jwt.issuer}") String issuer,
                      @Value("${norte.security.jwt.expiration}") Duration expiration) {
        this.jwtEncoder = jwtEncoder;
        this.issuer = issuer;
        this.expiration = expiration;
    }

    public IssuedToken generateToken(Student student) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(expiration);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .subject(String.valueOf(student.getId()))
                .claim("name", student.getName())
                .claim("email", student.getEmail())
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String value = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

        return new IssuedToken(value, expiresAt);
    }

    public record IssuedToken(String value, Instant expiresAt) {
    }
}
