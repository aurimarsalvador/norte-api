import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/api.service';
import { MicroExperience as MicroExperienceModel } from '../../core/models/api.models';
import { Button } from '../../shared/button';
import { Spinner } from '../../shared/spinner';

@Component({
  selector: 'norte-micro-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Button, Spinner],
  template: `
    <div class="conteudo estreito">
      @if (carregando()) {
        <norte-spinner label="Carregando a microexperiencia..." />
      } @else if (erro() && !experiencia()) {
        <p class="aviso aviso--erro">{{ erro() }}</p>
      } @else if (experiencia(); as tarefa) {
        <a class="voltar texto-suave" [routerLink]="['/profissoes', tarefa.professionId]">
          &larr; Voltar para {{ tarefa.professionName }}
        </a>

        <span class="etiqueta">cerca de {{ tarefa.estimatedMinutes }} minutos</span>
        <h1>{{ tarefa.title }}</h1>

        <section class="cartao">
          <h2>O que fazer</h2>
          <p>{{ tarefa.instructions }}</p>
        </section>

        <section class="cartao">
          <h2>Como foi para voce?</h2>
          <p class="texto-suave">
            Nao ha resposta certa e ninguem corrige a tarefa. O que importa e o que voce
            sentiu fazendo.
          </p>

          @if (enviado()) {
            <p class="aviso aviso--sucesso">
              Registrado. Sua avaliacao ja aparece no painel Meu Caminho.
            </p>
          }
          @if (erro()) {
            <p class="aviso aviso--erro">{{ erro() }}</p>
          }

          <form [formGroup]="form" (ngSubmit)="enviar()">
            <div class="campo">
              <label for="gostei">O quanto voce gostou? (1 = nada, 5 = muito)</label>
              <select id="gostei" formControlName="enjoymentRating">
                @for (nota of notas; track nota) {
                  <option [value]="nota">{{ nota }}</option>
                }
              </select>
            </div>

            <div class="campo">
              <label for="dificuldade">O quanto achou dificil? (1 = facil, 5 = muito dificil)</label>
              <select id="dificuldade" formControlName="difficultyRating">
                @for (nota of notas; track nota) {
                  <option [value]="nota">{{ nota }}</option>
                }
              </select>
            </div>

            <div class="campo">
              <label for="notas">Quer registrar alguma coisa? (opcional)</label>
              <textarea id="notas" rows="4" formControlName="notes"></textarea>
            </div>

            <norte-button
              label="Registrar minha avaliacao"
              type="submit"
              [loading]="enviando()"
              loadingLabel="Registrando..."
            />
          </form>
        </section>
      }
    </div>
  `,
  styles: `
    .estreito {
      max-width: 680px;
    }

    .voltar {
      display: inline-block;
      margin-bottom: calc(var(--espaco) * 2);
      text-decoration: none;
    }

    section {
      margin-bottom: calc(var(--espaco) * 2);
    }
  `,
})
export class MicroExperience {
  /** Id da profissao, vindo da rota. A microexperiencia e buscada a partir dela. */
  readonly professionId = input.required<string>();

  protected readonly notas = [1, 2, 3, 4, 5];

  private readonly api = inject(ApiService);

  protected readonly experiencia = signal<MicroExperienceModel | null>(null);
  protected readonly carregando = signal(true);
  protected readonly enviando = signal(false);
  protected readonly enviado = signal(false);
  protected readonly erro = signal('');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    enjoymentRating: [3, Validators.required],
    difficultyRating: [3, Validators.required],
    notes: [''],
  });

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

  protected enviar(): void {
    const tarefa = this.experiencia();
    if (!tarefa || this.form.invalid) {
      return;
    }

    this.enviando.set(true);
    this.erro.set('');
    this.enviado.set(false);

    const valores = this.form.getRawValue();

    this.api
      .respondMicroExperience(tarefa.id, {
        enjoymentRating: Number(valores.enjoymentRating),
        difficultyRating: Number(valores.difficultyRating),
        notes: valores.notes.trim() || null,
      })
      .subscribe({
        next: () => {
          this.enviado.set(true);
          this.enviando.set(false);
        },
        error: (error: Error) => {
          this.erro.set(error.message);
          this.enviando.set(false);
        },
      });
  }
}
