import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { Button } from '../../shared/button';

@Component({
  selector: 'norte-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, Button],
  template: `
    <div class="conteudo estreito">
      <h1>Entrar</h1>
      <p class="texto-suave">Retome sua jornada de onde parou.</p>

      <form class="cartao" [formGroup]="form" (ngSubmit)="submit()">
        @if (erro()) {
          <p class="aviso aviso--erro">{{ erro() }}</p>
        }

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
            autocomplete="current-password"
          />
          @if (mostrarErro('password')) {
            <span class="erro-campo">Informe a sua senha.</span>
          }
        </div>

        <norte-button label="Entrar" type="submit" [loading]="enviando()" loadingLabel="Entrando..." />
      </form>

      <p class="texto-suave">
        Ainda nao tem conta? <a routerLink="/cadastrar">Criar uma agora</a>.
      </p>
    </div>
  `,
  styles: `
    .estreito {
      max-width: 460px;
    }
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly enviando = signal(false);
  protected readonly erro = signal('');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected mostrarErro(campo: 'email' | 'password'): boolean {
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

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        const destino = this.route.snapshot.queryParamMap.get('redirect') ?? '/meu-caminho';
        void this.router.navigateByUrl(destino);
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.enviando.set(false);
      },
    });
  }
}
