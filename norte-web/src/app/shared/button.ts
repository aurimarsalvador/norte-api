import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Icon, IconName } from './icon';

/**
 * Botao pilula do design system. Com estado de envio embutido: enquanto a requisicao corre,
 * ele desabilita e gira, o que evita o duplo clique que criaria duas respostas para a mesma
 * questao.
 *
 * <p>Variantes: primario (a unica acao principal da tela), secundario (fundo verde claro),
 * contorno e discreto (so texto).
 */
@Component({
  selector: 'norte-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: { '[class.largo]': 'fullWidth()' },
  template: `
    <button
      class="botao"
      [class.botao--secundario]="variant() === 'secundario'"
      [class.botao--contorno]="variant() === 'contorno'"
      [class.botao--discreto]="variant() === 'discreto'"
      [class.botao--sm]="size() === 'sm'"
      [class.botao--lg]="size() === 'lg'"
      [class.botao--largo]="fullWidth()"
      [class.botao--carregando]="loading()"
      [type]="type()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() || null"
    >
      @if (loading()) {
        <norte-icon class="girando" name="loader" />
      } @else if (iconLeft(); as icone) {
        <norte-icon [name]="icone" />
      }
      <span>{{ loading() ? (loadingLabel() ?? label()) : label() }}</span>
      @if (!loading() && iconRight(); as icone) {
        <norte-icon [name]="icone" />
      }
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    :host(.largo) {
      display: block;
    }

    .girando {
      animation: girar 0.8s linear infinite;
    }

    @keyframes girar {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Button {
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primario' | 'secundario' | 'contorno' | 'discreto'>('primario');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly fullWidth = input(false);
  readonly iconLeft = input<IconName>();
  readonly iconRight = input<IconName>();
  readonly disabled = input(false);
  readonly loading = input(false);
  /** Texto durante o envio. Sem ele, o botao mantem o proprio rotulo ao lado do giro. */
  readonly loadingLabel = input<string>();
}
