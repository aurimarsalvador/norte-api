import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Icon } from './icon';

/**
 * Linha de marco com caixa de marcar. Marcos que o sistema confere sozinho (fez uma
 * micro-experiencia, favoritou tres profissoes) chegam com `locked` e nao aceitam clique.
 */
@Component({
  selector: 'norte-checklist-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <button
      type="button"
      role="checkbox"
      [attr.aria-checked]="checked()"
      [attr.aria-disabled]="locked() || null"
      [class.marcado]="checked()"
      [class.travado]="locked()"
      (click)="alternar()"
    >
      <span class="caixa">
        @if (checked()) {
          <norte-icon name="check" [size]="16" [strokeWidth]="3.5" />
        }
      </span>
      <span class="textos">
        <span class="rotulo">{{ label() }}</span>
        @if (hint()) {
          <span class="dica">{{ hint() }}</span>
        }
      </span>
    </button>
  `,
  styles: `
    button {
      align-items: flex-start;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      font-family: var(--font-body);
      gap: 14px;
      min-height: 48px;
      padding: 12px 0;
      text-align: left;
      width: 100%;
    }

    button.travado {
      cursor: default;
    }

    .caixa {
      background: var(--surface-card);
      border: 2px solid var(--sand-400);
      border-radius: 8px;
      color: #fff;
      display: grid;
      flex-shrink: 0;
      height: 26px;
      margin-top: -1px;
      place-items: center;
      transition: background var(--dur-fast);
      width: 26px;
    }

    .marcado .caixa {
      background: var(--green-700);
      border: none;
    }

    .textos {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .rotulo {
      color: var(--text-strong);
      font-size: 17px;
      font-weight: 600;
      line-height: 24px;
    }

    .marcado .rotulo {
      color: var(--text-muted);
      text-decoration: line-through;
      text-decoration-color: var(--sand-400);
    }

    .dica {
      color: var(--text-muted);
      font-size: var(--fs-small);
      line-height: var(--lh-small);
    }
  `,
})
export class ChecklistItem {
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly checked = input(false);
  readonly locked = input(false);
  readonly checkedChange = output<boolean>();

  protected alternar(): void {
    if (!this.locked()) {
      this.checkedChange.emit(!this.checked());
    }
  }
}
