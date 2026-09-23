package br.com.norte.norte_api.student;

import br.com.norte.norte_api.common.UnauthorizedException;

/**
 * Nao distingue e-mail inexistente de senha errada: dizer qual dos dois falhou entregaria a
 * quem tenta adivinhar a confirmacao de que aquele e-mail esta cadastrado.
 */
public class InvalidCredentialsException extends UnauthorizedException {

    public InvalidCredentialsException() {
        super("E-mail ou senha invalidos.");
    }
}
