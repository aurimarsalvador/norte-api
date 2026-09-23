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

  it('a apresentacao nao mostra a barra de abas', async () => {
    const fixture = TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('norte-bottom-nav')).toBeNull();
    expect(el.textContent).toContain('Você não precisa escolher sua carreira');
  });

  it('quem ja tem sessao pula a apresentacao e cai no Meu Caminho, com a aba acesa', async () => {
    localStorage.setItem('norte.token', 'token-de-teste');
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/meu-caminho');
    const ativa = (fixture.nativeElement as HTMLElement).querySelector(
      'norte-bottom-nav a[aria-current="page"]',
    );
    expect(ativa?.textContent).toContain('Meu Caminho');
  });

  it('o questionario esconde a barra de abas', async () => {
    localStorage.setItem('norte.token', 'token-de-teste');
    const fixture = TestBed.createComponent(App);

    await TestBed.inject(Router).navigateByUrl('/questionario');
    await fixture.whenStable();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('norte-bottom-nav')).toBeNull();
  });
});
