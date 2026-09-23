import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenStorage } from './token-storage.service';

/**
 * Bloqueia as rotas que exigem sessao e guarda o destino, para o estudante voltar ao lugar
 * certo depois de entrar em vez de cair sempre na home.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);

  if (inject(TokenStorage).readToken()) {
    return true;
  }

  return router.createUrlTree(['/entrar'], { queryParams: { redirect: state.url } });
};

/**
 * O inverso: a pagina de apresentacao e para quem ainda nao tem conta. Quem ja entrou vai
 * direto para o proprio painel.
 */
export const guestGuard: CanActivateFn = () => {
  if (inject(TokenStorage).readToken()) {
    return inject(Router).createUrlTree(['/meu-caminho']);
  }

  return true;
};
