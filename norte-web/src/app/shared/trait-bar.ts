import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { arredondar } from './badge';

/**
 * Barra de afinidade de uma caracteristica. As tres primeiras do perfil vem em verde-escuro
 * (emphasis strong), as demais em verde-claro.
 *
 * <p>O percentual chega como string (BigDecimal de escala 2 no backend) e so vira numero
 * aqui, para desenhar a largura e o rotulo inteiro.
 */
@Component({
  selector: 'norte-trait-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.suave]': "emphasis() === 'soft'",
    '[class.pequena]': "size() === 'sm'",
  },
  template: `
    <div class="cabecalho">
      <span class="nome">{{ name() }}</span>
      <span class="valor">{{ valor() }}%</span>
    </div>
    <div
      class="trilho"
      role="meter"
      [attr.aria-valuenow]="valor()"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-label]="name()"
    >
      <div class="preenchimento" [style.width.%]="valor()"></div>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    :host(.pequena) {
      gap: 6px;
    }

    .cabecalho {
      align-items: baseline;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .nome,
    .valor {
      font-size: 16px;
      line-height: 22px;
    }

    :host(.pequena) .nome,
    :host(.pequena) .valor {
      font-size: 15px;
    }

    .nome {
      color: var(--text-strong);
      font-weight: 600;
    }

    .valor {
      color: var(--green-800);
      font-variant-numeric: tabular-nums;
      font-weight: 700;
    }

    :host(.suave) .nome {
      color: var(--text-body);
    }

    :host(.suave) .valor {
      color: var(--text-muted);
    }

    .trilho {
      background: var(--cream-200);
      border-radius: 999px;
      height: 10px;
      overflow: hidden;
    }

    :host(.pequena) .trilho {
      height: 8px;
    }

    .preenchimento {
      background: var(--green-700);
      border-radius: 999px;
      height: 100%;
      transition: width var(--dur-slow) var(--ease-out);
    }

    :host(.suave) .preenchimento {
      background: var(--green-300);
    }
  `,
})
export class TraitBar {
  readonly name = input.required<string>();
  readonly percentage = input.required<string>();
  readonly emphasis = input<'strong' | 'soft'>('strong');
  readonly size = input<'sm' | 'md'>('md');

  protected readonly valor = computed(() => arredondar(this.percentage()));
}
