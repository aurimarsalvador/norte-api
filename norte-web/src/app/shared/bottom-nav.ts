import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon, IconName } from './icon';

export type Aba = 'perfil' | 'carreiras' | 'caminho';

interface ItemDaNav {
  aba: Aba;
  rotulo: string;
  icone: IconName;
  link: string;
}

const ITENS: ItemDaNav[] = [
  { aba: 'perfil', rotulo: 'Perfil', icone: 'user', link: '/perfil' },
  { aba: 'carreiras', rotulo: 'Carreiras', icone: 'compass', link: '/profissoes' },
  { aba: 'caminho', rotulo: 'Meu Caminho', icone: 'map', link: '/meu-caminho' },
];

/**
 * Barra de abas das telas logadas. Some no questionario e na micro-experiencia, que usam uma
 * acao fixa no pe da tela no lugar dela.
 */
@Component({
  selector: 'norte-bottom-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <nav aria-label="Principal">
      @for (item of itens; track item.aba) {
        <a
          [routerLink]="item.link"
          [class.ativo]="item.aba === active()"
          [attr.aria-current]="item.aba === active() ? 'page' : null"
        >
          <span class="pilula">
            <norte-icon [name]="item.icone" [size]="22" [strokeWidth]="item.aba === active() ? 2.25 : 2" />
          </span>
          {{ item.rotulo }}
        </a>
      }
    </nav>
  `,
  styles: `
    :host {
      background: var(--surface-card);
      border-top: 1px solid var(--border-default);
      bottom: 0;
      display: block;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      position: sticky;
      z-index: 10;
    }

    nav {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin: 0 auto;
      max-width: var(--screen-max);
      padding: 8px 8px 14px;
    }

    a {
      align-items: center;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      font-size: 13px;
      font-weight: 600;
      gap: 4px;
      min-height: 52px;
      padding: 4px 0;
      text-decoration: none;
    }

    a.ativo {
      color: var(--green-800);
      font-weight: 700;
    }

    .pilula {
      border-radius: 999px;
      display: grid;
      height: 30px;
      place-items: center;
      transition: background var(--dur-base) var(--ease-out);
      width: 56px;
    }

    a.ativo .pilula {
      background: var(--green-100);
    }
  `,
})
export class BottomNav {
  readonly active = input<Aba | null>(null);
  protected readonly itens = ITENS;
}
