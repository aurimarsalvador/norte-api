import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../../shared/icon';
import { AltRow, Sticker, TopBar } from '../../shared/kit';

/**
 * Primeira tela: apresenta o Norte sem cobrar decisao nenhuma. A frase principal e o
 * posicionamento do produto inteiro.
 */
@Component({
  selector: 'norte-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, AltRow, Sticker, TopBar],
  template: `
    <div class="tela">
      <norte-top-bar>
        <a class="botao botao--discreto botao--sm" routerLink="/entrar">Entrar</a>
      </norte-top-bar>

      <div class="moldura">
        <!-- Espaco da ilustracao (estudante explorando caminhos). A marca ainda nao tem
             arte; o bloco colorido com os adesivos segura o lugar ate ela chegar. -->
        <div class="heroi">
          <norte-sticker class="adesivo-1" fundo="var(--sun-400)" giro="-5deg">
            Sem notas
          </norte-sticker>
          <norte-sticker class="adesivo-2" fundo="var(--coral-100)" giro="4deg">
            Sem pressa
          </norte-sticker>
          <norte-sticker class="adesivo-3" fundo="var(--sky-100)" giro="-2deg">
            Sem certo ou errado
          </norte-sticker>
        </div>
      </div>

      <div class="tela-corpo corpo">
        <h1>Você não precisa escolher sua carreira <span class="destaque">agora.</span></h1>
        <p>
          O Norte te ajuda a se conhecer, explorar caminhos e experimentar profissões — no seu
          tempo.
        </p>

        <div class="tela-espaco"></div>

        <div class="tela-acoes">
          <a class="botao botao--lg botao--largo" routerLink="/cadastrar">
            Começar a explorar
            <norte-icon name="arrow-right" />
          </a>
          <norte-alt-row pergunta="Já tem uma conta?" acao="Entrar" link="/entrar" />
        </div>
      </div>
    </div>
  `,
  styles: `
    .moldura {
      padding: 8px var(--screen-pad) 0;
    }

    .heroi {
      background: var(--sun-100);
      border-radius: var(--radius-xl);
      height: 290px;
      position: relative;
    }

    .adesivo-1 {
      left: -6px;
      top: 18px;
    }

    .adesivo-2 {
      right: -8px;
      top: 120px;
    }

    .adesivo-3 {
      bottom: -14px;
      left: 28px;
    }

    .corpo {
      padding-top: 40px;
    }

    h1 {
      font-size: var(--fs-display);
      line-height: var(--lh-display);
      margin: 0;
      text-wrap: balance;
    }

    /* Marca-texto amarelo na palavra-chave. */
    .destaque {
      background: linear-gradient(
        transparent 62%,
        var(--sun-400) 62%,
        var(--sun-400) 92%,
        transparent 92%
      );
    }

    p {
      color: var(--text-body);
      font-size: var(--fs-body-lg);
      line-height: var(--lh-body-lg);
      margin: 16px 0 0;
      text-wrap: pretty;
    }
  `,
})
export class Landing {}
