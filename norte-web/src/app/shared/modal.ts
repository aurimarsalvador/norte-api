import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'norte-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="fundo" (click)="close.emit()">
        <div
          class="caixa cartao"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
          (click)="$event.stopPropagation()"
        >
          <header>
            <h2>{{ title() }}</h2>
            <button class="botao botao--discreto" type="button" aria-label="Fechar" (click)="close.emit()">
              &times;
            </button>
          </header>
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: `
    .fundo {
      align-items: center;
      background: rgb(30 42 36 / 45%);
      display: flex;
      inset: 0;
      justify-content: center;
      padding: calc(var(--espaco) * 2);
      position: fixed;
      z-index: 50;
    }

    .caixa {
      box-shadow: var(--sombra);
      max-height: 85vh;
      max-width: 560px;
      overflow-y: auto;
      width: 100%;
    }

    header {
      align-items: flex-start;
      display: flex;
      gap: var(--espaco);
      justify-content: space-between;
    }

    header button {
      font-size: 1.4rem;
      line-height: 1;
    }
  `,
})
export class Modal {
  readonly open = input(false);
  readonly title = input('');
  readonly close = output<void>();
}
