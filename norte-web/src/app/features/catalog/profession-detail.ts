import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import {
  InterestLevel,
  ProfessionDetail as ProfessionDetailModel,
  RecommendationReason,
} from '../../core/models/api.models';
import { Badge, ScoreBadge } from '../../shared/badge';
import { Button } from '../../shared/button';
import { Card } from '../../shared/card';
import { Icon, IconName } from '../../shared/icon';
import { TopBar } from '../../shared/kit';
import { Spinner } from '../../shared/spinner';

/**
 * Detalhe de uma profissao. A explicacao e literal ("Apareceu aqui porque suas respostas
 * mostraram interesse em ...") e vem das mesmas justificativas que a API calculou: quando
 * nenhuma caracteristica passou do corte de confianca, a tela diz isso em vez de improvisar.
 */
@Component({
  selector: 'norte-profession-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Badge, ScoreBadge, Button, Card, Icon, TopBar, Spinner],
  template: `
    <div class="tela">
      <norte-top-bar voltarPara="/profissoes" />

      <div class="tela-corpo tela-corpo--pilha secoes">
        @if (carregando()) {
          <norte-spinner label="Carregando a profissão..." />
        } @else if (profissao(); as dados) {
          <div class="abertura">
            <span class="sobrancelha">{{ dados.careerArea.name }}</span>
            <h1>{{ dados.name }}</h1>
            <div class="etiquetas">
              @if (dados.compatibility !== null) {
                <norte-score-badge [percentage]="dados.compatibility" />
              }
              @for (razao of dados.reasons; track razao.traitId) {
                <norte-badge icon="check">{{ razao.traitName }}</norte-badge>
              }
            </div>
            <div class="marcar">
              <norte-button
                class="metade"
                [label]="dados.interestLevel === 'FAVORITE' ? 'Favoritada' : 'Favoritar'"
                [variant]="dados.interestLevel === 'FAVORITE' ? 'secundario' : 'contorno'"
                iconLeft="heart"
                [fullWidth]="true"
                [loading]="salvando() === 'FAVORITE'"
                (click)="alternar('FAVORITE')"
              />
              <norte-button
                class="metade"
                label="Sem interesse"
                [variant]="dados.interestLevel === 'NOT_INTERESTED' ? 'secundario' : 'contorno'"
                iconLeft="x"
                [fullWidth]="true"
                [loading]="salvando() === 'NOT_INTERESTED'"
                (click)="alternar('NOT_INTERESTED')"
              />
            </div>
            @if (erro()) {
              <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
            }
          </div>

          <norte-card tone="mint" icon="lightbulb" title="Por que apareceu pra você">
            <p class="explicacao">{{ explicacao() }}</p>
          </norte-card>

          @for (secao of secoes(); track secao.titulo) {
            <section class="secao">
              <div class="secao-titulo">
                <span class="chip"><norte-icon [name]="secao.icone" [size]="19" /></span>
                <h2>{{ secao.titulo }}</h2>
              </div>
              <p>{{ secao.texto }}</p>
            </section>
          }

          @if (dados.requiredTraits.length) {
            <section class="secao">
              <div class="secao-titulo">
                <span class="chip"><norte-icon name="list-checks" [size]="19" /></span>
                <h2>O que ela mais pede?</h2>
              </div>
              <div class="etiquetas">
                @for (traco of dados.requiredTraits; track traco.traitId) {
                  <norte-badge tone="neutral">{{ traco.name }}</norte-badge>
                }
              </div>
            </section>
          }

          @if (dados.microExperience; as experiencia) {
            <norte-card
              tone="inverse"
              icon="flask-conical"
              [eyebrow]="'Micro-experiência · ' + experiencia.estimatedMinutes + ' min'"
              [title]="experiencia.title"
            >
              <p class="convite">
                Um desafio curto, parecido com o que essa profissão resolve no dia a dia.
              </p>
              <a class="botao botao--secundario botao--largo" [routerLink]="['/microexperiencias', dados.id]">
                Experimentar agora
                <norte-icon name="arrow-right" />
              </a>
            </norte-card>
          }
        } @else if (erro()) {
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    .secoes {
      gap: 32px;
    }

    .abertura {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .abertura h1 {
      margin: 0;
      text-wrap: balance;
    }

    .etiquetas {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .marcar {
      display: flex;
      gap: 10px;
      margin-top: 4px;
    }

    .metade {
      flex: 1;
    }

    .aviso {
      margin: 0;
    }

    .explicacao {
      color: var(--text-strong);
      margin: 0;
    }

    .secao {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .secao p {
      margin: 0;
      white-space: pre-line;
    }

    .secao-titulo {
      align-items: center;
      display: flex;
      gap: 10px;
    }

    .secao-titulo h2 {
      font-size: var(--fs-h3);
      line-height: var(--lh-h3);
      margin: 0;
    }

    .chip {
      background: var(--green-50);
      border-radius: 12px;
      color: var(--green-700);
      display: grid;
      height: 36px;
      place-items: center;
      width: 36px;
    }

    .convite {
      color: var(--green-100);
      font-size: 16px;
      line-height: 24px;
      margin: 0;
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
  protected readonly salvando = signal<InterestLevel | null>(null);

  protected readonly explicacao = computed(() => {
    const dados = this.profissao();
    if (!dados || dados.compatibility === null) {
      return 'Faça a jornada de autodescoberta para ver o quanto esta profissão combina com você.';
    }
    return explicar(dados.reasons);
  });

  protected readonly secoes = computed(() => {
    const dados = this.profissao();
    if (!dados) {
      return [];
    }
    const secoes: { icone: IconName; titulo: string; texto: string }[] = [
      { icone: 'briefcase', titulo: 'O que faz?', texto: dados.description },
      { icone: 'clock', titulo: 'Como é o dia a dia?', texto: dados.typicalActivities },
      { icone: 'graduation-cap', titulo: 'Como chegar lá?', texto: dados.educationPath },
    ];
    return secoes.filter((secao) => secao.texto?.trim());
  });

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

  /** Marcar de novo o que ja esta marcado desfaz: volta para neutro. */
  protected alternar(nivel: InterestLevel): void {
    const atual = this.profissao();
    if (!atual) {
      return;
    }

    const interestLevel: InterestLevel = atual.interestLevel === nivel ? 'NEUTRAL' : nivel;
    this.salvando.set(nivel);
    this.erro.set('');

    this.api.saveFeedback(atual.id, interestLevel).subscribe({
      next: () => {
        this.profissao.set({ ...atual, interestLevel });
        this.salvando.set(null);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.salvando.set(null);
      },
    });
  }
}

/** "Apareceu aqui porque suas respostas mostraram interesse em a, b e c." */
export function explicar(razoes: RecommendationReason[]): string {
  if (!razoes.length) {
    return (
      'Suas respostas ainda não apontaram com clareza para o que esta profissão mais pede. ' +
      'Isso não a descarta: vale conhecer melhor e experimentar antes de tirar conclusões.'
    );
  }
  const nomes = razoes.map((razao) => razao.traitName.toLocaleLowerCase('pt-BR'));
  const lista =
    nomes.length < 2 ? nomes[0] : `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
  return `Apareceu aqui porque suas respostas mostraram interesse em ${lista}.`;
}
