import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { Button } from '../../shared/button';
import { PasswordChecklist } from '../../shared/password-checklist';
import { SelectField, SelectOption } from '../../shared/select-field';
import { TextField } from '../../shared/text-field';
import { AltRow, FormHeader, TopBar, Wordmark } from '../../shared/kit';
import {
  EMAIL_MAXIMO,
  NOME_MAXIMO,
  SENHA_MAXIMO,
  emailValido,
  nomeValido,
  primeiroNome,
  regrasDaSenha,
  senhaValida,
  statusDoCampo,
  validador,
} from './validacao';

/** A API aceita de 1 a 3 (CHECK em students.school_year). */
export const ANOS_ESCOLARES: SelectOption[] = [
  { value: '1', label: '1º ano do Ensino Médio' },
  { value: '2', label: '2º ano do Ensino Médio' },
  { value: '3', label: '3º ano do Ensino Médio' },
];

/**
 * Cadastro com o minimo que a LGPD e a jornada pedem: nome, e-mail, senha e ano escolar.
 * Cada campo se valida enquanto o estudante digita, e o botao so libera quando tudo passa.
 */
@Component({
  selector: 'norte-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    AltRow,
    Button,
    FormHeader,
    PasswordChecklist,
    SelectField,
    TextField,
    TopBar,
    Wordmark,
  ],
  template: `
    <div class="tela">
      <norte-top-bar voltarPara="/">
        <norte-wordmark [size]="22" />
      </norte-top-bar>

      <form class="tela-corpo" [formGroup]="form" (ngSubmit)="submit()">
        <norte-form-header
          titulo="Vamos nos conhecer"
          subtitulo="Só o essencial. Leva menos de um minuto."
        />

        <div class="campos">
          <norte-text-field
            formControlName="name"
            label="Nome"
            placeholder="Como podemos te chamar?"
            autocomplete="given-name"
            [maxlength]="nomeMaximo"
            [status]="status('name')"
            [message]="
              status('name') === 'valid'
                ? 'Prazer, ' + primeiroNome() + '!'
                : 'Conta pra gente como você gosta de ser chamado.'
            "
          />

          <norte-text-field
            formControlName="email"
            label="E-mail"
            type="email"
            placeholder="voce@email.com"
            autocomplete="email"
            [maxlength]="emailMaximo"
            [status]="status('email')"
            message="Hmm, esse e-mail parece incompleto."
          />

          <div class="senha">
            <norte-text-field
              formControlName="password"
              label="Senha"
              type="password"
              placeholder="Crie uma senha"
              autocomplete="new-password"
              [maxlength]="senhaMaximo"
              [status]="form.controls.password.valid ? 'valid' : 'idle'"
            />
            <norte-password-checklist [rules]="regras()" />
          </div>

          <norte-select-field
            formControlName="schoolYear"
            label="Em que ano você está?"
            placeholder="Selecione seu ano escolar"
            hint="Ajuda a sugerir experiências que façam sentido pra você."
            [options]="anos"
            [status]="form.controls.schoolYear.valid ? 'valid' : 'idle'"
          />
        </div>

        <div class="tela-espaco"></div>

        @if (erro()) {
          <p class="aviso aviso--erro" role="alert">{{ erro() }}</p>
        }

        <div class="tela-acoes">
          <norte-button
            label="Criar conta"
            type="submit"
            size="lg"
            [fullWidth]="true"
            [disabled]="form.invalid"
            [loading]="enviando()"
          />
          <norte-alt-row pergunta="Já tem uma conta?" acao="Entrar" link="/entrar" />
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

    .senha {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .aviso {
      margin: 0;
    }
  `,
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly anos = ANOS_ESCOLARES;
  protected readonly nomeMaximo = NOME_MAXIMO;
  protected readonly emailMaximo = EMAIL_MAXIMO;
  protected readonly senhaMaximo = SENHA_MAXIMO;

  protected readonly enviando = signal(false);
  protected readonly erro = signal('');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [validador('nome', nomeValido)]],
    email: ['', [validador('email', emailValido)]],
    password: ['', [validador('senha', senhaValida), Validators.maxLength(SENHA_MAXIMO)]],
    schoolYear: ['', Validators.required],
  });

  protected status(campo: 'name' | 'email') {
    return statusDoCampo(this.form.controls[campo]);
  }

  protected primeiroNome(): string {
    return primeiroNome(this.form.controls.name.value);
  }

  protected regras() {
    return regrasDaSenha(this.form.controls.password.value);
  }

  protected submit(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.erro.set('');

    const valores = this.form.getRawValue();

    this.auth
      .register({
        name: valores.name.trim(),
        email: valores.email.trim(),
        password: valores.password,
        schoolYear: Number(valores.schoolYear),
      })
      .subscribe({
        next: () => void this.router.navigate(['/boas-vindas']),
        error: (error: Error) => {
          this.erro.set(error.message);
          this.enviando.set(false);
        },
      });
  }
}
