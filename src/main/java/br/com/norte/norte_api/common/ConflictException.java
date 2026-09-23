package br.com.norte.norte_api.common;

/**
 * Estado atual do recurso impede a operacao (ex.: e-mail ja cadastrado). Vira 409.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
