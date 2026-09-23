import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <a class="pular" href="#principal">Pular para o conteudo</a>

    <header class="barra">
      <div class="barra-conteudo">
        <a class="marca" routerLink="/">
          Norte
          <span class="texto-suave lema">explorar antes de escolher</span>
        </a>

        @if (auth.isLoggedIn()) {
          <nav>
            <a routerLink="/questionario" routerLinkActive="ativo">Questionario</a>
            <a routerLink="/perfil" routerLinkActive="ativo">Meu perfil</a>
            <a routerLink="/profissoes" routerLinkActive="ativo">Profissoes</a>
            <a routerLink="/meu-caminho" routerLinkActive="ativo">Meu Caminho</a>
          </nav>

          <div class="sessao">
            <span class="texto-suave">{{ auth.student()?.name }}</span>
            <button class="botao botao--discreto" type="button" (click)="auth.logout()">Sair</button>
          </div>
        } @else {
          <nav>
            <a routerLink="/entrar" routerLinkActive="ativo">Entrar</a>
            <a routerLink="/cadastrar" routerLinkActive="ativo">Criar conta</a>
          </nav>
        }
      </div>
    </header>

    <main id="principal">
      <router-outlet />
    </main>

    <footer class="rodape">
      <div class="barra-conteudo texto-suave">
        O Norte apresenta compatibilidades e justificativas para apoiar a sua exploracao.
        A escolha continua sendo sua.
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .pular {
      background: var(--cor-primaria);
      color: #1b1200;
      left: -999px;
      padding: var(--espaco);
      position: absolute;
      top: 0;
      z-index: 100;
    }

    .pular:focus {
      left: 0;
    }

    .barra {
      background: var(--cor-superficie);
      border-bottom: 1px solid var(--cor-borda);
    }

    .barra-conteudo {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--espaco) * 2);
      margin: 0 auto;
      max-width: var(--largura-conteudo);
      padding: calc(var(--espaco) * 1.5) calc(var(--espaco) * 3);
    }

    .marca {
      color: var(--cor-primaria);
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-decoration: none;
    }

    .lema {
      display: block;
      font-size: 0.72rem;
      font-weight: 400;
      letter-spacing: 0;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--espaco) * 2);
      margin-left: auto;
    }

    nav a {
      color: var(--cor-texto-suave);
      text-decoration: none;
    }

    nav a:hover,
    nav a.ativo {
      color: var(--cor-texto);
    }

    nav a.ativo {
      box-shadow: inset 0 -2px 0 var(--cor-primaria);
    }

    .sessao {
      align-items: center;
      display: flex;
      gap: var(--espaco);
    }

    main {
      flex: 1;
    }

    .rodape {
      border-top: 1px solid var(--cor-borda);
      font-size: 0.85rem;
      margin-top: calc(var(--espaco) * 6);
    }
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
}
