import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

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

  it('a apresentacao desenha a propria barra, sem o cabecalho do app', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('header.barra')).toBeNull();
    expect(el.textContent).toContain('Você não precisa escolher sua carreira');
  });

  it('quem ja tem sessao pula a apresentacao e cai no Meu Caminho', async () => {
    localStorage.setItem('norte.token', 'token-de-teste');
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    await fixture.whenStable();

    expect(router.url).toBe('/meu-caminho');
    expect((fixture.nativeElement as HTMLElement).querySelector('header.barra')).not.toBeNull();
  });
});
