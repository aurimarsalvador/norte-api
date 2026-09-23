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
