import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Assessment as AssessmentModel, Question } from '../../core/models/api.models';
import { Button } from '../../shared/button';
import { TopBar } from '../../shared/kit';
import { OptionCard } from '../../shared/option-card';
import { ProgressBar } from '../../shared/progress-bar';
import { Spinner } from '../../shared/spinner';

/**
 * Jornada de autodescoberta: uma pergunta situacional por tela.
 *
 * <p>Cada escolha e salva na hora (autosave), sem rascunho local: o servidor e a unica fonte
 * de verdade, entao fechar o navegador no meio nao custa nada ao estudante. O "Continuar"
 * so avanca; na ultima pergunta ele conclui e leva ao perfil.
 */
@Component({
  selector: 'norte-assessment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Button, TopBar, OptionCard, ProgressBar, Spinner],
  template: `
    <div class="tela">
      <norte-top-bar [comVoltar]="true" (voltar)="voltar()">
        <a class="botao botao--discreto botao--sm" routerLink="/meu-caminho">Pausar</a>
      </norte-top-bar>

      @if (carregando()) {
        <norte-spinner label="Preparando a jornada..." />
      } @else if (questao(); as atual) {
        <div class="tela-corpo tela-corpo--pilha">
          <norte-progress-bar
            [value]="indice() + 1"
            [max]="questoes().length"
            [label]="'Pergunta ' + (indice() + 1) + ' de ' + questoes().length"
          />

          <div class="enunciado">
            <h1>{{ atual.text }}</h1>
            <p>Escolha o que mais combina com você. Não existe resposta certa.</p>
          </div>

          <div class="opcoes" role="radiogroup" [attr.aria-label]="atual.text">
            @for (opcao of atual.options; track opcao.id) {
              <norte-option-card
                [selected]="escolhaDe(atual.id) === opcao.id"
                [disabled]="salvando()"
                (escolher)="escolher(atual.id, opcao.id)"
              >
                {{ opcao.text }}
              </norte-option-card>
            }
          </div>

          @if (erro()) {
            <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
          }
        </div>

        <div class="tela-rodape">
          <norte-button
            [label]="ultima() ? 'Ver meu perfil' : 'Continuar'"
            size="lg"
            [fullWidth]="true"
            [iconRight]="ultima() ? undefined : 'arrow-right'"
            [disabled]="escolhaDe(atual.id) === null || salvando()"
            [loading]="concluindo()"
            loadingLabel="Montando seu perfil..."
            (click)="continuar()"
          />
        </div>
      } @else if (erro()) {
        <div class="tela-corpo">
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        </div>
      }
    </div>
  `,
  styles: `
    .enunciado {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .enunciado h1 {
      font-size: var(--fs-h2);
      line-height: var(--lh-h2);
      margin: 0;
      text-wrap: balance;
    }

    .enunciado p {
      color: var(--text-muted);
      margin: 0;
    }

    .opcoes {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .aviso {
      margin: 0;
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
  protected readonly ultima = computed(() => this.indice() === this.questoes().length - 1);

  constructor() {
    forkJoin({
      questions: this.api.listQuestions(),
      assessment: this.api.startOrResumeAssessment(),
    }).subscribe({
      next: ({ questions, assessment }) => {
        this.questoes.set(questions);
        this.aplicar(assessment);
        // Retoma na primeira pergunta ainda sem resposta, e nao sempre na primeira.
        this.indice.set(this.primeiraSemResposta(questions, assessment) ?? 0);
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
    if (this.escolhaDe(questionId) === answerOptionId) {
      return;
    }

    this.salvando.set(true);
    this.erro.set('');

    this.api.answerQuestion(this.assessmentId(), questionId, answerOptionId).subscribe({
      next: (assessment) => {
        this.aplicar(assessment);
        this.salvando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.salvando.set(false);
      },
    });
  }

  protected voltar(): void {
    if (this.indice() > 0) {
      this.indice.update((atual) => atual - 1);
    } else {
      void this.router.navigate(['/meu-caminho']);
    }
  }

  protected continuar(): void {
    this.erro.set('');

    if (!this.ultima()) {
      this.indice.update((atual) => atual + 1);
      return;
    }

    // Quem pulou alguma pergunta (voltando e avancando) e levado ate ela antes de concluir.
    const pendente = this.primeiraSemResposta(this.questoes(), this.assessment());
    if (pendente !== null && this.respondidas() < this.minimo()) {
      this.indice.set(pendente);
      this.erro.set('Falta responder esta aqui antes de ver o seu perfil.');
      return;
    }

    this.concluir();
  }

  private concluir(): void {
    this.concluindo.set(true);

    this.api.completeAssessment(this.assessmentId()).subscribe({
      next: () => void this.router.navigate(['/perfil']),
      error: (error: Error) => {
        this.erro.set(error.message);
        this.concluindo.set(false);
      },
    });
  }

  private respondidas(): number {
    return this.assessment()?.answeredCount ?? 0;
  }

  private minimo(): number {
    return this.assessment()?.minimumAnswersToComplete ?? 0;
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

  private primeiraSemResposta(
    questions: Question[],
    assessment: AssessmentModel | null,
  ): number | null {
    const respondidas = new Set(assessment?.answers.map((answer) => answer.questionId) ?? []);
    const indice = questions.findIndex((question) => !respondidas.has(question.id));
    return indice === -1 ? null : indice;
  }
}
