import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon } from './icon';

export interface PasswordRule {
  label: string;
  met: boolean;
}

/** Regras da senha em pilulas que se marcam enquanto o estudante digita. */
@Component({
  selector: 'norte-password-checklist',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <ul aria-label="Requisitos da senha">
      @for (regra of rules(); track regra.label) {
        <li [class.ok]="regra.met">
          <span class="marca" aria-hidden="true">
            @if (regra.met) {
              <norte-icon name="check" [size]="12" [strokeWidth]="3.5" />
            }
          </span>
          {{ regra.label }}
          <span class="visualmente-oculto">{{ regra.met ? '(atendido)' : '(pendente)' }}</span>
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      align-items: center;
      background: var(--cream-200);
      border-radius: 999px;
      color: var(--text-muted);
      display: inline-flex;
      font-size: 14px;
      font-weight: 600;
      gap: 6px;
      height: 30px;
      padding: 0 12px 0 8px;
      transition:
        background var(--dur-base) var(--ease-out),
        color var(--dur-base);
    }

    li.ok {
      background: var(--green-100);
      color: var(--green-800);
    }

    .marca {
      border: 1.5px solid var(--sand-400);
      border-radius: 999px;
      color: #fff;
      display: grid;
      height: 18px;
      place-items: center;
      transform: scale(0.9);
      transition: transform var(--dur-base) var(--ease-spring);
      width: 18px;
    }

    li.ok .marca {
      background: var(--green-700);
      border: none;
      transform: scale(1);
    }
  `,
})
export class PasswordChecklist {
  readonly rules = input<PasswordRule[]>([]);
}
