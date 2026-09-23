package br.com.norte.norte_api.common;

/**
 * Credencial ausente, invalida ou expirada. Vira 401.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
