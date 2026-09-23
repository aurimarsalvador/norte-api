package br.com.norte.norte_api.common;

/**
 * Estudante autenticado tentando acessar recurso de outro estudante. Vira 403.
 */
public class ForbiddenOperationException extends RuntimeException {

    public ForbiddenOperationException(String message) {
        super(message);
    }
}
