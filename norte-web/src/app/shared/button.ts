import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Botao com estado de envio embutido: enquanto a requisicao corre, ele desabilita e avisa,
 * o que evita o duplo clique que criaria duas respostas para a mesma questao.
 */
@Component({
  selector: 'norte-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="botao"
      [class.botao--secundario]="variant() === 'secundario'"
      [class.botao--discreto]="variant() === 'discreto'"
      [type]="type()"
      [disabled]="disabled() || loading()"
    >
      {{ loading() ? loadingLabel() : label() }}
    </button>
  `,
})
export class Button {
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primario' | 'secundario' | 'discreto'>('primario');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly loadingLabel = input('Enviando...');
}
