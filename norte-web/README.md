# Norte — Web

Frontend Angular do Norte. A API vive no diretório acima, na raiz do repositório.

## Rodando

```bash
npm install
npm start          # http://localhost:4200, aponta para a API em localhost:8080
npm run build
npm test
```

Em produção o app é servido por nginx, que faz proxy de `/api` para a API — por isso
`environment.ts` usa a URL relativa `/api/v1` e `environment.development.ts` usa
`http://localhost:8080/api/v1`.

## Organização

```
core/       ApiService, AuthService, TokenStorage, interceptors, authGuard, models
shared/     icon, button, text-field, select-field, password-checklist, spinner,
            empty-state, card, modal, trait-bar, compatibility-gauge, reason-list
features/   onboarding, assessment, profile, catalog, microexperience, my-path
```

## Design system

Os tokens (cores, tipografia, espaços, raios, sombras, movimento) vêm do Norte Design System
feito no Claude Design e vivem em `src/styles.scss`. Creme quente de fundo, verde-floresta
como única cor de ação, Young Serif nos títulos e Source Sans 3 no texto (Google Fonts,
carregadas no `index.html`). Os nomes antigos (`--cor-*`, `--raio`, `--espaco`) continuam
existindo como apelidos dos tokens novos, então as telas das jornadas 2 a 6 herdam a paleta
sem precisar ser reescritas.

A jornada 1 (`features/onboarding`) segue o design à risca: apresentação (`/`), cadastro
(`/cadastrar`), entrar (`/entrar`) e boas-vindas (`/boas-vindas`). Essas rotas têm
`data: { casca: false }` e desenham a própria barra, sem o cabeçalho do app. A validação do
cadastro acontece enquanto o estudante digita e espelha o `RegisterRequest` da API: 8+
caracteres, uma letra e um número na senha, e ano escolar de 1 a 3.

Ainda sem arte: a marca é o nome em texto ("norte" em Young Serif), e os blocos coloridos
das telas de apresentação e boas-vindas guardam o lugar das ilustrações.

Componentes são standalone, com template e estilo inline (um arquivo por componente),
`ChangeDetectionStrategy.OnPush` e signals para estado. As features são carregadas sob
demanda pelas rotas.

`TokenStorage` existe separado do `AuthService` de propósito: o interceptor precisa do token,
e o `AuthService` depende do `HttpClient`. Sem essa separação haveria um ciclo de injeção.

## Diretriz de tom

A interface apresenta **compatibilidade percentual com justificativa**, nunca um veredito.
Dois pontos concentram essa regra:

- `shared/compatibility-gauge` rotula o número como "compatibilidade" de forma não
  parametrizável, para que nenhuma tela futura consiga transformá-lo em afirmação;
- `shared/reason-list` mostra um convite a explorar quando a API devolve zero justificativas,
  em vez de improvisar uma.

Nenhuma tela diz "sua profissão é X". Ao revisar textos novos, mantenha esse critério.
