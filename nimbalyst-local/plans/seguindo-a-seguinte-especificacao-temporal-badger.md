# Plano de Implementação — Projeto Norte (MVP)

## Contexto

O Norte é uma plataforma de exploração profissional para estudantes do 3º ano do Ensino Médio. A proposta não é prescrever uma profissão, e sim conduzir uma jornada de autoconhecimento: o aluno responde a cenários situacionais, o sistema deriva um perfil de *traits*, e devolve **compatibilidades percentuais com justificativa explícita** — nunca uma afirmação determinística.

Hoje o repositório `norte-api` tem apenas o esqueleto: `Question`, `AnswerOption`, um `QuestionController` de leitura e 4 migrations Flyway. Falta praticamente todo o domínio (students, traits, profissões, assessments, microexperiências), o motor de recomendação, autenticação, tratamento de erros padronizado e o frontend Angular — que ainda **não existe no disco**.

Este plano quebra a especificação em fases executáveis e ordenadas por dependência, levando o projeto do estado atual ao MVP completo descrito na spec.

### Decisões tomadas antes de planejar

| Ponto | Decisão | Motivo |
|---|---|---|
| Escopo | Backend + frontend Angular | Plano completo até o MVP entregável |
| Autenticação | Spring Security + JWT stateless | `GET /students/me/my-path` exige identidade real no `SecurityContext` |
| Spring Boot | **Manter 4.1.1** (já no `pom.xml`) | A spec diz "3.x", mas o repo já usa os starters modulares do Boot 4; a spec está desatualizada nesse ponto |
| Lombok | **Não adotar** | O código existente (`Question`, `AnswerOption`) escreve construtores/getters à mão; manter consistência vale mais que a economia de linhas |
| Testes de integração | **Testcontainers + Postgres 17** | A spec sugere H2, mas H2 não valida as migrations reais nem o dialeto Postgres. Exige Docker rodando |

---

## Estado atual (verificado)

**Repositório:** `C:\Users\Auri\Desktop\norte\aplicação\norte-api` — branch `master`, working tree limpo, 3 commits.

- Spring Boot **4.1.1**, Java 21, starters modulares (`spring-boot-starter-webmvc`, `-flyway`, `-data-jpa`, `-validation`).
- Pacote base `br.com.norte.norte_api`, organizado **por feature** (`question/`) — exceto `controller/HealthController`, que destoa.
- Estilo: entidades JPA com construtor protegido + construtor de negócio + getters explícitos; DTOs como `record`; injeção por construtor.
- Flyway em **V4**; seeds versionados junto ao schema (`V2`, `V4`), com `question_id = 1` hardcoded.
- Rotas em `/api/questions` — a spec exige o prefixo `/api/v1`.
- `application.properties` com credenciais hardcoded e sem profiles.
- Testes: só `contextLoads`, que sobe contra o Postgres local.
- `docker-compose.yml` tem apenas o serviço `postgres`.

### Dívidas do código atual a corrigir no caminho

1. [`QuestionController.findAll()`](C:\Users\Auri\Desktop\norte\aplicação\norte-api\src\main\java\br\com\norte\norte_api\question\QuestionController.java) retorna a **entidade JPA** direto na resposta HTTP — vaza o modelo e abre risco de lazy-loading na serialização. Deve devolver DTO.
2. A montagem manual de `AnswerOptionResponse` no controller deve virar um mapper/serviço; e o campo `description` do record espelha `text` da entidade — unificar o nome.
3. `HealthController` importa `@Controller` sem usar e vive em `controller/` em vez de seguir o package-by-feature.
4. Regras 1–5 dos pesos e a unicidade de `(assessment, question)` precisam existir **como CHECK/UNIQUE no banco**, não só em validação Java.

---

## Arquitetura alvo

Monólito modular, **package-by-feature**, sob `br.com.norte.norte_api`:

```
common/          ProblemDetail handler, exceções base, PathPrefix config, CORS
security/        SecurityFilterChain, JwtService, CurrentStudent resolver
student/         Student, cadastro, login
trait/           Trait (catálogo de características)
question/        Question, AnswerOption, OptionTraitWeight   (já parcialmente existe)
assessment/      Assessment, AssessmentAnswer
recommendation/  MOTOR: ProfileCalculator, CompatibilityCalculator, ExplanationBuilder
catalog/         CareerArea, Profession, ProfessionTrait
feedback/        ProfessionFeedback
microexperience/ MicroExperience, MicroExperienceResponse
mypath/          Agregador de leitura do painel "Meu Caminho"
```

**Regra de camadas, válida para todas as features:** `Controller` (só HTTP + validação) → `Service` (`@Transactional`, regra de negócio) → `Repository`. Controllers nunca expõem entidades; toda saída é `record` DTO. O pacote `recommendation` contém classes de domínio **puras** (sem Spring, sem JPA), para que o algoritmo seja testável sem subir contexto — é o requisito de "alta cobertura" da spec.

---

## Modelo de dados

Convenção nova: `traits`, `career_areas` e `professions` ganham uma coluna **`code` UNIQUE** (ex.: `RESOLUCAO_PROBLEMAS`, `TECNOLOGIA`). Sem isso, os seeds de 20–30 profissões × N traits viram um emaranhado de IDs numéricos frágeis — como já começou a acontecer no `V4` com `question_id = 1`.

| Tabela | Colunas-chave | Restrições importantes |
|---|---|---|
| `students` | `name`, `email`, `password_hash`, `school_year`, `created_at` | `UNIQUE(email)` |
| `traits` | `code`, `name`, `description` | `UNIQUE(code)` |
| `questions` | `text`, `display_order`, `active` | *(evolui a tabela existente)* |
| `answer_options` | já existe | — |
| `option_trait_weights` | `answer_option_id`, `trait_id`, `weight` | `CHECK weight BETWEEN 1 AND 5`, `UNIQUE(answer_option_id, trait_id)` |
| `assessments` | `student_id`, `status`, `started_at`, `completed_at` | status ∈ `IN_PROGRESS`/`COMPLETED` |
| `assessment_answers` | `assessment_id`, `question_id`, `answer_option_id` | `UNIQUE(assessment_id, question_id)` — re-responder atualiza |
| `career_areas` | `code`, `name`, `description` | `UNIQUE(code)` |
| `professions` | `career_area_id`, `code`, `name`, `summary`, `description`, `typical_activities`, `education_path` | `UNIQUE(code)` |
| `profession_traits` | `profession_id`, `trait_id`, `weight` | `CHECK 1..5`, `UNIQUE(profession_id, trait_id)` |
| `profession_feedbacks` | `student_id`, `profession_id`, `interest_level`, `updated_at` | `UNIQUE(student_id, profession_id)` — upsert |
| `micro_experiences` | `profession_id`, `title`, `instructions`, `estimated_minutes` | — |
| `micro_experience_responses` | `micro_experience_id`, `student_id`, `enjoyment_rating`, `difficulty_rating`, `notes` | `CHECK ratings 1..5` |

Migrations novas continuam a numeração a partir de **V5**. Schema e seed em arquivos separados (`V5__create_traits_table.sql`, `V6__seed_traits.sql`, …), seguindo o padrão que já existe.

---

## O motor de recomendação (núcleo do sistema)

Três classes puras em `recommendation/`, sem dependência de framework.

### `ProfileCalculator` — P(t)

```
S_raw(t) = Σ peso(opção_escolhida, t)
S_max(t) = Σ  max( peso(o, t) para cada opção o da questão q )   , para cada questão q respondida
P(t)     = min(100, S_raw(t) / S_max(t) * 100)
```

> **Ambiguidade da spec resolvida aqui.** A spec diz que `S_max(t)` é "a soma máxima teórica possível considerando as opções escolhidas/disponíveis" — as duas leituras dão resultados diferentes. Adoto **o máximo alcançável entre as opções disponíveis de cada questão respondida**: é a única leitura em que P(t) mede "o quanto o aluno pontuou desse trait em relação ao quanto ele poderia ter pontuado". Se `S_max(t) == 0`, o trait é omitido do perfil (não vira 0%, vira ausente — evita divisão por zero e ruído no gráfico).

### `CompatibilityCalculator` — C(k)

```
C(k) = Σ(t ∈ T_k) [ P(t) × W_k(t) ]  /  Σ(t ∈ T_k) [ W_k(t) × 100 ]  × 100
```

> **Segunda decisão explícita:** traits exigidos pela profissão que o aluno **não pontuou** entram com `P(t) = 0` mas **permanecem no denominador**. É o que a fórmula da spec descreve literalmente, e é o comportamento correto: não pontuar um trait exigido *deve* derrubar a compatibilidade.

### `ExplanationBuilder` — justificativa

Ordena os traits por **contribuição** `P(t) × W_k(t)` decrescente, filtra `P(t) >= 60`, devolve os **top 3**. Se nenhum trait passa do corte, devolve lista vazia e a UI mostra um texto exploratório neutro — **nunca** inventa justificativa.

**Aritmética:** `BigDecimal` com `scale(2, HALF_UP)` nos percentuais expostos, para os testes serem exatos e reprodutíveis (com `double` os asserts viram comparação por epsilon).

---

## Fases e tarefas

Cada fase é um commit coerente. A ordem respeita dependências reais — traits antes dos pesos, pesos antes do motor, auth antes de assessment.

### Fase 0 — Fundações transversais

1. **`pom.xml`**: adicionar `spring-boot-starter-security`, `spring-security-oauth2-jose` (JwtEncoder/Decoder Nimbus) e, em `test`, `spring-boot-testcontainers` + `org.testcontainers:postgresql`. ⚠️ O Boot 4 reorganizou os starters — confirmar os *artifactIds* exatos contra o BOM 4.1.1 na hora de implementar, não assumir os nomes do Boot 3.
2. **Prefixo `/api/v1`** de forma centralizada: `WebMvcConfigurer.configurePathMatch` com `addPathPrefix("/api/v1", HandlerTypePredicate.forAnnotation(RestController.class))`. Remover o `/api` hardcoded de `QuestionController` e `HealthController` — assim nenhum controller futuro esquece o prefixo.
3. **RFC 7807**: `GlobalExceptionHandler extends ResponseEntityExceptionHandler` em `common/`, devolvendo `ProblemDetail` com a propriedade extra `timestamp`. Cobrir `ResourceNotFoundException` (404), `BusinessRuleException` (422), `ConflictException` (409), sobrescrever `handleMethodArgumentNotValid` para listar erros de campo, e tratar falhas de auth (401/403). Ligar `spring.mvc.problemdetails.enabled=true`.
4. **Configuração por ambiente**: `application.properties` com `${DB_URL:...}`/`${DB_USER:...}`/`${DB_PASSWORD:...}`/`${JWT_SECRET}`; criar `application-test.properties`. Tirar credencial literal do arquivo versionado.
5. **CORS** liberando a origem do `norte-web` (configurável por property).
6. **`AbstractIntegrationTest`** com `@ServiceConnection` sobre `PostgreSQLContainer("postgres:17")` — container único reaproveitado por toda a suíte. Migrar `NorteApiApplicationTests` para ele.

### Fase 1 — Traits e catálogo de profissões

7. Migrations V5+ para `traits`, `career_areas`, `professions`, `profession_traits`.
8. Entidades + repositories em `trait/` e `catalog/`.
9. **Seed de conteúdo** (a maior tarefa não-técnica do MVP): 6 áreas profissionais, 20–30 profissões com descrição real, e a matriz `profession_traits` com pesos 1–5. A qualidade do produto inteiro depende desses pesos. Sugestão: montar primeiro em planilha, revisar, depois gerar o SQL.

### Fase 2 — Questionário mapeado a traits

10. Evoluir `questions` com `display_order` + `active`; backfill das linhas existentes.
11. Criar `option_trait_weights` (+ entidade `OptionTraitWeight`).
12. Seed do questionário situacional completo, com os pesos de cada opção. Trocar o `question_id = 1` hardcoded do `V4` por lookup via `code`/texto.
13. **`GET /api/v1/questions`** — refatorar para `QuestionService` + `QuestionResponse` aninhando as opções em **uma query** (`JOIN FETCH` ou `@EntityGraph`), filtrando `active = true` e ordenando por `display_order`. Elimina a dívida nº 1 e o N+1 latente.

### Fase 3 — Estudantes e autenticação JWT

14. Migration + entidade `Student`; `password_hash` via `BCryptPasswordEncoder`, **nunca** exposto em DTO.
15. `SecurityConfig`: `SecurityFilterChain` stateless, `POST /auth/**` e `GET /questions` públicos, resto autenticado.
16. `JwtService` com `NimbusJwtEncoder`/`NimbusJwtDecoder` (segredo HMAC via env). Alternativa se o `oauth2-jose` atritar com o Boot 4: `jjwt` + `OncePerRequestFilter` próprio.
17. `POST /auth/register` e `POST /auth/login`; `@AuthenticationPrincipal`/resolver para obter o estudante logado nas rotas `/me`.
18. Validação LGPD: coletar só nome, e-mail, senha e ano escolar. Nada clínico ou sensível.

### Fase 4 — Assessments

19. Migrations + entidades `Assessment` e `AssessmentAnswer`.
20. **`POST /assessments`** — cria `IN_PROGRESS` para o estudante autenticado. Regra: reaproveitar assessment em aberto em vez de acumular duplicatas.
21. **`POST /assessments/{id}/answers`** — upsert por `(assessment, question)`, permitindo o aluno voltar e trocar a resposta. Valida que a opção pertence à questão e que o assessment é do estudante logado (senão 403).
22. **`POST /assessments/{id}/complete`** — exige mínimo de questões respondidas, grava `completed_at`, bloqueia novas respostas.

### Fase 5 — Motor de recomendação ⭐

23. `ProfileCalculator`, `CompatibilityCalculator`, `ExplanationBuilder` como classes puras, conforme a seção acima.
24. **`GET /assessments/{id}/profile`** → lista de traits com `code`, `name`, `percentage`, ordenada desc.
25. **`GET /assessments/{id}/recommendations`** → profissões com `compatibility` + `reasons[]`, ordenada desc, paginada/limitada. Carregar `profession_traits` em lote (uma query), **nunca** em loop por profissão.
26. **Bateria de testes unitários** — o item de maior valor do plano:
    - aluno sem respostas; `S_max(t) = 0`; P(t) estourando 100 (deve capar);
    - profissão com trait exigido que o aluno não pontuou (deve puxar C(k) para baixo);
    - `T_k` vazio (não pode dividir por zero);
    - todos os pesos no máximo → C(k) = 100;
    - justificativa com 0, 1 e >3 traits acima de 60; empate na contribuição;
    - teste de integração ponta a ponta: responder → completar → conferir perfil e recomendações.

### Fase 6 — Detalhe de profissão e feedback

27. **`GET /professions/{id}`** — perfil completo com área, traits exigidos e microexperiência associada.
28. **`POST /professions/{id}/feedback`** — upsert de `FAVORITE` / `NOT_INTERESTED` / `NEUTRAL` para o estudante logado.
29. Endpoint de listagem do catálogo com filtro por área (a tela "Explorador" precisa dele, e a spec só cita o detalhe).

### Fase 7 — Microexperiências

30. Migrations + entidades; seed de microexperiências para as profissões cadastradas.
31. **`GET /professions/{id}/micro-experience`** e **`POST /micro-experiences/{id}/respond`** (notas 1–5 + texto livre).

### Fase 8 — Painel "Meu Caminho"

32. **`GET /students/me/my-path`** — agregador de leitura (`@Transactional(readOnly = true)`): top traits, favoritos, descartados, microexperiências feitas e próximos passos sugeridos (ex.: profissões de alta compatibilidade ainda sem feedback). Serviço de leitura próprio em `mypath/`, sem duplicar regra dos outros módulos.

### Fase 9 — Frontend: scaffold e camada core

33. `ng new norte-web` (Angular 17+, standalone components, SCSS, routing) em `aplicação/norte-web`.
34. `core/`: `ApiService` sobre `HttpClient` com `environment.apiUrl`; `AuthService` (token em storage + signal de sessão); `jwtInterceptor`; `errorInterceptor` traduzindo `ProblemDetail` para mensagem amigável; `authGuard`.
35. `shared/`: botão, card, modal, `trait-bar`, `compatibility-gauge`, spinner, empty-state.
36. Models TypeScript espelhando os DTOs do backend, em um único `core/models/`.

### Fase 10 — Frontend: features

37. `features/auth` — cadastro e login.
38. `features/assessment` — jornada uma pergunta por vez, barra de progresso, **autosave a cada resposta**, permitir voltar, botão de concluir.
39. `features/profile` — barras de traits ordenadas.
40. `features/catalog` — explorador com compatibilidade e filtro por área + página de detalhe com justificativa e CTA para a microexperiência.
41. `features/microexperience` — enunciado + formulário de avaliação.
42. `features/my-path` — painel consolidado.
43. **Guarda de tom em toda a UI:** compatibilidade sempre como percentual + justificativa. Nenhum texto do tipo "sua profissão é X". Revisar os textos de todas as telas contra essa diretriz antes de fechar a fase.

### Fase 11 — Empacotamento e fechamento

44. `Dockerfile` multi-stage da API; `Dockerfile` do `norte-web` (build Angular → nginx).
45. `docker-compose.yml` com os três serviços (`postgres`, `norte-api`, `norte-web`) + healthchecks e variáveis de ambiente.
46. `README` com setup, variáveis e como rodar; documentar o significado dos traits e dos pesos para quem for manter os seeds.
47. Conferência dos NFRs: índices nas FKs mais consultadas, medição do p95 dos endpoints de recomendação, revisão de que nenhum log imprime senha ou token.

---

## Arquivos críticos

**Modificados:**
- [pom.xml](C:\Users\Auri\Desktop\norte\aplicação\norte-api\pom.xml) — security, oauth2-jose, testcontainers
- [application.properties](C:\Users\Auri\Desktop\norte\aplicação\norte-api\src\main\resources\application.properties) — env vars, profiles, problemdetails
- [QuestionController.java](C:\Users\Auri\Desktop\norte\aplicação\norte-api\src\main\java\br\com\norte\norte_api\question\QuestionController.java) — DTO no lugar da entidade, extrair service
- [V4__insert_initial_answer_options.sql](C:\Users\Auri\Desktop\norte\aplicação\norte-api\src\main\resources\db\migration\V4__insert_initial_answer_options.sql) — referência por `code` no lugar do id fixo
- [docker-compose.yml](C:\Users\Auri\Desktop\norte\aplicação\norte-api\docker-compose.yml) — três serviços

**Novos, de maior peso:**
- `recommendation/ProfileCalculator.java`, `CompatibilityCalculator.java`, `ExplanationBuilder.java` — o núcleo
- `common/GlobalExceptionHandler.java`, `common/ApiPathConfig.java`
- `security/SecurityConfig.java`, `security/JwtService.java`
- `db/migration/V5+` — schema e seeds
- `aplicação/norte-web/` — projeto Angular inteiro

**Reaproveitar o que já existe:** `Question`, `AnswerOption`, `QuestionRepository`, `AnswerOptionRepository` e o padrão `findByQuestionIdOrderByDisplayOrderAsc` continuam válidos — as fases 2 e 5 estendem, não reescrevem.

---

## Verificação

**Por fase (loop curto):**
```bash
docker compose up -d postgres
./mvnw test                      # Testcontainers sobe o Postgres 17 da suíte
./mvnw spring-boot:run
```

**Motor de recomendação** — o critério de aceite mais importante. Rodar a suíte de `recommendation/` isolada e conferir cobertura:
```bash
./mvnw test -Dtest='*Calculator*Test,*ExplanationBuilder*Test'
```

**Fluxo ponta a ponta pela API**, depois da Fase 8:
```bash
curl -X POST localhost:8080/api/v1/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"ana@teste.com","password":"senha123","schoolYear":3}'
# guardar o token do login
curl localhost:8080/api/v1/questions
curl -X POST localhost:8080/api/v1/assessments -H "Authorization: Bearer $TOKEN"
curl -X POST localhost:8080/api/v1/assessments/1/answers -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"questionId":1,"answerOptionId":2}'
curl -X POST localhost:8080/api/v1/assessments/1/complete -H "Authorization: Bearer $TOKEN"
curl localhost:8080/api/v1/assessments/1/profile         -H "Authorization: Bearer $TOKEN"
curl localhost:8080/api/v1/assessments/1/recommendations -H "Authorization: Bearer $TOKEN"
curl localhost:8080/api/v1/students/me/my-path           -H "Authorization: Bearer $TOKEN"
```
Conferir à mão que os percentuais batem com o cálculo da spec para um conjunto pequeno de respostas — o teste que mais pega erro de fórmula.

**Erros (RFC 7807):** pedir um id inexistente e um DTO inválido; a resposta deve trazer `status`, `title`, `detail` e `timestamp`.

**Frontend:** `ng serve` em `norte-web`, percorrer cadastro → jornada → perfil → catálogo → microexperiência → Meu Caminho. Verificar que o interceptor renova/anexa o token e que erros da API viram mensagem legível.

**Fechamento:** `docker compose up --build` e repetir o fluxo pela UI nos três containers.

---

## Riscos e pontos de atenção

- **Nomes de artefatos do Boot 4.1.1**: os starters foram modularizados; validar cada dependência nova contra o BOM antes de assumir o nome usado no Boot 3.
- **Qualidade dos seeds**: 20–30 profissões × pesos de traits é trabalho de conteúdo, não de código, e determina se as recomendações fazem sentido. É o maior risco do MVP e não deve ser deixado para o fim.
- **Testcontainers exige Docker ativo** na máquina de desenvolvimento e no CI.
- **As duas ambiguidades da spec** (definição de `S_max` e tratamento de trait não pontuado em `T_k`) foram resolvidas de forma explícita neste plano. Se a interpretação não for a pretendida, corrigir **antes** da Fase 5 — depois dela os pesos dos seeds já terão sido calibrados em cima do comportamento errado.
