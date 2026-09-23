import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { MicroExperience as MicroExperienceModel } from '../../core/models/api.models';
import { Badge } from '../../shared/badge';
import { Button } from '../../shared/button';
import { Card } from '../../shared/card';
import { Intro, Sticker, TopBar } from '../../shared/kit';
import { SentimentScale } from '../../shared/sentiment-scale';
import { COMO_FOI, DIFICULDADE, mensagemDeRetorno, rotuloDoSentimento } from '../../shared/sentimento';
import { Spinner } from '../../shared/spinner';

type Etapa = 'desafio' | 'sentimento' | 'feito';

/**
 * Micro-experiencia em tres telas: o desafio (com uma anotacao opcional), como foi, e o
 * agradecimento. Nada e corrigido: o que importa e o que o estudante sentiu fazendo.
 */
@Component({
  selector: 'norte-micro-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, Badge, Button, Card, Intro, Sticker, TopBar, SentimentScale, Spinner],
  template: `
    <div class="tela">
      @if (carregando()) {
        <norte-top-bar [voltarPara]="'/profissoes/' + professionId()" />
        <norte-spinner label="Preparando o desafio..." />
      } @else if (experiencia(); as tarefa) {
        @switch (etapa()) {
          @case ('desafio') {
            <norte-top-bar [voltarPara]="'/profissoes/' + tarefa.professionId">
              <norte-badge tone="neutral" size="sm" icon="clock">{{ tarefa.estimatedMinutes }} min</norte-badge>
            </norte-top-bar>

            <div class="tela-corpo tela-corpo--pilha">
              <norte-intro [sobrancelha]="'Micro-experiência · ' + tarefa.professionName" [titulo]="tarefa.title" />

              <norte-card tone="sun" icon="flask-conical" title="O desafio">
                <p class="cenario">{{ tarefa.instructions }}</p>
              </norte-card>

              <div class="campo">
                <label for="notas">Sua ideia (opcional)</label>
                <textarea
                  id="notas"
                  rows="4"
                  maxlength="1000"
                  placeholder="Escreva do seu jeito. Pode ser um rascunho."
                  aria-describedby="notas-dica"
                  [(ngModel)]="notas"
                ></textarea>
                <span id="notas-dica" class="dica">Fica guardada junto com a sua avaliação.</span>
              </div>
            </div>

            <div class="tela-rodape">
              <norte-button label="Terminei" size="lg" [fullWidth]="true" iconRight="arrow-right" (click)="irPara('sentimento')" />
            </div>
          }

          @case ('sentimento') {
            <norte-top-bar [comVoltar]="true" (voltar)="irPara('desafio')" />

            <div class="tela-corpo tela-corpo--pilha">
              <norte-intro
                [sobrancelha]="tarefa.title"
                titulo="Como foi pra você?"
                apoio="Sua resposta ajuda a ajustar as recomendações. Não existe resposta errada."
              />

              <norte-sentiment-scale label="Como foi pra você?" [options]="comoFoi" [value]="gostei()" (valueChange)="gostei.set($event)" />

              <div class="pergunta">
                <h2>E a dificuldade?</h2>
                <norte-sentiment-scale label="E a dificuldade?" [options]="dificuldade" [value]="dificil()" (valueChange)="dificil.set($event)" />
              </div>

              @if (erro()) {
                <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
              }
            </div>

            <div class="tela-rodape">
              <norte-button
                label="Enviar"
                size="lg"
                [fullWidth]="true"
                [disabled]="gostei() === null || dificil() === null"
                [loading]="enviando()"
                loadingLabel="Enviando..."
                (click)="enviar(tarefa)"
              />
            </div>
          }

          @case ('feito') {
            <norte-top-bar />

            <div class="tela-corpo tela-corpo--pilha">
              <!-- Espaco da ilustracao de desafio concluido, ainda sem arte. -->
              <div class="heroi">
                <norte-sticker class="adesivo" fundo="var(--sun-400)" giro="-4deg">Micro-experiência feita</norte-sticker>
              </div>

              <norte-intro titulo="Valeu por experimentar!" [apoio]="retorno()" />

              <norte-card icon="flask-conical" [title]="tarefa.title">
                <norte-badge acao tone="coral" size="sm">{{ sentimento() }}</norte-badge>
                <span class="profissao">{{ tarefa.professionName }}</span>
              </norte-card>
            </div>

            <div class="tela-rodape">
              <a class="botao botao--lg botao--largo" routerLink="/meu-caminho">Ir para Meu Caminho</a>
              <a class="botao botao--discreto botao--largo" [routerLink]="['/profissoes', tarefa.professionId]">
                Voltar para a profissão
              </a>
            </div>
          }
        }
      } @else if (erro()) {
        <norte-top-bar [voltarPara]="'/profissoes/' + professionId()" />
        <div class="tela-corpo">
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        </div>
      }
    </div>
  `,
  styles: `
    .cenario {
      color: var(--ink-900);
      font-size: var(--fs-body-lg);
      line-height: var(--lh-body-lg);
      margin: 0;
      text-wrap: pretty;
      white-space: pre-line;
    }

    .campo {
      margin: 0;
    }

    .campo textarea {
      resize: vertical;
    }

    .dica {
      color: var(--text-muted);
      font-size: var(--fs-small);
      line-height: var(--lh-small);
    }

    .pergunta {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pergunta h2 {
      font-size: var(--fs-h3);
      line-height: var(--lh-h3);
      margin: 0;
    }

    .aviso {
      margin: 0;
    }

    .heroi {
      background: var(--green-100);
      border-radius: var(--radius-xl);
      flex-shrink: 0;
      height: 220px;
      position: relative;
    }

    .adesivo {
      bottom: -14px;
      left: 24px;
    }

    .profissao {
      color: var(--text-muted);
      font-size: var(--fs-small);
      margin-top: -8px;
    }
  `,
})
export class MicroExperience {
  /** Id da profissao, vindo da rota. A micro-experiencia e buscada a partir dela. */
  readonly professionId = input.required<string>();

  private readonly api = inject(ApiService);

  protected readonly comoFoi = COMO_FOI;
  protected readonly dificuldade = DIFICULDADE;

  protected readonly experiencia = signal<MicroExperienceModel | null>(null);
  protected readonly etapa = signal<Etapa>('desafio');
  protected readonly gostei = signal<number | null>(null);
  protected readonly dificil = signal<number | null>(null);
  protected notas = '';

  protected readonly carregando = signal(true);
  protected readonly enviando = signal(false);
  protected readonly erro = signal('');

  protected readonly sentimento = computed(() => rotuloDoSentimento(this.gostei() ?? 3));
  protected readonly retorno = computed(() => mensagemDeRetorno(this.gostei() ?? 3));

  ngOnInit(): void {
    this.api.getMicroExperience(Number(this.professionId())).subscribe({
      next: (experiencia) => {
        this.experiencia.set(experiencia);
        this.carregando.set(false);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.carregando.set(false);
      },
    });
  }

  protected irPara(etapa: Etapa): void {
    this.etapa.set(etapa);
    this.erro.set('');
    window.scrollTo({ top: 0 });
  }

  protected enviar(tarefa: MicroExperienceModel): void {
    const gostei = this.gostei();
    const dificil = this.dificil();
    if (gostei === null || dificil === null) {
      return;
    }

    this.enviando.set(true);
    this.erro.set('');

    this.api
      .respondMicroExperience(tarefa.id, {
        enjoymentRating: gostei,
        difficultyRating: dificil,
        notes: this.notas.trim() || null,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.irPara('feito');
        },
        error: (error: Error) => {
          this.erro.set(error.message);
          this.enviando.set(false);
        },
      });
  }
}
