package br.com.norte.norte_api.common;

/**
 * Recurso pedido nao existe. Vira 404 no {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException of(String resource, Object id) {
        return new ResourceNotFoundException(resource + " nao encontrado(a) para o identificador " + id + ".");
    }
}
