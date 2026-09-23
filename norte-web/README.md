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
shared/     kit (marca, barra do topo, adesivo, intro), icon, button, text-field,
            select-field, password-checklist, card, badge, trait-bar, progress-bar,
            option-card, sentiment-scale, checklist-item, icon-button, bottom-nav,
            sentimento, spinner, modal
features/   onboarding, assessment, profile, catalog, microexperience, my-path
```

## Design system

Os tokens (cores, tipografia, espaços, raios, sombras, movimento) vêm do Norte Design System
feito no Claude Design e vivem em `src/styles.scss`. Creme quente de fundo, verde-floresta
como única cor de ação, Young Serif nos títulos e Source Sans 3 no texto (Google Fonts,
carregadas no `index.html`). Os componentes de `shared/` são as versões Angular dos
componentes do design system (Button, TextField, Card, Badge, TraitBar, ProgressBar,
OptionCard, SentimentScale, ChecklistItem, IconButton, BottomNav, Icon).

As seis jornadas seguem o design: coluna única de até 440px, cada tela com a própria barra do
topo. Perfil, Carreiras e Meu Caminho mostram a barra de abas (rotas com `data.aba`); o
questionário e a micro-experiência a escondem e ancoram a ação principal no pé da tela
(`.tela-rodape`).

- **Entrada** (`features/onboarding`): apresentação, cadastro, entrar e boas-vindas. A
  validação do cadastro espelha o `RegisterRequest` da API: 8+ caracteres, uma letra e um
  número na senha, e ano escolar de 1 a 3.
- **Jornada** (`/questionario`): uma pergunta por tela, "Pergunta 7 de 20", cada escolha salva
  na hora. A última pergunta conclui e leva ao perfil.
- **Perfil** (`/perfil`): barras de afinidade (as três primeiras em verde-escuro) e a nota
  "Esse perfil não é um rótulo".
- **Carreiras** (`/profissoes`): agrupadas por área e ordenadas pela compatibilidade, com
  favoritar e "sem interesse" direto no cartão. O detalhe explica literalmente por que a
  profissão apareceu.
- **Micro-experiência** (`/microexperiencias/:id`): o desafio, como foi, e o agradecimento. O
  design pergunta só o sentimento; a API também exige uma nota de dificuldade, então a
  segunda pergunta vive na mesma tela, com o mesmo componente. `shared/sentimento` traduz
  sentimentos em notas de 1 a 5 e de volta.
- **Meu Caminho** (`/meu-caminho`): afinidades, próximos passos, sugestões, favoritas,
  micro-experiências e sem interesse (com "Reconsiderar"). Os passos que a API confere
  sozinha vêm travados; os outros (conversar, pesquisar cursos, assistir a um vídeo) ficam
  guardados só no navegador, por estudante.

Ainda sem arte: a marca é o nome em texto ("norte" em Young Serif), e os blocos coloridos
das telas de apresentação, boas-vindas e micro-experiência feita guardam o lugar das
ilustrações.

Componentes são standalone, com template e estilo inline (um arquivo por componente),
`ChangeDetectionStrategy.OnPush` e signals para estado. As features são carregadas sob
demanda pelas rotas.

`TokenStorage` existe separado do `AuthService` de propósito: o interceptor precisa do token,
e o `AuthService` depende do `HttpClient`. Sem essa separação haveria um ciclo de injeção.

## Diretriz de tom

A interface apresenta **compatibilidade percentual com justificativa**, nunca um veredito.
Dois pontos concentram essa regra:

- `shared/badge` (`norte-score-badge`) rotula o número como "compatibilidade" de forma não
  parametrizável (por extenso, ou só para leitores de tela no modo compacto), para que
  nenhuma tela futura consiga transformá-lo em afirmação;
- `explicar()`, no detalhe da profissão, monta o "Por que apareceu pra você" só com as
  justificativas da API e mostra um convite a explorar quando ela devolve zero, em vez de
  improvisar uma.

Nenhuma tela diz "sua profissão é X". Ao revisar textos novos, mantenha esse critério.
