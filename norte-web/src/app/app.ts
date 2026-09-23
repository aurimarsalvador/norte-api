import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { Aba, BottomNav } from './shared/bottom-nav';

/**
 * Casca do app. Cada tela desenha a propria barra do topo; aqui fica so a barra de abas,
 * que aparece nas rotas marcadas com data.aba (Perfil, Carreiras, Meu Caminho).
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, BottomNav],
  template: `
    <a class="pular" href="#principal">Pular para o conteúdo</a>

    <main id="principal">
      <router-outlet />
    </main>

    @if (aba(); as ativa) {
      <norte-bottom-nav [active]="ativa" />
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
    }

    .pular {
      background: var(--action-primary);
      color: var(--text-on-primary);
      left: -999px;
      padding: 8px;
      position: absolute;
      top: 0;
      z-index: 100;
    }

    .pular:focus {
      left: 0;
    }

    main {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
  `,
})
export class App {
  private readonly router = inject(Router);

  protected readonly aba = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map(() => {
        let rota = this.router.routerState.snapshot.root;
        while (rota.firstChild) {
          rota = rota.firstChild;
        }
        return (rota.data['aba'] as Aba | undefined) ?? null;
      }),
    ),
    { initialValue: null },
  );
}
