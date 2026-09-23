import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Icon, IconName } from './icon';

export interface SentimentOption<T> {
  value: T;
  label: string;
  icon?: IconName;
}

/**
 * Escolha grande, em grade de duas colunas, para dizer como foi uma micro-experiencia.
 * O padrao do design system e Amei / Curti / Neutro / Nao curti, mas as opcoes sao do chamador.
 */
@Component({
  selector: 'norte-sentiment-scale',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div role="radiogroup" [attr.aria-label]="label() || null">
      @for (opcao of options(); track opcao.value) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="value() === opcao.value"
          [class.escolhido]="value() === opcao.value"
          [class.sem-icone]="!opcao.icon"
          (click)="valueChange.emit(opcao.value)"
        >
          @if (opcao.icon; as icone) {
            <norte-icon
              [name]="icone"
              [size]="34"
              [strokeWidth]="1.75"
              [color]="value() === opcao.value ? 'var(--green-700)' : 'var(--ink-500)'"
            />
          }
          {{ opcao.label }}
        </button>
      }
    </div>
  `,
  styles: `
    div {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      flex-direction: column;
      font-family: var(--font-body);
      font-size: 17px;
      font-weight: 600;
      gap: 10px;
      height: 108px;
      justify-content: center;
      transition: all var(--dur-base) var(--ease-spring);
    }

    button.sem-icone {
      height: 64px;
    }

    button.escolhido {
      background: var(--green-50);
      border-color: var(--green-700);
      box-shadow: none;
      color: var(--green-800);
      transform: scale(1.02);
    }
  `,
})
export class SentimentScale<T extends string | number> {
  readonly options = input.required<SentimentOption<T>[]>();
  readonly value = input<T | null>(null);
  readonly label = input('');
  readonly valueChange = output<T>();
}
