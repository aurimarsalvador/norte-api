import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Estado vazio. Existe para que nenhuma tela precise improvisar texto quando nao ha dado:
 * o vazio e quase sempre um convite a fazer algo, nao um erro.
 */
@Component({
  selector: 'norte-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vazio">
      <h3>{{ title() }}</h3>
      @if (message()) {
        <p class="texto-suave">{{ message() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .vazio {
      background: var(--cor-superficie);
      border: 1px dashed var(--cor-borda);
      border-radius: var(--raio);
      padding: calc(var(--espaco) * 4);
      text-align: center;
    }
  `,
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly message = input<string>('');
}
