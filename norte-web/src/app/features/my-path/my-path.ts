import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { MyPath as MyPathModel } from '../../core/models/api.models';
import { primeiroNome } from '../onboarding/validacao';
import { Badge, ScoreBadge } from '../../shared/badge';
import { Card } from '../../shared/card';
import { ChecklistItem } from '../../shared/checklist-item';
import { Icon } from '../../shared/icon';
import { Intro, TopBar } from '../../shared/kit';
import { rotuloDoSentimento } from '../../shared/sentimento';
import { Spinner } from '../../shared/spinner';
import { TraitBar } from '../../shared/trait-bar';

interface Passo {
  id: string;
  rotulo: string;
  dica?: string;
  /** Marcos que a API ja sabe responder; os demais o estudante marca sozinho. */
  automatico?: (painel: MyPathModel) => boolean;
}

const PASSOS: Passo[] = [
  {
    id: 'jornada',
    rotulo: 'Completar a jornada de autodescoberta',
    automatico: (p) => p.assessment?.status === 'COMPLETED',
  },
  {
    id: 'micro',
    rotulo: 'Fazer uma micro-experiência',
    automatico: (p) => p.microExperiences.length > 0,
  },
  {
    id: 'favs',
    rotulo: 'Favoritar 3 profissões',
    automatico: (p) => p.favorites.length >= 3,
  },
  {
    id: 'conversar',
    rotulo: 'Conversar com alguém da área',
    dica: 'Um professor, parente ou alguém nas redes.',
  },
  {
    id: 'cursos',
    rotulo: 'Pesquisar cursos de graduação',
    dica: 'Veja duração, grade e onde tem perto de você.',
  },
  { id: 'video', rotulo: 'Assistir a um vídeo “um dia na profissão”' },
];

/**
 * Painel da jornada: afinidades, proximos passos, favoritas e o que ficou sem interesse
 * (sempre reversivel). Em nenhum ponto afirma uma escolha pelo estudante.
 *
 * <p>Os passos que a API nao conhece (conversar, pesquisar, assistir) ficam marcados so
 * neste navegador, por estudante.
 */
@Component({
  selector: 'norte-my-path',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Badge, ScoreBadge, Card, ChecklistItem, Icon, Intro, TopBar, TraitBar, Spinner],
  template: `
    <div class="tela">
      <norte-top-bar>
        <button class="botao botao--discreto botao--sm" type="button" (click)="auth.logout()">
          <norte-icon name="log-out" [size]="18" />
          Sair
        </button>
      </norte-top-bar>

      <div class="tela-corpo tela-corpo--pilha painel">
        @if (carregando()) {
          <norte-spinner label="Montando o seu caminho..." />
        } @else if (painel(); as dados) {
          <norte-intro
            class="abertura"
            titulo="Meu Caminho"
            [apoio]="'Oi, ' + nome() + '. Aqui fica tudo o que você já explorou e o que vem depois.'"
          />

          @if (erro()) {
            <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
          }

          @if (!dados.assessment) {
            <norte-card tone="sun" icon="compass" title="Sua jornada começa aqui">
              <p class="texto">
                São situações do dia a dia, uma por vez. Sem notas, sem pressa e nada aqui é
                definitivo.
              </p>
              <a class="botao botao--largo" routerLink="/questionario">Começar a jornada</a>
            </norte-card>
          } @else if (dados.assessment.status === 'IN_PROGRESS') {
            <norte-card tone="sun" icon="compass" title="Sua jornada está em andamento">
              <p class="texto">
                Você já respondeu {{ dados.assessment.answeredQuestions }}
                {{ dados.assessment.answeredQuestions === 1 ? 'pergunta' : 'perguntas' }}.
                Continue de onde parou quando quiser.
              </p>
              <a class="botao botao--largo" routerLink="/questionario">Continuar de onde parei</a>
            </norte-card>
          }

          @if (dados.topTraits.length) {
            <norte-card icon="compass" title="Maiores afinidades">
              <a acao class="link-texto" routerLink="/perfil">Ver perfil</a>
              <div class="afinidades">
                @for (traco of dados.topTraits.slice(0, 3); track traco.traitId) {
                  <norte-trait-bar size="sm" [name]="traco.name" [percentage]="traco.percentage" />
                }
              </div>
            </norte-card>
          }

          <norte-card icon="list-checks" title="Próximos passos">
            <norte-badge acao size="sm">{{ feitos() }} de {{ passos().length }}</norte-badge>
            <div class="checklist">
              @for (passo of passos(); track passo.id) {
                <norte-checklist-item
                  [label]="passo.rotulo"
                  [hint]="passo.dica ?? ''"
                  [checked]="passo.marcado"
                  [locked]="passo.travado"
                  (checkedChange)="marcar(passo.id, $event)"
                />
              }
            </div>
          </norte-card>

          @if (dados.nextSteps.length) {
            <norte-card icon="lightbulb" title="Pra explorar agora">
              <div class="linhas">
                @for (sugestao of dados.nextSteps; track sugestao.professionId) {
                  <a class="linha" [routerLink]="['/profissoes', sugestao.professionId]">
                    <span class="linha-textos">
                      <span class="linha-nome">{{ sugestao.professionName }}</span>
                      <span class="linha-apoio">{{ sugestao.careerAreaName }}</span>
                    </span>
                    <norte-score-badge [percentage]="sugestao.compatibility" [compact]="true" />
                    <norte-icon name="chevron-right" color="var(--ink-500)" />
                  </a>
                }
              </div>
            </norte-card>
          }

          <norte-card icon="heart" title="Favoritas">
            <norte-badge acao tone="neutral" size="sm">{{ dados.favorites.length }}</norte-badge>
            @if (dados.favorites.length) {
              <div class="linhas">
                @for (favorita of dados.favorites; track favorita.professionId) {
                  <a class="linha" [routerLink]="['/profissoes', favorita.professionId]">
                    <span class="linha-nome">{{ favorita.professionName }}</span>
                    @if (sentimentoDe(favorita.professionId); as sentimento) {
                      <norte-badge tone="coral" size="sm">{{ sentimento }}</norte-badge>
                    }
                    <norte-icon name="chevron-right" color="var(--ink-500)" />
                  </a>
                }
              </div>
            } @else {
              <p class="vazio">Toque no coração de uma profissão para salvar aqui.</p>
            }
            <a class="botao botao--secundario botao--largo" routerLink="/profissoes">Explorar mais carreiras</a>
          </norte-card>

          @if (dados.microExperiences.length) {
            <norte-card icon="flask-conical" title="Micro-experiências">
              <norte-badge acao tone="neutral" size="sm">{{ dados.microExperiences.length }}</norte-badge>
              <div class="linhas">
                @for (feita of dados.microExperiences; track feita.id) {
                  <a class="linha" [routerLink]="['/profissoes', feita.professionId]">
                    <span class="linha-textos">
                      <span class="linha-nome">{{ feita.microExperienceTitle }}</span>
                      <span class="linha-apoio">{{ feita.professionName }}</span>
                    </span>
                    <norte-badge tone="coral" size="sm">{{ rotulo(feita.enjoymentRating) }}</norte-badge>
                  </a>
                }
              </div>
            </norte-card>
          }

          <norte-card icon="x" title="Sem interesse">
            <norte-badge acao tone="neutral" size="sm">{{ dados.discarded.length }}</norte-badge>
            @if (dados.discarded.length) {
              <div class="linhas">
                @for (descartada of dados.discarded; track descartada.professionId) {
                  <div class="linha">
                    <a class="linha-nome" [routerLink]="['/profissoes', descartada.professionId]">
                      {{ descartada.professionName }}
                    </a>
                    <button
                      class="botao botao--discreto botao--sm"
                      type="button"
                      [disabled]="reconsiderando() === descartada.professionId"
                      (click)="reconsiderar(descartada.professionId)"
                    >
                      Reconsiderar
                    </button>
                  </div>
                }
              </div>
            } @else {
              <p class="vazio">
                Profissões que você dispensar aparecem aqui. Dá pra mudar de ideia quando quiser.
              </p>
            }
          </norte-card>
        } @else if (erro()) {
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    .painel {
      gap: 16px;
    }

    .abertura {
      margin-bottom: 12px;
    }

    .texto,
    .vazio {
      margin: 0;
    }

    .texto {
      color: var(--ink-900);
    }

    .vazio {
      color: var(--text-muted);
      font-size: 15px;
      line-height: 22px;
    }

    .afinidades {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .checklist {
      display: flex;
      flex-direction: column;
      margin-top: -6px;
    }

    .linhas {
      display: flex;
      flex-direction: column;
      margin-top: -4px;
    }

    .linha {
      align-items: center;
      border-top: 1px solid var(--border-default);
      color: inherit;
      display: flex;
      gap: 12px;
      min-height: 56px;
      padding: 8px 0;
      text-decoration: none;
    }

    .linha-textos {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .linha-nome {
      color: var(--text-strong);
      flex: 1;
      font-size: 16px;
      font-weight: 600;
      min-width: 0;
      text-decoration: none;
    }

    .linha-apoio {
      color: var(--text-muted);
      font-size: 14px;
    }
  `,
})
export class MyPath {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);

  protected readonly painel = signal<MyPathModel | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly reconsiderando = signal<number | null>(null);

  private readonly marcados = signal<Record<string, boolean>>({});

  protected readonly nome = computed(
    () => primeiroNome(this.painel()?.student.name ?? this.auth.student()?.name ?? '') || 'você',
  );

  protected readonly passos = computed(() => {
    const painel = this.painel();
    const marcados = this.marcados();
    return PASSOS.map((passo) => {
      const travado = !!passo.automatico;
      const marcado = travado ? !!painel && passo.automatico!(painel) : !!marcados[passo.id];
      return { ...passo, travado, marcado };
    });
  });

  protected readonly feitos = computed(() => this.passos().filter((p) => p.marcado).length);

  constructor() {
    this.api.getMyPath().subscribe({
      next: (painel) => {
        this.painel.set(painel);
        this.marcados.set(lerPassos(painel.student.id));
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }

  protected rotulo(enjoymentRating: number): string {
    return rotuloDoSentimento(enjoymentRating);
  }

  /** Sentimento da micro-experiencia mais recente desta profissao, se houver. */
  protected sentimentoDe(professionId: number): string | null {
    const feitas = (this.painel()?.microExperiences ?? [])
      .filter((m) => m.professionId === professionId)
      .sort((a, b) => b.respondedAt.localeCompare(a.respondedAt));
    return feitas.length ? rotuloDoSentimento(feitas[0].enjoymentRating) : null;
  }

  protected marcar(id: string, marcado: boolean): void {
    const painel = this.painel();
    if (!painel) {
      return;
    }
    this.marcados.update((atual) => ({ ...atual, [id]: marcado }));
    gravarPassos(painel.student.id, this.marcados());
  }

  protected reconsiderar(professionId: number): void {
    this.reconsiderando.set(professionId);
    this.erro.set('');

    this.api.saveFeedback(professionId, 'NEUTRAL').subscribe({
      next: () => {
        this.painel.update((painel) =>
          painel
            ? { ...painel, discarded: painel.discarded.filter((d) => d.professionId !== professionId) }
            : painel,
        );
        this.reconsiderando.set(null);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.reconsiderando.set(null);
      },
    });
  }
}

function chaveDosPassos(studentId: number): string {
  return `norte.passos.${studentId}`;
}

function lerPassos(studentId: number): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(chaveDosPassos(studentId)) ?? '{}');
  } catch {
    return {};
  }
}

function gravarPassos(studentId: number, marcados: Record<string, boolean>): void {
  try {
    localStorage.setItem(chaveDosPassos(studentId), JSON.stringify(marcados));
  } catch {
    // Sem armazenamento (aba anonima, cota cheia): o marco vale so ate recarregar a pagina.
  }
}
