package br.com.norte.norte_api.student;

import java.time.Instant;

public record AuthResponse(
        String token,
        String tokenType,
        Instant expiresAt,
        StudentResponse student
) {
}
