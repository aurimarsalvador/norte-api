import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RecommendationReason } from '../core/models/api.models';

/**
 * Lista de justificativas de uma compatibilidade.
 *
 * <p>Quando a API devolve nenhuma razao, significa que nenhum trait alcancou o corte de
 * confianca. O componente entao mostra um convite a explorar, e nunca uma justificativa
 * improvisada: e o mesmo criterio do ExplanationBuilder no backend, agora visivel na tela.
 */
@Component({
  selector: 'norte-reason-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (reasons().length) {
      <h3>Por que esse percentual</h3>
      <ul class="razoes">
        @for (reason of reasons(); track reason.traitId) {
          <li>
            <strong>{{ reason.traitName }}</strong>
            <span class="texto-suave">{{ reason.description }}</span>
          </li>
        }
      </ul>
    } @else {
      <p class="aviso aviso--neutro">
        Suas respostas ainda nao apontaram com clareza para as caracteristicas que esta
        profissao mais exige. Isso nao a descarta: vale conhecer melhor e experimentar antes
        de tirar qualquer conclusao.
      </p>
    }
  `,
  styles: `
    .razoes {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .razoes li {
      border-left: 3px solid var(--cor-acento);
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: calc(var(--espaco) * 1.5);
      padding-left: calc(var(--espaco) * 1.5);
    }
  `,
})
export class ReasonList {
  readonly reasons = input.required<RecommendationReason[]>();
}
