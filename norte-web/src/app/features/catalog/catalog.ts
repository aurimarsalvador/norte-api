import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { CareerArea, ProfessionSummary } from '../../core/models/api.models';
import { CompatibilityGauge } from '../../shared/compatibility-gauge';
import { EmptyState } from '../../shared/empty-state';
import { Spinner } from '../../shared/spinner';

/**
 * Explorador de profissoes.
 *
 * <p>Sem questionario respondido a lista continua navegavel, apenas sem percentual. Mostrar
 * um numero sem lastro seria pior do que nao mostrar nenhum.
 */
@Component({
  selector: 'norte-catalog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CompatibilityGauge, Spinner, EmptyState],
  template: `
    <div class="conteudo">
      <h1>Explorar profissoes</h1>
      <p class="texto-suave">
        @if (temQuestionario()) {
          O percentual indica o quanto cada profissao conversa com as caracteristicas que
          voce demonstrou. Use como ponto de partida para investigar, nao como resposta
          pronta.
        } @else {
          Responda ao questionario para ver o quanto cada profissao conversa com o seu
          perfil.
        }
      </p>

      <div class="filtros">
        <button
          type="button"
          class="etiqueta filtro"
          [class.filtro--ativo]="areaSelecionada() === null"
          (click)="filtrarPor(null)"
        >
          Todas as areas
        </button>
        @for (area of areas(); track area.id) {
          <button
            type="button"
            class="etiqueta filtro"
            [class.filtro--ativo]="areaSelecionada() === area.code"
            (click)="filtrarPor(area.code)"
          >
            {{ area.name }}
          </button>
        }
      </div>

      @if (carregando()) {
        <norte-spinner label="Buscando profissoes..." />
      } @else if (erro()) {
        <p class="aviso aviso--erro">{{ erro() }}</p>
      } @else if (profissoes().length) {
        <div class="grade">
          @for (profissao of profissoes(); track profissao.id) {
            <article class="cartao profissao">
              <div class="cabecalho">
                <div>
                  <span class="etiqueta">{{ profissao.careerArea.name }}</span>
                  <h2>{{ profissao.name }}</h2>
                </div>
                @if (profissao.compatibility !== null) {
                  <norte-compatibility-gauge [percentage]="profissao.compatibility" [compact]="true" />
                }
              </div>

              <p class="texto-suave">{{ profissao.summary }}</p>

              @if (profissao.interestLevel === 'FAVORITE') {
                <span class="etiqueta marcador">Nos seus favoritos</span>
              } @else if (profissao.interestLevel === 'NOT_INTERESTED') {
                <span class="etiqueta marcador">Voce marcou como nao interessa</span>
              }

              <a class="botao botao--secundario" [routerLink]="['/profissoes', profissao.id]">
                Conhecer melhor
              </a>
            </article>
          }
        </div>
      } @else {
        <norte-empty-state
          title="Nenhuma profissao nesta area"
          message="Escolha outra area para continuar explorando."
        />
      }
    </div>
  `,
  styles: `
    .filtros {
      display: flex;
      flex-wrap: wrap;
      gap: var(--espaco);
      margin-bottom: calc(var(--espaco) * 3);
    }

    .filtro {
      background: var(--cor-superficie);
      border: 1px solid var(--cor-borda);
      cursor: pointer;
      font: inherit;
      font-size: 0.85rem;
      padding: 4px 14px;
    }

    .filtro--ativo {
      background: var(--cor-primaria);
      border-color: var(--cor-primaria);
      color: #1b1200;
      font-weight: 600;
    }

    .profissao {
      display: flex;
      flex-direction: column;
    }

    .cabecalho {
      align-items: flex-start;
      display: flex;
      gap: var(--espaco);
      justify-content: space-between;
    }

    .cabecalho h2 {
      font-size: 1.15rem;
      margin: 6px 0 0;
    }

    .marcador {
      align-self: flex-start;
      margin-bottom: calc(var(--espaco) * 1.5);
    }

    .profissao a {
      align-self: flex-start;
      margin-top: auto;
      text-decoration: none;
    }
  `,
})
export class Catalog {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected readonly areas = signal<CareerArea[]>([]);
  protected readonly profissoes = signal<ProfessionSummary[]>([]);
  protected readonly areaSelecionada = signal<string | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  protected temQuestionario(): boolean {
    return this.auth.assessmentId !== null;
  }

  constructor() {
    forkJoin({
      areas: this.api.listCareerAreas(),
      professions: this.api.listProfessions(null, this.auth.assessmentId),
    }).subscribe({
      next: ({ areas, professions }) => {
        this.areas.set(areas);
        this.profissoes.set(professions);
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }

  protected filtrarPor(areaCode: string | null): void {
    this.areaSelecionada.set(areaCode);
    this.carregando.set(true);
    this.erro.set('');

    this.api.listProfessions(areaCode, this.auth.assessmentId).subscribe({
      next: (professions) => {
        this.profissoes.set(professions);
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }
}
