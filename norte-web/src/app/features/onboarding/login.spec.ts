import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';

import { Login } from './login';

const RESPOSTA = {
  token: 't',
  tokenType: 'Bearer',
  expiresAt: '2026-09-23T12:00:00Z',
  student: { id: 1, name: 'Ana Clara', email: 'ana@teste.com', schoolYear: 3 },
};

describe('Login', () => {
  async function entrar(redirect: string | null) {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(redirect ? { redirect } : {}) },
          },
        },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    for (const [id, valor] of [
      ['input[type="email"]', 'ana@teste.com'],
      ['input[type="password"]', 'qualquer'],
    ]) {
      const input = el.querySelector(id) as HTMLInputElement;
      input.value = valor;
      input.dispatchEvent(new Event('input'));
    }
    await fixture.whenStable();

    (el.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    TestBed.inject(HttpTestingController)
      .expectOne((r) => r.url.endsWith('/auth/login'))
      .flush(RESPOSTA);

    return { navigate, navigateByUrl };
  }

  beforeEach(() => localStorage.clear());

  it('sem destino guardado, da as boas-vindas de retorno', async () => {
    const { navigate, navigateByUrl } = await entrar(null);

    expect(navigate).toHaveBeenCalledWith(['/boas-vindas'], { state: { retorno: true } });
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('barrado pelo guard, volta para onde queria ir', async () => {
    const { navigate, navigateByUrl } = await entrar('/profissoes/3');

    expect(navigateByUrl).toHaveBeenCalledWith('/profissoes/3');
    expect(navigate).not.toHaveBeenCalled();
  });
});
