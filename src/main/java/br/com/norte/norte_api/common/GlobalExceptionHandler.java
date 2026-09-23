package br.com.norte.norte_api.common;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.validation.ConstraintViolationException;

/**
 * Traduz excecoes da aplicacao para respostas RFC 7807 (application/problem+json).
 *
 * <p>Toda resposta de erro carrega a propriedade extra {@code timestamp}, e erros de validacao
 * carregam tambem {@code errors} com um item por campo invalido.
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    static final String TIMESTAMP_PROPERTY = "timestamp";
    static final String ERRORS_PROPERTY = "errors";

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException exception) {
        return problem(HttpStatus.NOT_FOUND, "Recurso nao encontrado", exception.getMessage());
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ProblemDetail handleBusinessRule(BusinessRuleException exception) {
        return problem(HttpStatus.UNPROCESSABLE_ENTITY, "Regra de negocio violada", exception.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException exception) {
        return problem(HttpStatus.CONFLICT, "Conflito com o estado atual", exception.getMessage());
    }

    @ExceptionHandler(ForbiddenOperationException.class)
    public ProblemDetail handleForbiddenOperation(ForbiddenOperationException exception) {
        return problem(HttpStatus.FORBIDDEN, "Acesso negado", exception.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(AccessDeniedException exception) {
        return problem(HttpStatus.FORBIDDEN, "Acesso negado",
                "Voce nao tem permissao para acessar este recurso.");
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail handleUnauthorized(UnauthorizedException exception) {
        return problem(HttpStatus.UNAUTHORIZED, "Nao autenticado", exception.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ProblemDetail handleAuthentication(AuthenticationException exception) {
        return problem(HttpStatus.UNAUTHORIZED, "Nao autenticado",
                "Credenciais ausentes ou invalidas.");
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {

        ProblemDetail body = problem(HttpStatus.BAD_REQUEST, "Requisicao invalida",
                "Um ou mais campos nao passaram na validacao.");

        List<FieldErrorDetail> errors = new ArrayList<>();
        for (var fieldError : exception.getBindingResult().getFieldErrors()) {
            errors.add(new FieldErrorDetail(fieldError.getField(), fieldError.getDefaultMessage()));
        }
        for (var globalError : exception.getBindingResult().getGlobalErrors()) {
            errors.add(new FieldErrorDetail(globalError.getObjectName(), globalError.getDefaultMessage()));
        }
        errors.sort(Comparator.comparing(FieldErrorDetail::field));
        body.setProperty(ERRORS_PROPERTY, errors);

        return handleExceptionInternal(exception, body, headers, HttpStatus.BAD_REQUEST, request);
    }

    /**
     * Validacao em parametros de metodo ({@code @RequestParam}, {@code @PathVariable}),
     * que nao passa por {@link MethodArgumentNotValidException}.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolation(ConstraintViolationException exception) {
        ProblemDetail body = problem(HttpStatus.BAD_REQUEST, "Requisicao invalida",
                "Um ou mais parametros nao passaram na validacao.");

        List<FieldErrorDetail> errors = exception.getConstraintViolations().stream()
                .map(violation -> new FieldErrorDetail(
                        violation.getPropertyPath().toString(), violation.getMessage()))
                .sorted(Comparator.comparing(FieldErrorDetail::field))
                .toList();
        body.setProperty(ERRORS_PROPERTY, errors);

        return body;
    }

    /**
     * Rede de seguranca: qualquer excecao nao mapeada vira 500 sem vazar stack trace para o cliente.
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception exception) {
        logger.error("Erro nao tratado processando a requisicao", exception);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno",
                "Nao foi possivel concluir a operacao. Tente novamente em instantes.");
    }

    static ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(status, detail);
        problemDetail.setTitle(title);
        problemDetail.setProperty(TIMESTAMP_PROPERTY, Instant.now());
        return problemDetail;
    }

    public record FieldErrorDetail(String field, String message) {
    }
}
