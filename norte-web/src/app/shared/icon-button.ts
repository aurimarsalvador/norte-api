import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Icon, IconName } from './icon';

/**
 * Botao redondo so com icone: favoritar (coracao) e "nao tenho interesse" (x). O clique
 * nao borbulha, porque ele vive dentro de cartoes que tambem sao clicaveis.
 */
@Component({
  selector: 'norte-icon-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <button
      type="button"
      [attr.aria-label]="label()"
      [title]="label()"
      [attr.aria-pressed]="active()"
      [class]="'tom-' + tone()"
      [class.ativo]="active()"
      [disabled]="disabled()"
      (click)="aoClicar($event)"
    >
      <norte-icon
        [name]="icon()"
        [size]="20"
        [fill]="active() && tone() === 'favorite' ? 'var(--coral-500)' : 'none'"
      />
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    button {
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: 999px;
      color: var(--ink-700);
      cursor: pointer;
      display: grid;
      flex-shrink: 0;
      height: 44px;
      padding: 0;
      place-items: center;
      transition:
        background var(--dur-fast),
        border-color var(--dur-fast),
        transform var(--dur-base) var(--ease-spring);
      width: 44px;
    }

    button:hover:not(:disabled) {
      background: var(--cream-100);
    }

    button:disabled {
      cursor: progress;
      opacity: 0.6;
    }

    button.ativo {
      background: var(--green-100);
      border-color: var(--green-700);
      color: var(--green-700);
      transform: scale(1.06);
    }

    button.ativo.tom-favorite {
      background: var(--coral-100);
      border-color: var(--coral-500);
      color: var(--coral-500);
    }

    button.ativo.tom-dismiss {
      background: var(--cream-200);
      border-color: var(--sand-400);
      color: var(--ink-900);
    }
  `,
})
export class IconButton {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly active = input(false);
  readonly disabled = input(false);
  readonly tone = input<'neutral' | 'favorite' | 'dismiss'>('neutral');
  readonly pressionar = output();

  protected aoClicar(evento: Event): void {
    evento.stopPropagation();
    this.pressionar.emit();
  }
}
