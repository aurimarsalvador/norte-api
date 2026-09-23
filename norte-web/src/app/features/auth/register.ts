import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { Button } from '../../shared/button';

@Component({
  selector: 'norte-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Button],
  template: `
    <div class="conteudo estreito">
      <h1>Criar conta</h1>
      <p class="texto-suave">
        Pedimos so o necessario para acompanhar a sua jornada: nome, e-mail, senha e o ano
        escolar. Nada alem disso.
      </p>

      <form class="cartao" [formGroup]="form" (ngSubmit)="submit()">
        @if (erro()) {
          <p class="aviso aviso--erro">{{ erro() }}</p>
        }

        <div class="campo">
          <label for="nome">Nome</label>
          <input id="nome" type="text" formControlName="name" autocomplete="name" />
          @if (mostrarErro('name')) {
            <span class="erro-campo">Informe o seu nome.</span>
          }
        </div>

        <div class="campo">
          <label for="email">E-mail</label>
          <input id="email" type="email" formControlName="email" autocomplete="email" />
          @if (mostrarErro('email')) {
            <span class="erro-campo">Informe um e-mail valido.</span>
          }
        </div>

        <div class="campo">
          <label for="senha">Senha</label>
          <input
            id="senha"
            type="password"
            formControlName="password"
            autocomplete="new-password"
          />
          @if (mostrarErro('password')) {
            <span class="erro-campo">A senha precisa ter pelo menos 8 caracteres.</span>
          }
        </div>

        <div class="campo">
          <label for="ano">Ano escolar</label>
          <select id="ano" formControlName="schoolYear">
            <option [value]="1">1o ano do Ensino Medio</option>
            <option [value]="2">2o ano do Ensino Medio</option>
            <option [value]="3">3o ano do Ensino Medio</option>
          </select>
        </div>

        <norte-button
          label="Comecar minha jornada"
          type="submit"
          [loading]="enviando()"
          loadingLabel="Criando conta..."
        />
      </form>

      <p class="texto-suave">Ja tem conta? <a routerLink="/entrar">Entrar</a>.</p>
    </div>
  `,
  styles: `
    .estreito {
      max-width: 460px;
    }
  `,
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly erro = signal('');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    schoolYear: [3, Validators.required],
  });

  protected mostrarErro(campo: 'name' | 'email' | 'password'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.dirty || control.touched);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.erro.set('');

    const valores = this.form.getRawValue();

    this.auth
      .register({ ...valores, schoolYear: Number(valores.schoolYear) })
      .subscribe({
        next: () => void this.router.navigate(['/questionario']),
        error: (error: Error) => {
          this.erro.set(error.message);
          this.enviando.set(false);
        },
      });
  }
}
