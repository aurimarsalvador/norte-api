import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Profile as ProfileModel } from '../../core/models/api.models';
import { EmptyState } from '../../shared/empty-state';
import { Spinner } from '../../shared/spinner';
import { TraitBar } from '../../shared/trait-bar';

@Component({
  selector: 'norte-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TraitBar, Spinner, EmptyState],
  template: `
    <div class="conteudo">
      <h1>Seu perfil de caracteristicas</h1>
      <p class="texto-suave">
        Cada barra mostra o quanto as suas respostas apontaram para aquela caracteristica,
        comparado ao maximo que voce poderia ter pontuado nas perguntas que respondeu. E um
        retrato do que voce respondeu hoje, nao um diagnostico.
      </p>

      @if (carregando()) {
        <norte-spinner label="Calculando seu perfil..." />
      } @else if (erro()) {
        <p class="aviso aviso--erro">{{ erro() }}</p>
      } @else if (perfil(); as dados) {
        @if (dados.traits.length) {
          <section class="cartao">
            @for (trait of dados.traits; track trait.traitId) {
              <norte-trait-bar
                [name]="trait.name"
                [percentage]="trait.percentage"
                [description]="trait.description"
              />
            }
          </section>

          <p class="texto-suave rodape">
            Baseado em {{ dados.answeredQuestions }} pergunta(s) respondida(s).
            @if (dados.status === 'IN_PROGRESS') {
              O questionario ainda esta em andamento, entao este retrato pode mudar.
            }
          </p>

          <a class="botao" routerLink="/profissoes">Ver profissoes compativeis</a>
        } @else {
          <norte-empty-state
            title="Ainda nao ha o que mostrar"
            message="Responda algumas perguntas do questionario para o seu perfil comecar a tomar forma."
          >
            <a class="botao" routerLink="/questionario">Comecar o questionario</a>
          </norte-empty-state>
        }
      } @else {
        <norte-empty-state
          title="Voce ainda nao comecou"
          message="Seu perfil aparece aqui depois das primeiras respostas."
        >
          <a class="botao" routerLink="/questionario">Comecar o questionario</a>
        </norte-empty-state>
      }
    </div>
  `,
  styles: `
    .rodape {
      font-size: 0.9rem;
      margin-top: calc(var(--espaco) * 2);
    }
  `,
})
export class Profile {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected readonly perfil = signal<ProfileModel | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

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
