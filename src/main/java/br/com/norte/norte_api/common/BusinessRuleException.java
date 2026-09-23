package br.com.norte.norte_api.common;

/**
 * Requisicao bem formada, mas que viola uma regra de negocio. Vira 422.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
