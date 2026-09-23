import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Barra de um trait do perfil.
 *
 * O percentual chega como string (BigDecimal de escala 2 no backend) e so vira numero aqui,
 * para desenhar a largura. O texto mostrado continua sendo a string original, sem
 * reformatacao que possa alterar o valor.
 */
@Component({
  selector: 'norte-trait-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="trait">
      <div class="cabecalho">
        <span class="nome">{{ name() }}</span>
        <span class="valor">{{ percentage() }}%</span>
      </div>
      <div
        class="trilho"
        role="meter"
        [attr.aria-valuenow]="largura()"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-label]="name()"
      >
        <div class="preenchimento" [style.width.%]="largura()"></div>
      </div>
      @if (description()) {
        <p class="texto-suave descricao">{{ description() }}</p>
      }
    </div>
  `,
  styles: `
    .trait {
      margin-bottom: calc(var(--espaco) * 2);
    }

    .cabecalho {
      display: flex;
      justify-content: space-between;
      gap: var(--espaco);
      margin-bottom: 6px;
    }

    .nome {
      font-weight: 600;
    }

    .valor {
      color: var(--cor-primaria);
      font-variant-numeric: tabular-nums;
      font-weight: 700;
    }

    .trilho {
      background: var(--cor-superficie-alta);
      border-radius: 999px;
      height: 10px;
      overflow: hidden;
    }

    .preenchimento {
      background: linear-gradient(90deg, var(--cor-acento), var(--cor-primaria));
      height: 100%;
      transition: width 0.4s ease;
    }

    .descricao {
      font-size: 0.85rem;
      margin: 6px 0 0;
    }
  `,
})
export class TraitBar {
  readonly name = input.required<string>();
  readonly percentage = input.required<string>();
  readonly description = input<string>('');

  protected readonly largura = computed(() => {
    const valor = Number(this.percentage());
    return Number.isFinite(valor) ? Math.min(100, Math.max(0, valor)) : 0;
  });
}
