import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { errorInterceptor } from '../../core/interceptors';
import { Register } from './register';

describe('Register', () => {
  let http: HttpTestingController;

  type Fixture = Awaited<ReturnType<typeof criar>>['fixture'];

  async function criar() {
    const fixture = TestBed.createComponent(Register);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  async function digitar(fixture: Fixture, rotulo: string, valor: string) {
    const input = campo(fixture.nativeElement, rotulo) as HTMLInputElement;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  function campo(el: HTMLElement, rotulo: string): HTMLInputElement | HTMLSelectElement {
    const label = [...el.querySelectorAll('label')].find((l) => l.textContent?.trim() === rotulo);
    return el.querySelector(`#${label!.htmlFor}`)!;
  }

  function botao(el: HTMLElement): HTMLButtonElement {
    return el.querySelector('button[type="submit"]')!;
  }

  async function preencherTudo(fixture: Fixture) {
    await digitar(fixture, 'Nome', 'Ana Clara');
    await digitar(fixture, 'E-mail', 'ana@teste.com');
    await digitar(fixture, 'Senha', 'senha12345');
    const ano = campo(fixture.nativeElement, 'Em que ano você está?') as HTMLSelectElement;
    ano.value = '2';
    ano.dispatchEvent(new Event('change'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('so libera o botao quando todos os campos passam', async () => {
    const { fixture, el } = await criar();
    expect(botao(el).disabled).toBe(true);

    await digitar(fixture, 'Nome', 'Ana Clara');
    await digitar(fixture, 'E-mail', 'ana@teste.com');
    await digitar(fixture, 'Senha', '12345678');

    // Senha sem letra: o checklist mostra o que falta e o botao continua travado.
    expect(el.textContent).toContain('1 letra');
    expect(el.querySelectorAll('li.ok').length).toBe(2);
    expect(botao(el).disabled).toBe(true);

    await preencherTudo(fixture);
    expect(botao(el).disabled).toBe(false);
    expect(el.textContent).toContain('Prazer, Ana!');
  });

  it('acusa e-mail incompleto so depois de sair do campo', async () => {
    const { fixture, el } = await criar();
    await digitar(fixture, 'E-mail', 'ana@teste');

    expect(el.textContent).toContain('Hmm, esse e-mail parece incompleto.');
  });

  it('envia o ano escolar como numero e segue para as boas-vindas', async () => {
    const { fixture, el } = await criar();
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    await preencherTudo(fixture);
    botao(el).click();

    const req = http.expectOne((r) => r.url.endsWith('/auth/register'));
    expect(req.request.body).toEqual({
      name: 'Ana Clara',
      email: 'ana@teste.com',
      password: 'senha12345',
      schoolYear: 2,
    });
    req.flush({
      token: 't',
      tokenType: 'Bearer',
      expiresAt: '2026-09-23T12:00:00Z',
      student: { id: 1, name: 'Ana Clara', email: 'ana@teste.com', schoolYear: 2 },
    });

    expect(navegar).toHaveBeenCalledWith(['/boas-vindas']);
  });

  it('mostra a mensagem da API quando o e-mail ja existe', async () => {
    const { fixture, el } = await criar();

    await preencherTudo(fixture);
    botao(el).click();

    http
      .expectOne((r) => r.url.endsWith('/auth/register'))
      .flush(
        { status: 409, detail: 'Ja existe uma conta cadastrada com este e-mail.' },
        { status: 409, statusText: 'Conflict' },
      );
    await fixture.whenStable();

    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Ja existe uma conta');
    expect(botao(el).disabled).toBe(false);
  });
});
