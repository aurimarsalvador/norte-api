import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ProblemDetail } from './models/api.models';
import { TokenStorage } from './token-storage.service';

/** Anexa o Bearer token a toda chamada da API. */
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(TokenStorage).readToken();
  if (!token) {
    return next(request);
  }

  return next(
    request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
  );
};

/**
 * Traduz o ProblemDetail da API para uma frase que o estudante entenda.
 *
 * <p>Repassa o erro adiante depois de enriquece-lo: quem chamou decide onde mostrar a
 * mensagem, mas ninguem precisa saber o formato RFC 7807.
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const storage = inject(TokenStorage);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('/auth/')) {
        // Token expirado ou invalido: derruba a sessao em vez de deixar a tela em um
        // limbo em que nada carrega e nada explica o porque.
        storage.clear();
        void router.navigate(['/entrar']);
      }

      return throwError(() => new Error(friendlyMessage(error)));
    }),
  );
};

function friendlyMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Nao conseguimos falar com o servidor. Verifique sua conexao e tente de novo.';
  }

  const problem = error.error as ProblemDetail | null;

  // Erros de validacao trazem a lista de campos: mostrar o campo errado poupa o estudante
  // de adivinhar o que a tela nao aceitou.
  if (problem?.errors?.length) {
    return problem.errors.map((field) => field.message).join(' ');
  }

  if (problem?.detail) {
    return problem.detail;
  }

  switch (error.status) {
    case 401:
      return 'Sua sessao expirou. Entre de novo para continuar.';
    case 403:
      return 'Voce nao tem acesso a este conteudo.';
    case 404:
      return 'Nao encontramos o que voce procurava.';
    default:
      return 'Algo deu errado por aqui. Tente novamente em instantes.';
  }
}
