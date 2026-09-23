import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Progresso de etapas. Mostra so a posicao ("Pergunta 7 de 20"), nunca uma nota. */
@Component({
  selector: 'norte-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label()) {
      <span class="rotulo">{{ label() }}</span>
    }
    <div
      class="trilho"
      role="progressbar"
      [attr.aria-valuenow]="value()"
      aria-valuemin="0"
      [attr.aria-valuemax]="max()"
      [attr.aria-label]="label() || null"
    >
      <div class="preenchimento" [style.width.%]="percentual()"></div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rotulo {
      color: var(--text-muted);
      font-size: var(--fs-small);
      font-weight: 600;
      line-height: var(--lh-small);
    }

    .trilho {
      background: var(--sand-300);
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
    }

    .preenchimento {
      background: var(--green-700);
      border-radius: 999px;
      height: 100%;
      transition: width var(--dur-slow) var(--ease-out);
    }
  `,
})
export class ProgressBar {
  readonly value = input(0);
  readonly max = input(1);
  readonly label = input('');

  protected readonly percentual = computed(() => {
    const max = this.max();
    return max ? Math.max(0, Math.min(1, this.value() / max)) * 100 : 0;
  });
}
