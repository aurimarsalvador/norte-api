import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Profile as ProfileModel } from '../../core/models/api.models';
import { Icon } from '../../shared/icon';
import { Intro, TopBar } from '../../shared/kit';
import { Spinner } from '../../shared/spinner';
import { TraitBar } from '../../shared/trait-bar';

/**
 * Perfil exploratorio: as caracteristicas que mais apareceram nas respostas, em ordem. O
 * texto e sempre provisorio ("por enquanto") e a nota amarela lembra que nao e um rotulo.
 */
@Component({
  selector: 'norte-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Intro, TopBar, TraitBar, Spinner],
  template: `
    <div class="tela">
      <norte-top-bar />

      <div class="tela-corpo tela-corpo--pilha">
        @if (carregando()) {
          <norte-spinner label="Calculando seu perfil..." />
        } @else if (erro()) {
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        } @else if (tracos().length) {
          <norte-intro
            sobrancelha="Seu perfil exploratório"
            titulo="O que mais aparece em você, por enquanto"
            apoio="A partir das suas respostas, estas são as características que mais se destacaram."
          />

          <section class="barras">
            @for (traco of tracos(); track traco.traitId; let i = $index) {
              <norte-trait-bar
                [name]="traco.name"
                [percentage]="traco.percentage"
                [emphasis]="i < 3 ? 'strong' : 'soft'"
              />
            }
          </section>

          <div class="nota">
            <norte-icon name="info" [size]="22" color="var(--ink-900)" />
            <p>
              <strong>Esse perfil não é um rótulo.</strong> Ele mostra suas preferências de hoje
              e vai mudando conforme você explora, experimenta e responde de novo.
            </p>
          </div>

          @if (perfil()?.status === 'IN_PROGRESS') {
            <p class="texto-suave rodape">
              Baseado em {{ perfil()?.answeredQuestions }} respostas. Termine a jornada para
              ver o retrato completo.
            </p>
          }

          <div class="acoes">
            <a class="botao botao--lg botao--largo" routerLink="/profissoes">
              Ver carreiras recomendadas
              <norte-icon name="arrow-right" />
            </a>
            @if (perfil()?.status === 'IN_PROGRESS') {
              <a class="botao botao--discreto botao--largo" routerLink="/questionario">
                Continuar a jornada
              </a>
            }
          </div>
        } @else {
          <norte-intro
            sobrancelha="Seu perfil exploratório"
            titulo="Seu perfil aparece aqui"
            apoio="Ele nasce das suas respostas na jornada de autodescoberta. São situações do dia a dia, sem notas e sem pressa."
          />
          <a class="botao botao--lg botao--largo" routerLink="/questionario">
            Começar a jornada
            <norte-icon name="arrow-right" />
          </a>
        }
      </div>
    </div>
  `,
  styles: `
    .barras {
      background: var(--surface-card);
      border: 1.5px solid var(--border-default);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 20px;
    }

    .nota {
      background: var(--sun-100);
      border-radius: var(--radius-lg);
      display: flex;
      gap: 12px;
      padding: 16px;
    }

    .nota norte-icon {
      margin-top: 1px;
    }

    .nota p {
      color: var(--ink-900);
      font-size: 16px;
      line-height: 24px;
      margin: 0;
      text-wrap: pretty;
    }

    .rodape {
      margin: 0;
    }

    .acoes {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  `,
})
export class Profile {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected readonly perfil = signal<ProfileModel | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  /** Do maior para o menor: as tres primeiras ganham a barra escura. */
  protected readonly tracos = computed(() =>
    [...(this.perfil()?.traits ?? [])].sort(
      (a, b) => Number(b.percentage) - Number(a.percentage),
    ),
  );

  constructor() {
    const assessmentId = this.auth.assessmentId;

    if (!assessmentId) {
      this.carregando.set(false);
      return;
    }

    this.api.getProfile(assessmentId).subscribe({
      next: (perfil) => {
        this.perfil.set(perfil);
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }
}
