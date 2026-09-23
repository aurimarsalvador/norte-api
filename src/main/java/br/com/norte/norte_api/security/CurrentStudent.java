package br.com.norte.norte_api.security;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Injeta o id do estudante autenticado em um parametro {@code Long} de controller.
 *
 * <p>Mantem o controller restrito a HTTP e deixa os services recebendo apenas o id, sem
 * nenhum deles precisar conhecer o {@code SecurityContext}.
 */
@Documented
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentStudent {
}
