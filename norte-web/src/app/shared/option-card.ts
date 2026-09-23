import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Icon } from './icon';

/**
 * Cartao de resposta das perguntas situacionais, escolha unica. Sem letras nem numeros nas
 * opcoes: a jornada nao e prova. Quem usa agrupa os cartoes num role="radiogroup".
 */
@Component({
  selector: 'norte-option-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <button
      type="button"
      role="radio"
      [attr.aria-checked]="selected()"
      [class.escolhido]="selected()"
      [disabled]="disabled()"
      (click)="escolher.emit()"
    >
      <span class="marca">
        @if (selected()) {
          <norte-icon name="check" [size]="14" [strokeWidth]="3.5" />
        }
      </span>
      <span class="texto"><ng-content /></span>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }

    button {
      align-items: center;
      background: var(--surface-card);
      border: 2px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      color: var(--text-strong);
      cursor: pointer;
      display: flex;
      font-family: var(--font-body);
      font-size: 17px;
      font-weight: 500;
      gap: 14px;
      line-height: 24px;
      min-height: 64px;
      padding: 16px 18px;
      text-align: left;
      transition:
        border-color var(--dur-fast),
        background var(--dur-fast),
        transform var(--dur-fast) var(--ease-out);
      width: 100%;
    }

    button:hover:not(:disabled) {
      border-color: var(--border-strong);
    }

    button:active:not(:disabled) {
      transform: scale(0.985);
    }

    button:disabled {
      cursor: progress;
    }

    button.escolhido {
      background: var(--green-50);
      border-color: var(--green-700);
      box-shadow: none;
      font-weight: 600;
    }

    .marca {
      border: 2px solid var(--sand-400);
      border-radius: 999px;
      color: #fff;
      display: grid;
      flex-shrink: 0;
      height: 24px;
      place-items: center;
      transition: background var(--dur-fast);
      width: 24px;
    }

    .escolhido .marca {
      background: var(--green-700);
      border: none;
    }

    .texto {
      flex: 1;
      min-width: 0;
    }
  `,
})
export class OptionCard {
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly escolher = output();
}
