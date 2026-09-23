import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Medidor de compatibilidade.
 *
 * <p>A diretriz de tom do produto vive aqui: este componente sempre rotula o numero como
 * "de compatibilidade" e nunca afirma que a profissao e a do estudante. O rotulo nao e
 * parametrizavel de proposito, para que nenhuma tela futura consiga transformar o
 * percentual em veredito apenas trocando um texto.
 */
@Component({
  selector: 'norte-compatibility-gauge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="medidor" [class.medidor--compacto]="compact()">
      <svg viewBox="0 0 120 120" role="img" [attr.aria-label]="rotuloAcessivel()">
        <circle class="trilho" cx="60" cy="60" r="52" />
        <circle
          class="progresso"
          cx="60"
          cy="60"
          r="52"
          [style.stroke-dasharray]="circunferencia"
          [style.stroke-dashoffset]="deslocamento()"
        />
        <text class="numero" x="60" y="58">{{ valor() }}%</text>
        <text class="rotulo" x="60" y="78">compatibilidade</text>
      </svg>
    </div>
  `,
  styles: `
    .medidor {
      width: 160px;
    }

    .medidor--compacto {
      width: 96px;
    }

    svg {
      width: 100%;
      transform: rotate(-90deg);
    }

    .trilho {
      fill: none;
      stroke: var(--cor-superficie-alta);
      stroke-width: 10;
    }

    .progresso {
      fill: none;
      stroke: var(--cor-primaria);
      stroke-linecap: round;
      stroke-width: 10;
      transition: stroke-dashoffset 0.5s ease;
    }

    .numero,
    .rotulo {
      transform: rotate(90deg);
      transform-origin: 60px 60px;
      text-anchor: middle;
    }

    .numero {
      fill: var(--cor-texto);
      font-size: 22px;
      font-weight: 700;
    }

    .rotulo {
      fill: var(--cor-texto-suave);
      font-size: 9px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
  `,
})
export class CompatibilityGauge {
  readonly percentage = input.required<string>();
  readonly compact = input(false);

  protected readonly circunferencia = 2 * Math.PI * 52;

  protected readonly valor = computed(() => {
    const numero = Number(this.percentage());
    return Number.isFinite(numero) ? numero.toFixed(0) : '0';
  });

  protected readonly deslocamento = computed(() => {
    const fracao = Math.min(100, Math.max(0, Number(this.valor()))) / 100;
    return this.circunferencia * (1 - fracao);
  });

  protected readonly rotuloAcessivel = computed(
    () => `${this.valor()} por cento de compatibilidade com o seu perfil`,
  );
}
