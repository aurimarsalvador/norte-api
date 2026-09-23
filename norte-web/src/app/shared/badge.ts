import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Icon, IconName } from './icon';

export type BadgeTone = 'green' | 'sun' | 'coral' | 'neutral' | 'outline';

/**
 * Pilula de etiqueta: caracteristica que combinou (verde com check), compatibilidade (sol),
 * sentimento de uma micro-experiencia (coral) e fichas neutras.
 */
@Component({
  selector: 'norte-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  host: {
    '[class]': "'tom-' + tone()",
    '[class.pequeno]': "size() === 'sm'",
    '[class.com-icone]': '!!icon()',
  },
  template: `
    @if (icon(); as nome) {
      <norte-icon [name]="nome" [size]="size() === 'sm' ? 14 : 15" [strokeWidth]="3" />
    }
    <span><ng-content /></span>
  `,
  styles: `
    :host {
      align-items: center;
      background: var(--green-100);
      border-radius: 999px;
      color: var(--green-800);
      display: inline-flex;
      font-size: 14px;
      font-weight: 700;
      gap: 6px;
      height: 32px;
      line-height: 1;
      padding: 0 13px;
      white-space: nowrap;
    }

    :host(.com-icone) {
      padding-left: 10px;
    }

    :host(.pequeno) {
      font-size: 13px;
      height: 28px;
      padding: 0 11px;
    }

    :host(.pequeno.com-icone) {
      padding-left: 8px;
    }

    :host(.tom-sun) {
      background: var(--sun-100);
      color: var(--ink-900);
    }

    :host(.tom-coral) {
      background: var(--coral-100);
      color: var(--ink-900);
    }

    :host(.tom-neutral) {
      background: var(--cream-200);
      color: var(--ink-700);
    }

    :host(.tom-outline) {
      background: transparent;
      border: 1.5px solid var(--border-strong);
      color: var(--ink-700);
    }
  `,
})
export class Badge {
  readonly tone = input<BadgeTone>('green');
  readonly icon = input<IconName>();
  readonly size = input<'sm' | 'md'>('md');
}

/**
 * Compatibilidade de uma profissao, na pilula amarela.
 *
 * <p>A diretriz de tom do produto vive aqui: o numero sempre sai rotulado como compatibilidade
 * (por extenso no modo completo, para leitores de tela no compacto) e o rotulo nao e
 * parametrizavel, para nenhuma tela conseguir transformar o percentual em veredito.
 */
@Component({
  selector: 'norte-score-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge],
  template: `
    <norte-badge tone="sun" [size]="compact() ? 'sm' : 'md'">
      {{ valor() }}%
      @if (compact()) {
        <span class="visualmente-oculto">de compatibilidade</span>
      } @else {
        compatível
      }
    </norte-badge>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
  `,
})
export class ScoreBadge {
  /** BigDecimal da API, como string. Arredondado so para exibir. */
  readonly percentage = input.required<string>();
  readonly compact = input(false);

  protected readonly valor = computed(() => arredondar(this.percentage()));
}

/** Percentuais chegam como string (BigDecimal): so viram numero inteiro na hora de mostrar. */
export function arredondar(percentual: string | null | undefined): number {
  const numero = Number(percentual);
  return Number.isFinite(numero) ? Math.round(Math.min(100, Math.max(0, numero))) : 0;
}
