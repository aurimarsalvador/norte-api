import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from './icon';

/**
 * Pecas de layout das telas: marca, barra do topo, adesivo, cabecalhos e a linha de link
 * alternativo. Nasceram na jornada de entrada e hoje servem a todas as telas.
 */

/** A marca em texto: nao existe logo ainda, entao "norte" em Young Serif ocupa o lugar. */
@Component({
  selector: 'norte-wordmark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `norte`,
  host: { '[style.font-size.px]': 'size()' },
  styles: `
    :host {
      color: var(--green-900);
      font-family: var(--font-display);
      letter-spacing: -0.01em;
      line-height: 1;
    }
  `,
})
export class Wordmark {
  readonly size = input(26);
}

/**
 * Barra do topo: marca (ou botao de voltar) a esquerda, e o que for projetado a direita.
 * O voltar e um link quando o destino e fixo, ou um botao que emite (voltar) quando depende
 * de estado da tela, como a pergunta anterior do questionario.
 */
@Component({
  selector: 'norte-top-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Wordmark],
  template: `
    @if (voltarPara(); as destino) {
      <a class="voltar" [routerLink]="destino" aria-label="Voltar">
        <norte-icon name="arrow-left" />
      </a>
    } @else if (comVoltar()) {
      <button class="voltar" type="button" aria-label="Voltar" (click)="voltar.emit()">
        <norte-icon name="arrow-left" />
      </button>
    } @else {
      <norte-wordmark />
    }
    <ng-content />
  `,
  styles: `
    :host {
      align-items: center;
      display: flex;
      height: 64px;
      justify-content: space-between;
      padding: 0 var(--screen-pad);
    }

    .voltar {
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: 999px;
      color: var(--text-strong);
      cursor: pointer;
      display: grid;
      height: 44px;
      padding: 0;
      place-items: center;
      width: 44px;
    }
  `,
})
export class TopBar {
  readonly voltarPara = input<string | null>(null);
  readonly comVoltar = input(false);
  readonly voltar = output();
}

/** Sobrancelha, titulo em serifa e texto de apoio: a abertura de quase toda tela. */
@Component({
  selector: 'norte-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sobrancelha()) {
      <span class="sobrancelha">{{ sobrancelha() }}</span>
    }
    <h1 [class.menor]="tamanho() === 'h2'">{{ titulo() }}</h1>
    @if (apoio()) {
      <p [class.texto-suave]="apoioSuave()">{{ apoio() }}</p>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    h1,
    p {
      margin: 0;
      text-wrap: balance;
    }

    h1.menor {
      font-size: var(--fs-h2);
      line-height: var(--lh-h2);
    }

    p {
      color: var(--text-body);
      text-wrap: pretty;
    }

    p.texto-suave {
      color: var(--text-muted);
    }
  `,
})
export class Intro {
  readonly titulo = input.required<string>();
  readonly sobrancelha = input('');
  readonly apoio = input('');
  readonly apoioSuave = input(false);
  readonly tamanho = input<'h1' | 'h2'>('h1');
}

/** Adesivo inclinado com uma frase de acolhimento, posicionado por quem o usa. */
@Component({
  selector: 'norte-sticker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    '[style.background]': 'fundo()',
    '[style.transform]': "'rotate(' + giro() + ')'",
  },
  styles: `
    :host {
      border-radius: 999px;
      box-shadow: var(--shadow-md);
      color: var(--ink-900);
      font-size: 15px;
      font-weight: 700;
      line-height: 20px;
      padding: 8px 14px;
      pointer-events: none;
      position: absolute;
      white-space: nowrap;
    }
  `,
})
export class Sticker {
  readonly fundo = input.required<string>();
  readonly giro = input('0deg');
}

/** Titulo e subtitulo dos formularios. */
@Component({
  selector: 'norte-form-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>{{ titulo() }}</h1>
    <p>{{ subtitulo() }}</p>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    h1,
    p {
      margin: 0;
    }

    p {
      color: var(--text-body);
    }
  `,
})
export class FormHeader {
  readonly titulo = input.required<string>();
  readonly subtitulo = input.required<string>();
}

/** Linha "Ja tem uma conta? Entrar" abaixo da acao principal. */
@Component({
  selector: 'norte-alt-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `{{ pergunta() }} <a class="link-texto" [routerLink]="link()">{{ acao() }}</a>`,
  styles: `
    :host {
      color: var(--text-body);
      display: block;
      text-align: center;
    }
  `,
})
export class AltRow {
  readonly pergunta = input.required<string>();
  readonly acao = input.required<string>();
  readonly link = input.required<string>();
}
