import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { PasswordRule } from '../../shared/password-checklist';
import { FieldStatus } from '../../shared/text-field';

/**
 * Regras da jornada de entrada. As de senha espelham o RegisterRequest da API (8+
 * caracteres, uma letra, um numero): se divergirem, o formulario libera o botao e a API
 * recusa, que e a pior experiencia possivel.
 */
export const SENHA_MAXIMO = 72;
export const NOME_MAXIMO = 150;
export const EMAIL_MAXIMO = 180;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function nomeValido(valor: string): boolean {
  return valor.trim().length >= 2;
}

export function emailValido(valor: string): boolean {
  return EMAIL.test(valor.trim());
}

export function regrasDaSenha(valor: string): PasswordRule[] {
  return [
    { label: '8+ caracteres', met: valor.length >= 8 },
    { label: '1 letra', met: /\p{L}/u.test(valor) },
    { label: '1 número', met: /\d/.test(valor) },
  ];
}

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? '';
}

/** Adapta um predicado para validator de formulario reativo. */
export function validador(chave: string, predicado: (valor: string) => boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null =>
    predicado(String(control.value ?? '')) ? null : { [chave]: true };
}

export const senhaValida = (valor: string): boolean =>
  regrasDaSenha(valor).every((regra) => regra.met);

/**
 * Valido assim que a regra passa; erro so depois que o estudante saiu do campo com algo
 * digitado. Assim ninguem leva bronca na primeira letra.
 */
export function statusDoCampo(control: AbstractControl): FieldStatus {
  if (control.valid) {
    return 'valid';
  }
  return control.touched && control.value ? 'error' : 'idle';
}
