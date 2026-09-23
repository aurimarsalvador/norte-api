import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { MyPath as MyPathModel } from '../../core/models/api.models';
import { CompatibilityGauge } from '../../shared/compatibility-gauge';
import { EmptyState } from '../../shared/empty-state';
import { Spinner } from '../../shared/spinner';
import { TraitBar } from '../../shared/trait-bar';

/**
 * Painel consolidado da jornada.
 *
 * <p>Mostra o caminho percorrido (o que voce descobriu, favoritou, descartou e experimentou)
 * e sugere o proximo passo. Em nenhum ponto afirma uma escolha pelo estudante.
 */
@Component({
  selector: 'norte-my-path',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TraitBar, CompatibilityGauge, Spinner, EmptyState],
  template: `
    <div class="conteudo">
      @if (carregando()) {
        <norte-spinner label="Montando o seu painel..." />
      } @else if (erro()) {
        <p class="aviso aviso--erro">{{ erro() }}</p>
      } @else if (painel(); as dados) {
        <h1>Meu Caminho</h1>
        <p class="texto-suave">
          Ola, {{ dados.student.name }}. Aqui fica o registro do que voce ja explorou.
        </p>

        @if (!dados.assessment) {
          <norte-empty-state
            title="Sua jornada comeca no questionario"
            message="Sao algumas situacoes do dia a dia. Leva poucos minutos e nada aqui e definitivo."
          >
            <a class="botao" routerLink="/questionario">Comecar agora</a>
          </norte-empty-state>
        } @else {
          @if (dados.assessment.status === 'IN_PROGRESS') {
            <p class="aviso aviso--neutro">
              Seu questionario esta em andamento: {{ dados.assessment.answeredQuestions }}
              pergunta(s) respondida(s).
              <a routerLink="/questionario">Continuar de onde parei</a>
            </p>
          }

          <section class="cartao">
            <h2>O que mais apareceu nas suas respostas</h2>
            @if (dados.topTraits.length) {
              @for (trait of dados.topTraits; track trait.traitId) {
                <norte-trait-bar [name]="trait.name" [percentage]="trait.percentage" />
              }
              <a routerLink="/perfil">Ver o perfil completo</a>
            } @else {
              <p class="texto-suave">Responda mais algumas perguntas para este retrato aparecer.</p>
            }
          </section>

          <section class="cartao">
            <h2>Proximos passos sugeridos</h2>
            @if (dados.nextSteps.length) {
              <p class="texto-suave">
                Profissoes de alta compatibilidade que voce ainda nao avaliou.
              </p>
              <div class="grade">
                @for (passo of dados.nextSteps; track passo.professionId) {
                  <article class="sugestao">
                    <norte-compatibility-gauge [percentage]="passo.compatibility" [compact]="true" />
                    <div>
                      <h3>{{ passo.professionName }}</h3>
                      <p class="texto-suave">{{ passo.summary }}</p>
                      <a [routerLink]="['/profissoes', passo.professionId]">Conhecer</a>
                    </div>
                  </article>
                }
              </div>
            } @else {
              <p class="texto-suave">
                Voce ja avaliou as profissoes mais alinhadas ao seu perfil. Continue explorando
                o catalogo quando quiser.
              </p>
            }
          </section>
        }

        <div class="colunas">
          <section class="cartao">
            <h2>Quero saber mais</h2>
            @if (dados.favorites.length) {
              <ul class="lista">
                @for (favorito of dados.favorites; track favorito.professionId) {
                  <li>
                    <a [routerLink]="['/profissoes', favorito.professionId]">
                      {{ favorito.professionName }}
                    </a>
                  </li>
                }
              </ul>
            } @else {
              <p class="texto-suave">Nada marcado ainda.</p>
            }
          </section>

          <section class="cartao">
            <h2>Descartei por ora</h2>
            @if (dados.discarded.length) {
              <ul class="lista">
                @for (descartado of dados.discarded; track descartado.professionId) {
                  <li>
                    <a [routerLink]="['/profissoes', descartado.professionId]">
                      {{ descartado.professionName }}
                    </a>
                  </li>
                }
              </ul>
              <p class="texto-suave">
                Descobrir o que nao combina tambem e progresso. Da para mudar de ideia a
                qualquer momento.
              </p>
            } @else {
              <p class="texto-suave">Nada descartado ainda.</p>
            }
          </section>
        </div>

        <section class="cartao">
          <h2>Microexperiencias que voce fez</h2>
          @if (dados.microExperiences.length) {
            <ul class="lista">
              @for (feita of dados.microExperiences; track feita.id) {
                <li>
                  <strong>{{ feita.microExperienceTitle }}</strong>
                  <span class="texto-suave">
                    {{ feita.professionName }} &middot; gostou {{ feita.enjoymentRating }}/5
                    &middot; dificuldade {{ feita.difficultyRating }}/5
                  </span>
                  @if (feita.notes) {
                    <span class="anotacao texto-suave">{{ feita.notes }}</span>
                  }
                </li>
              }
            </ul>
          } @else {
            <p class="texto-suave">
              Voce ainda nao experimentou nenhuma. Elas sao o jeito mais direto de descobrir
              se um trabalho combina com voce.
            </p>
          }
        </section>
      }
    </div>
  `,
  styles: `
    section {
      margin-bottom: calc(var(--espaco) * 2);
    }

    .colunas {
      display: grid;
      gap: calc(var(--espaco) * 2);
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .sugestao {
      align-items: center;
      display: flex;
      gap: calc(var(--espaco) * 2);
    }

    .sugestao h3 {
      margin: 0 0 4px;
    }

    .lista {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .lista li {
      border-bottom: 1px solid var(--cor-borda);
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--espaco) 0;
    }

    .lista li:last-child {
      border-bottom: none;
    }

    .anotacao {
      font-style: italic;
    }
  `,
})
export class MyPath {
  private readonly api = inject(ApiService);

  protected readonly painel = signal<MyPathModel | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  constructor() {
    this.api.getMyPath().subscribe({
      next: (painel) => {
        this.painel.set(painel);
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }
}
