import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { Icon } from '../../shared/icon';
import { Sticker, TopBar } from '../../shared/kit';
import { primeiroNome } from './validacao';

/**
 * Depois do cadastro (ou de entrar pela porta da frente): confirma que deu certo e aponta
 * o proximo passo. O login marca a navegacao com { retorno: true } no history.state, que
 * sobrevive a um refresh.
 */
@Component({
  selector: 'norte-welcome',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Sticker, TopBar],
  template: `
    <div class="tela">
      <norte-top-bar />

      <div class="tela-corpo corpo">
        <!-- Espaco da ilustracao de boas-vindas, ainda sem arte. -->
        <div class="heroi">
          <norte-sticker class="adesivo" fundo="var(--sun-400)" giro="-4deg">
            {{ retorno ? 'De volta!' : 'Conta criada' }}
          </norte-sticker>
        </div>

        <h1>{{ retorno ? 'Oi de novo, ' + nome() + '.' : 'Tudo pronto, ' + nome() + '.' }}</h1>
        <p class="apoio">
          @if (retorno) {
            Sua jornada continua de onde você parou.
          } @else {
            Agora vamos conversar um pouco sobre o que você curte e como você pensa. Não existe
            resposta errada.
          }
        </p>

        <div class="proximo">
          <span class="icone"><norte-icon name="compass" [size]="22" /></span>
          <div>
            <span class="sobrancelha">Próximo passo</span>
            <span class="passo">Jornada de autodescoberta</span>
          </div>
        </div>

        <div class="tela-espaco"></div>

        <a
          class="botao botao--lg botao--largo"
          [routerLink]="retorno ? '/meu-caminho' : '/questionario'"
        >
          {{ retorno ? 'Continuar jornada' : 'Começar jornada' }}
          <norte-icon name="arrow-right" />
        </a>
      </div>
    </div>
  `,
  styles: `
    .corpo {
      padding-top: 8px;
    }

    .heroi {
      background: var(--green-100);
      border-radius: var(--radius-xl);
      flex-shrink: 0;
      height: 240px;
      position: relative;
    }

    .adesivo {
      bottom: -14px;
      right: 24px;
    }

    h1 {
      margin: 40px 0 0;
    }

    .apoio {
      color: var(--text-body);
      font-size: var(--fs-body-lg);
      line-height: var(--lh-body-lg);
      margin: 12px 0 0;
      text-wrap: pretty;
    }

    .proximo {
      align-items: center;
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: var(--radius-lg);
      display: flex;
      gap: 14px;
      margin-top: 24px;
      padding: 16px;
    }

    .proximo > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .icone {
      background: var(--green-50);
      border-radius: 14px;
      color: var(--green-700);
      display: grid;
      height: 44px;
      place-items: center;
      width: 44px;
    }

    .passo {
      color: var(--text-strong);
      font-weight: 600;
    }
  `,
})
export class Welcome {
  private readonly auth = inject(AuthService);

  protected readonly retorno =
    (inject(Location).getState() as { retorno?: boolean } | null)?.retorno === true;

  protected readonly nome = computed(() => primeiroNome(this.auth.student()?.name ?? '') || 'você');
}
