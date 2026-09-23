import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { InterestLevel, ProfessionSummary } from '../../core/models/api.models';
import { Badge, ScoreBadge } from '../../shared/badge';
import { Icon } from '../../shared/icon';
import { IconButton } from '../../shared/icon-button';
import { Intro, TopBar } from '../../shared/kit';
import { Spinner } from '../../shared/spinner';

interface GrupoDeArea {
  area: string;
  profissoes: ProfessionSummary[];
}

/**
 * Carreiras pra explorar, agrupadas por area e ordenadas pela compatibilidade. Quem foi
 * marcado como "sem interesse" sai da lista, mas continua no Meu Caminho, de onde da para
 * reconsiderar.
 *
 * <p>Sem jornada respondida a lista continua navegavel, apenas sem percentual: mostrar um
 * numero sem lastro seria pior do que nao mostrar nenhum.
 */
@Component({
  selector: 'norte-catalog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Badge, ScoreBadge, Icon, IconButton, Intro, TopBar, Spinner],
  template: `
    <div class="tela">
      <norte-top-bar />

      <div class="tela-corpo tela-corpo--pilha">
        <norte-intro
          titulo="Carreiras pra explorar"
          [apoio]="
            temJornada()
              ? 'Organizadas pelo que mais combina com o seu perfil. Toque numa profissão para entender o porquê.'
              : 'Faça a jornada de autodescoberta para ver o quanto cada profissão combina com você.'
          "
        />

        @if (!temJornada()) {
          <a class="botao botao--secundario botao--largo" routerLink="/questionario">
            Começar a jornada
          </a>
        }

        @if (erro()) {
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        }

        @if (carregando()) {
          <norte-spinner label="Buscando carreiras..." />
        } @else {
          @for (grupo of grupos(); track grupo.area) {
            <section class="grupo">
              <h2 class="sobrancelha">{{ grupo.area }}</h2>

              @for (profissao of grupo.profissoes; track profissao.id) {
                <article
                  class="carreira"
                  tabindex="0"
                  role="link"
                  [attr.aria-label]="profissao.name"
                  (click)="abrir(profissao.id)"
                  (keydown.enter)="abrir(profissao.id)"
                >
                  <div class="cabecalho">
                    <div class="nomes">
                      <span class="nome">{{ profissao.name }}</span>
                      <span class="resumo">{{ profissao.summary }}</span>
                    </div>
                    @if (profissao.compatibility !== null) {
                      <norte-score-badge [percentage]="profissao.compatibility" [compact]="true" />
                    }
                  </div>

                  @if (profissao.reasons.length) {
                    <div class="tracos">
                      @for (razao of profissao.reasons; track razao.traitId) {
                        <norte-badge icon="check" size="sm">{{ razao.traitName }}</norte-badge>
                      }
                    </div>
                  }

                  <div class="rodape">
                    <span class="detalhes">Ver detalhes <norte-icon name="chevron-right" [size]="18" /></span>
                    <div class="rapidas">
                      <norte-icon-button
                        icon="x"
                        tone="dismiss"
                        label="Não tenho interesse"
                        [disabled]="salvando() === profissao.id"
                        (pressionar)="marcar(profissao, 'NOT_INTERESTED')"
                      />
                      <norte-icon-button
                        icon="heart"
                        tone="favorite"
                        [label]="profissao.interestLevel === 'FAVORITE' ? 'Remover dos favoritos' : 'Favoritar'"
                        [active]="profissao.interestLevel === 'FAVORITE'"
                        [disabled]="salvando() === profissao.id"
                        (pressionar)="
                          marcar(profissao, profissao.interestLevel === 'FAVORITE' ? 'NEUTRAL' : 'FAVORITE')
                        "
                      />
                    </div>
                  </div>
                </article>
              }
            </section>
          } @empty {
            <p class="texto-suave">Nenhuma carreira por aqui ainda.</p>
          }

          @if (semInteresse(); as n) {
            <p class="alternativa">
              {{ n }} {{ n > 1 ? 'profissões marcadas' : 'profissão marcada' }} sem interesse.
              <a class="link-texto" routerLink="/meu-caminho">Ver no Meu Caminho</a>
            </p>
          }
        }
      </div>
    </div>
  `,
  styles: `
    .grupo {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .grupo h2 {
      font-family: var(--font-body);
      margin: 0;
    }

    .carreira {
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 18px;
      transition: border-color var(--dur-fast);
    }

    .carreira:hover {
      border-color: var(--border-strong);
    }

    .carreira:focus-visible {
      box-shadow: var(--focus-ring);
      outline: none;
    }

    .cabecalho {
      align-items: flex-start;
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    .nomes {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .nome {
      color: var(--text-strong);
      font-family: var(--font-display);
      font-size: var(--fs-h3);
      line-height: var(--lh-h3);
    }

    .resumo {
      color: var(--text-muted);
      font-size: var(--fs-small);
      line-height: var(--lh-small);
    }

    .tracos {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .rodape {
      align-items: center;
      border-top: 1px solid var(--border-default);
      display: flex;
      justify-content: space-between;
      padding-top: 12px;
    }

    .detalhes {
      align-items: center;
      color: var(--text-link);
      display: inline-flex;
      font-weight: 600;
      gap: 4px;
    }

    .rapidas {
      display: flex;
      gap: 8px;
    }

    .alternativa {
      margin: 0;
      text-align: center;
    }

    .aviso {
      margin: 0;
    }
  `,
})
export class Catalog {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly profissoes = signal<ProfessionSummary[]>([]);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal<number | null>(null);
  protected readonly erro = signal('');

  protected readonly temJornada = signal(this.auth.assessmentId !== null);

  protected readonly semInteresse = computed(
    () => this.profissoes().filter((p) => p.interestLevel === 'NOT_INTERESTED').length,
  );

  /** Areas ordenadas pela profissao mais compativel de cada uma; dentro delas, idem. */
  protected readonly grupos = computed<GrupoDeArea[]>(() => {
    const porArea = new Map<string, ProfessionSummary[]>();
    for (const profissao of this.profissoes()) {
      if (profissao.interestLevel === 'NOT_INTERESTED') {
        continue;
      }
      const area = profissao.careerArea.name;
      porArea.set(area, [...(porArea.get(area) ?? []), profissao]);
    }

    return [...porArea.entries()]
      .map(([area, profissoes]) => ({
        area,
        profissoes: profissoes.sort((a, b) => nota(b) - nota(a)),
      }))
      .sort((a, b) => nota(b.profissoes[0]) - nota(a.profissoes[0]));
  });

  constructor() {
    this.api.listProfessions(null, this.auth.assessmentId).subscribe({
      next: (profissoes) => {
        this.profissoes.set(profissoes);
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }

  protected abrir(professionId: number): void {
    void this.router.navigate(['/profissoes', professionId]);
  }

  protected marcar(profissao: ProfessionSummary, interestLevel: InterestLevel): void {
    this.salvando.set(profissao.id);
    this.erro.set('');

    this.api.saveFeedback(profissao.id, interestLevel).subscribe({
      next: () => {
        this.profissoes.update((lista) =>
          lista.map((p) => (p.id === profissao.id ? { ...p, interestLevel } : p)),
        );
        this.salvando.set(null);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.salvando.set(null);
      },
    });
  }
}

function nota(profissao: ProfessionSummary): number {
  return profissao.compatibility === null ? -1 : Number(profissao.compatibility);
}
