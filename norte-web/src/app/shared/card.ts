import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon, IconName } from './icon';

export type CardTone = 'default' | 'mint' | 'sun' | 'inverse';

/**
 * Modulo arredondado com chip de icone, titulo e uma acao no cabecalho. A acao entra por
 * projecao com o atributo `acao` (um contador, um link "Ver perfil"), o resto vira o corpo.
 *
 * <p>Tons: default (branco), mint (explicacao), sun (desafio, aviso gentil) e inverse
 * (verde-escuro, o convite para a micro-experiencia).
 */
@Component({
  selector: 'norte-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { '[class]': "'tom-' + tone()" },
  template: `
    @if (title() || icon()) {
      <header>
        @if (icon(); as nome) {
          <span class="chip"><norte-icon [name]="nome" /></span>
        }
        <div class="titulos">
          @if (eyebrow()) {
            <span class="sobrancelha">{{ eyebrow() }}</span>
          }
          @if (title()) {
            <h3>{{ title() }}</h3>
          }
        </div>
        <ng-content select="[acao]" />
      </header>
    }
    <ng-content />
  `,
  styles: `
    :host {
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: var(--radius-lg);
      color: var(--text-strong);
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
    }

    :host(.tom-mint) {
      background: var(--green-50);
      border-color: var(--green-100);
    }

    :host(.tom-sun) {
      background: var(--sun-100);
      border-color: transparent;
    }

    :host(.tom-inverse) {
      background: var(--surface-inverse);
      border-color: transparent;
      color: #fff;
    }

    header {
      align-items: center;
      display: flex;
      gap: 12px;
    }

    .chip {
      background: var(--green-50);
      border-radius: 12px;
      color: var(--green-700);
      display: grid;
      flex-shrink: 0;
      height: 40px;
      place-items: center;
      width: 40px;
    }

    :host(.tom-mint) .chip,
    :host(.tom-sun) .chip {
      background: var(--surface-card);
    }

    :host(.tom-sun) .chip {
      color: var(--ink-900);
    }

    :host(.tom-inverse) .chip {
      background: rgb(255 255 255 / 12%);
      color: #fff;
    }

    .titulos {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    :host(.tom-inverse) .sobrancelha {
      color: var(--green-300);
    }

    h3 {
      color: inherit;
      margin: 0;
    }
  `,
})
export class Card {
  readonly title = input('');
  readonly eyebrow = input('');
  readonly icon = input<IconName>();
  readonly tone = input<CardTone>('default');
}
