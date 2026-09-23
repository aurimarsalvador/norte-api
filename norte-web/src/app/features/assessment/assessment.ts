import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Assessment as AssessmentModel, Question } from '../../core/models/api.models';
import { Button } from '../../shared/button';
import { Spinner } from '../../shared/spinner';

/**
 * Jornada do questionario: uma pergunta por vez.
 *
 * <p>Cada escolha e salva na hora (autosave). Nao existe botao de salvar e nao existe
 * rascunho local: o servidor e a unica fonte de verdade, entao fechar o navegador no meio
 * nao custa nada ao estudante.
 */
@Component({
  selector: 'norte-assessment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Spinner],
  template: `
    <div class="conteudo">
      @if (carregando()) {
        <norte-spinner label="Preparando o questionario..." />
      } @else if (questao(); as atual) {
        <header class="topo">
          <p class="texto-suave">
            Pergunta {{ indice() + 1 }} de {{ questoes().length }}
          </p>
          <div class="progresso" role="meter" [attr.aria-valuenow]="respondidas()" aria-valuemin="0"
               [attr.aria-valuemax]="questoes().length" aria-label="Progresso do questionario">
            <div class="progresso-preenchido" [style.width.%]="percentualProgresso()"></div>
          </div>
          <p class="texto-suave respondidas">
            {{ respondidas() }} respondida(s). Minimo de {{ minimo() }} para concluir.
          </p>
        </header>

        @if (erro()) {
          <p class="aviso aviso--erro">{{ erro() }}</p>
        }

        <section class="cartao pergunta">
          <h1>{{ atual.text }}</h1>
          <p class="texto-suave">
            Nao existe resposta certa. Escolha a que mais parece com voce.
          </p>

          <ul class="alternativas">
            @for (opcao of atual.options; track opcao.id) {
              <li>
                <button
                  type="button"
                  class="alternativa"
                  [class.alternativa--escolhida]="escolhaDe(atual.id) === opcao.id"
                  [disabled]="salvando()"
                  (click)="escolher(atual.id, opcao.id)"
                >
                  {{ opcao.text }}
                </button>
              </li>
            }
          </ul>
        </section>

        <nav class="navegacao">
          <norte-button
            label="Voltar"
            variant="secundario"
            [disabled]="indice() === 0 || salvando()"
            (click)="anterior()"
          />

          @if (indice() < questoes().length - 1) {
            <norte-button
              label="Proxima"
              variant="secundario"
              [disabled]="salvando()"
              (click)="proxima()"
            />
          }

          <norte-button
            label="Concluir questionario"
            [disabled]="!podeConcluir() || salvando()"
            [loading]="concluindo()"
            loadingLabel="Concluindo..."
            (click)="concluir()"
          />
        </nav>

        @if (!podeConcluir()) {
          <p class="texto-suave">
            Responda mais {{ minimo() - respondidas() }} pergunta(s) para poder concluir.
          </p>
        }
      }
    </div>
  `,
  styles: `
    .topo {
      margin-bottom: calc(var(--espaco) * 3);
    }

    .progresso {
      background: var(--cor-superficie-alta);
      border-radius: 999px;
      height: 8px;
      overflow: hidden;
    }

    .progresso-preenchido {
      background: var(--cor-primaria);
      height: 100%;
      transition: width 0.3s ease;
    }

    .respondidas {
      font-size: 0.85rem;
      margin: 6px 0 0;
    }

    .pergunta h1 {
      font-size: 1.5rem;
    }

    .alternativas {
      list-style: none;
      margin: calc(var(--espaco) * 2) 0 0;
      padding: 0;
    }

    .alternativa {
      background: var(--cor-fundo);
      border: 1px solid var(--cor-borda);
      border-radius: var(--raio-pequeno);
      color: var(--cor-texto);
      cursor: pointer;
      font: inherit;
      margin-bottom: var(--espaco);
      padding: calc(var(--espaco) * 2);
      text-align: left;
      transition: border-color 0.15s ease, background 0.15s ease;
      width: 100%;
    }

    .alternativa:hover:not(:disabled) {
      border-color: var(--cor-acento);
    }

    .alternativa--escolhida {
      background: var(--cor-superficie-alta);
      border-color: var(--cor-primaria);
      box-shadow: inset 3px 0 0 var(--cor-primaria);
    }

    .navegacao {
      display: flex;
      flex-wrap: wrap;
      gap: var(--espaco);
      margin-top: calc(var(--espaco) * 3);
    }
  `,
})
export class Assessment {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly questoes = signal<Question[]>([]);
  protected readonly assessment = signal<AssessmentModel | null>(null);
  protected readonly indice = signal(0);

  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly concluindo = signal(false);
  protected readonly erro = signal('');

  protected readonly questao = computed(() => this.questoes()[this.indice()] ?? null);
  protected readonly respondidas = computed(() => this.assessment()?.answeredCount ?? 0);
  protected readonly minimo = computed(() => this.assessment()?.minimumAnswersToComplete ?? 0);
  protected readonly podeConcluir = computed(() => this.respondidas() >= this.minimo());

  protected readonly percentualProgresso = computed(() => {
    const total = this.questoes().length;
    return total === 0 ? 0 : (this.respondidas() / total) * 100;
  });

  constructor() {
    forkJoin({
      questions: this.api.listQuestions(),
      assessment: this.api.startOrResumeAssessment(),
    }).subscribe({
      next: ({ questions, assessment }) => {
        this.questoes.set(questions);
        this.aplicar(assessment);
        // Retoma na primeira pergunta ainda sem resposta, e nao sempre na primeira.
        this.indice.set(this.primeiraSemResposta(questions, assessment));
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }

  protected escolhaDe(questionId: number): number | null {
    return (
      this.assessment()?.answers.find((answer) => answer.questionId === questionId)
        ?.answerOptionId ?? null
    );
  }

  protected escolher(questionId: number, answerOptionId: number): void {
    this.salvando.set(true);
    this.erro.set('');

    this.api.answerQuestion(this.assessmentId(), questionId, answerOptionId).subscribe({
      next: (assessment) => {
        this.aplicar(assessment);
        this.salvando.set(false);
        // Avanca sozinho: o estudante escolheu, nao precisa confirmar de novo.
        if (this.indice() < this.questoes().length - 1) {
          this.indice.update((atual) => atual + 1);
        }
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.salvando.set(false);
      },
    });
  }

  protected anterior(): void {
    this.indice.update((atual) => Math.max(0, atual - 1));
  }

  protected proxima(): void {
    this.indice.update((atual) => Math.min(this.questoes().length - 1, atual + 1));
  }

  protected concluir(): void {
    this.concluindo.set(true);
    this.erro.set('');

    this.api.completeAssessment(this.assessmentId()).subscribe({
      next: () => void this.router.navigate(['/perfil']),
      error: (error: Error) => {
        this.erro.set(error.message);
        this.concluindo.set(false);
      },
    });
  }

  private aplicar(assessment: AssessmentModel): void {
    this.assessment.set(assessment);
    this.auth.rememberAssessment(assessment.id);
  }

  private assessmentId(): number {
    const assessment = this.assessment();
    if (!assessment) {
      throw new Error('Questionario ainda nao foi carregado.');
    }
    return assessment.id;
  }

  private primeiraSemResposta(questions: Question[], assessment: AssessmentModel): number {
    const respondidas = new Set(assessment.answers.map((answer) => answer.questionId));
    const indice = questions.findIndex((question) => !respondidas.has(question.id));
    return indice === -1 ? 0 : indice;
  }
}
