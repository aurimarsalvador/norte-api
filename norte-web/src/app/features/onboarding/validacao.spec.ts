import { FormControl } from '@angular/forms';

import {
  emailValido,
  nomeValido,
  primeiroNome,
  regrasDaSenha,
  senhaValida,
  statusDoCampo,
  validador,
} from './validacao';

describe('validacao da jornada de entrada', () => {
  it('senha segue a mesma regra da API: 8+ caracteres, uma letra e um numero', () => {
    expect(senhaValida('senha12345')).toBe(true);
    expect(senhaValida('ação2026')).toBe(true);
    expect(senhaValida('12345678')).toBe(false);
    expect(senhaValida('somenteletras')).toBe(false);
    expect(senhaValida('abc1')).toBe(false);
  });

  it('marca cada regra do checklist separadamente', () => {
    expect(regrasDaSenha('abc').map((regra) => regra.met)).toEqual([false, true, false]);
    expect(regrasDaSenha('abcdefg1').map((regra) => regra.met)).toEqual([true, true, true]);
  });

  it('nome precisa de ao menos duas letras reais', () => {
    expect(nomeValido('  A ')).toBe(false);
    expect(nomeValido('Ana')).toBe(true);
    expect(primeiroNome('  Ana Clara Souza ')).toBe('Ana');
  });

  it('e-mail precisa de dominio com extensao', () => {
    expect(emailValido('ana@teste')).toBe(false);
    expect(emailValido('ana@teste.com')).toBe(true);
    expect(emailValido(' ana@teste.com.br ')).toBe(true);
  });

  it('so acusa erro depois que o estudante saiu do campo com algo digitado', () => {
    const control = new FormControl('an', { validators: validador('email', emailValido) });
    expect(statusDoCampo(control)).toBe('idle');

    control.markAsTouched();
    expect(statusDoCampo(control)).toBe('error');

    control.setValue('ana@teste.com');
    expect(statusDoCampo(control)).toBe('valid');

    control.setValue('');
    expect(statusDoCampo(control)).toBe('idle');
  });
});
