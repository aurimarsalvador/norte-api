import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { InterestLevel, ProfessionDetail as ProfessionDetailModel } from '../../core/models/api.models';
import { Button } from '../../shared/button';
import { CompatibilityGauge } from '../../shared/compatibility-gauge';
import { ReasonList } from '../../shared/reason-list';
import { Spinner } from '../../shared/spinner';

@Component({
  selector: 'norte-profession-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CompatibilityGauge, ReasonList, Spinner, Button],
  template: `
    <div class="conteudo">
      @if (carregando()) {
        <norte-spinner label="Carregando a profissao..." />
      } @else if (erro()) {
        <p class="aviso aviso--erro">{{ erro() }}</p>
      } @else if (profissao(); as dados) {
        <a class="voltar texto-suave" routerLink="/profissoes">&larr; Voltar para o explorador</a>

        <header class="topo">
          <div>
            <span class="etiqueta">{{ dados.careerArea.name }}</span>
            <h1>{{ dados.name }}</h1>
            <p class="texto-suave">{{ dados.summary }}</p>
          </div>
          @if (dados.compatibility !== null) {
            <norte-compatibility-gauge [percentage]="dados.compatibility" />
          }
        </header>

        @if (dados.compatibility !== null) {
          <section class="cartao">
            <norte-reason-list [reasons]="dados.reasons" />
          </section>
        } @else {
          <p class="aviso aviso--neutro">
            Responda ao questionario para ver o quanto esta profissao conversa com o seu
            perfil.
          </p>
        }

        <section class="cartao">
          <h2>O que se faz</h2>
          <p>{{ dados.description }}</p>

          <h3>No dia a dia</h3>
          <p class="texto-suave">{{ dados.typicalActivities }}</p>

          <h3>Como se forma</h3>
          <p class="texto-suave">{{ dados.educationPath }}</p>
        </section>

        <section class="cartao">
          <h2>O que essa profissao mais exige</h2>
          <ul class="exigencias">
            @for (trait of dados.requiredTraits; track trait.traitId) {
              <li>
                <div class="exigencia-cabecalho">
                  <strong>{{ trait.name }}</strong>
                  <span class="peso" [attr.aria-label]="'peso ' + trait.weight + ' de 5'">
                    @for (ponto of [1, 2, 3, 4, 5]; track ponto) {
                      <span class="ponto" [class.ponto--cheio]="ponto <= trait.weight"></span>
                    }
                  </span>
                </div>
                <span class="texto-suave">{{ trait.description }}</span>
              </li>
            }
          </ul>
        </section>

        @if (dados.microExperience; as experiencia) {
          <section class="cartao destaque">
            <h2>Experimente antes de decidir</h2>
            <p>
              <strong>{{ experiencia.title }}</strong>
              <span class="etiqueta">cerca de {{ experiencia.estimatedMinutes }} min</span>
            </p>
            <p class="texto-suave">
              A forma mais honesta de saber se combina com voce e fazer um pedaco do trabalho
              de verdade.
            </p>
            <a class="botao" [routerLink]="['/microexperiencias', dados.id]">
              Ver a microexperiencia
            </a>
          </section>
        }

        <section class="cartao">
          <h2>O que voce achou?</h2>
          <p class="texto-suave">
            Marcar aqui ajuda a montar o seu painel. Voce pode mudar de ideia quando quiser.
          </p>

          @if (avisoFeedback()) {
            <p class="aviso aviso--sucesso">{{ avisoFeedback() }}</p>
          }

          <div class="acoes">
            <norte-button
              label="Quero saber mais"
              [variant]="dados.interestLevel === 'FAVORITE' ? 'primario' : 'secundario'"
              [loading]="salvandoFeedback() === 'FAVORITE'"
              (click)="marcar('FAVORITE')"
            />
            <norte-button
              label="Ainda em duvida"
              [variant]="dados.interestLevel === 'NEUTRAL' ? 'primario' : 'secundario'"
              [loading]="salvandoFeedback() === 'NEUTRAL'"
              (click)="marcar('NEUTRAL')"
            />
            <norte-button
              label="Nao e para mim"
              [variant]="dados.interestLevel === 'NOT_INTERESTED' ? 'primario' : 'secundario'"
              [loading]="salvandoFeedback() === 'NOT_INTERESTED'"
              (click)="marcar('NOT_INTERESTED')"
            />
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .voltar {
      display: inline-block;
      margin-bottom: calc(var(--espaco) * 2);
      text-decoration: none;
    }

    .topo {
      align-items: flex-start;
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--espaco) * 2);
      justify-content: space-between;
      margin-bottom: calc(var(--espaco) * 3);
    }

    .topo h1 {
      margin: 6px 0;
    }

    section {
      margin-bottom: calc(var(--espaco) * 2);
    }

    .destaque {
      border-color: var(--cor-primaria);
    }

    .destaque a {
      text-decoration: none;
    }

    .exigencias {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .exigencias li {
      border-bottom: 1px solid var(--cor-borda);
      display: flex;
      flex-direction: column;
      padding: calc(var(--espaco) * 1.5) 0;
    }

    .exigencias li:last-child {
      border-bottom: none;
    }

    .exigencia-cabecalho {
      display: flex;
      gap: var(--espaco);
      justify-content: space-between;
    }

    .peso {
      display: inline-flex;
      gap: 3px;
    }

    .ponto {
      background: var(--cor-superficie-alta);
      border-radius: 50%;
      display: inline-block;
      height: 9px;
      width: 9px;
    }

    .ponto--cheio {
      background: var(--cor-primaria);
    }

    .acoes {
      display: flex;
      flex-wrap: wrap;
      gap: var(--espaco);
    }
  `,
})
export class ProfessionDetail {
  /** Vem da rota via withComponentInputBinding(). */
  readonly professionId = input.required<string>();

  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  protected readonly profissao = signal<ProfessionDetailModel | null>(null);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly salvandoFeedback = signal<InterestLevel | null>(null);
  protected readonly avisoFeedback = signal('');

  ngOnInit(): void {
    this.api.getProfession(Number(this.professionId()), this.auth.assessmentId).subscribe({
      next: (profissao) => {
        this.profissao.set(profissao);
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }

  protected marcar(interestLevel: InterestLevel): void {
    const atual = this.profissao();
    if (!atual) {
      return;
    }

    this.salvandoFeedback.set(interestLevel);
    this.avisoFeedback.set('');

    this.api.saveFeedback(atual.id, interestLevel).subscribe({
      next: () => {
        this.profissao.set({ ...atual, interestLevel });
        this.salvandoFeedback.set(null);
        this.avisoFeedback.set('Anotado. Isso ja aparece no seu painel.');
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.salvandoFeedback.set(null);
      },
    });
  }
}
