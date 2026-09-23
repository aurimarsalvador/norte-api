import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { Button } from '../../shared/button';
import { TextField } from '../../shared/text-field';
import { AltRow, FormHeader, TopBar, Wordmark } from './kit';
import { emailValido, statusDoCampo, validador } from './validacao';

@Component({
  selector: 'norte-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AltRow, Button, FormHeader, TextField, TopBar, Wordmark],
  template: `
    <div class="tela">
      <norte-top-bar voltarPara="/">
        <norte-wordmark [size]="22" />
      </norte-top-bar>

      <form class="tela-corpo" [formGroup]="form" (ngSubmit)="submit()">
        <norte-form-header
          titulo="Que bom te ver de novo"
          subtitulo="Entre para continuar sua jornada de onde parou."
        />

        <div class="campos">
          <norte-text-field
            formControlName="email"
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            autocomplete="email"
            [status]="statusEmail()"
            message="Hmm, esse e-mail parece incompleto."
          />

          <norte-text-field
            formControlName="password"
            label="Senha"
            type="password"
            placeholder="Sua senha"
            autocomplete="current-password"
          />
        </div>

        <div class="tela-espaco"></div>

        @if (erro()) {
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        }

        <div class="tela-acoes">
          <norte-button
            label="Entrar"
            type="submit"
            size="lg"
            [fullWidth]="true"
            [disabled]="form.invalid"
            [loading]="enviando()"
          />
          <norte-alt-row pergunta="Ainda não tem conta?" acao="Criar conta" link="/cadastrar" />
        </div>
      </form>
    </div>
  `,
  styles: `
    form {
      gap: 28px;
    }

    .campos {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .aviso {
      margin: 0;
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
    email: ['', [validador('email', emailValido)]],
    password: ['', Validators.required],
  });

  protected statusEmail() {
    return statusDoCampo(this.form.controls.email);
  }

  protected submit(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.erro.set('');

    const { email, password } = this.form.getRawValue();

    this.auth.login({ email: email.trim(), password }).subscribe({
      next: () => {
        // Quem foi barrado pelo guard volta para onde queria ir; quem entrou pela porta da
        // frente ganha as boas-vindas de retorno.
        const destino = this.route.snapshot.queryParamMap.get('redirect');
        if (destino) {
          void this.router.navigateByUrl(destino);
        } else {
          void this.router.navigate(['/boas-vindas'], { state: { retorno: true } });
        }
      },
      error: (error: Error) => {
        this.erro.set(error.message);
        this.enviando.set(false);
      },
    });
  }
}
