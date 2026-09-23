import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('monta a casca da aplicacao', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sem sessao, oferece entrar e criar conta em vez da navegacao interna', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Entrar');
    expect(texto).toContain('Criar conta');
    expect(texto).not.toContain('Meu Caminho');
  });

  it('mantem o lembrete de que a escolha e do estudante', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('A escolha continua sendo sua.');
  });
});
