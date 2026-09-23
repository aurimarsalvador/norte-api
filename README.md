# Norte

Plataforma de exploração profissional para estudantes do Ensino Médio.

O Norte **não prescreve uma profissão**. O estudante responde a cenários situacionais, o
sistema deriva um perfil de características (*traits*) e devolve **compatibilidades
percentuais com justificativa explícita**. Quando não há justificativa suficiente, o produto
prefere não explicar a explicar mal.

Este repositório contém as duas pontas da aplicação: a API Spring Boot na raiz e o
frontend Angular em [`norte-web/`](norte-web/README.md). Ficam juntos para que um clone
único baste para subir o sistema inteiro com `docker compose up --build`.

---

## Stack

| Peça | Versão | Observação |
|---|---|---|
| Java | 21 | |
| Spring Boot | 4.1.1 | starters modulares; Jackson 3 (`tools.jackson`) |
| Spring Security | 7.1.1 | JWT HMAC via `spring-security-oauth2-jose` |
| PostgreSQL | 17 | |
| Flyway | V1–V21 | schema e seeds versionados |
| Testcontainers | 2.0.5 | artefato `testcontainers-postgresql` |
| Angular (web) | 22 | standalone, signals, zoneless |

---

## Rodando

### Tudo em containers

```bash
docker compose up --build
```

- API: <http://localhost:8080/api/v1/health>
- Web: <http://localhost:4200>

### Desenvolvimento

```bash
docker compose up -d postgres
./mvnw spring-boot:run

cd norte-web && npm install && npm start
```

### Testes

```bash
./mvnw test                                   # precisa de Docker ativo (Testcontainers)
./mvnw test -Dtest='*Calculator*Test,*ExplanationBuilder*Test'   # só o motor, sem Docker
cd norte-web && npm test
```

---

## Variáveis de ambiente

| Variável | Default | Obrigatória em produção |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/norte` | |
| `DB_USER` | `norte` | |
| `DB_PASSWORD` | `norte` | sim |
| `JWT_SECRET` | segredo de desenvolvimento | **sim** |
| `JWT_EXPIRATION` | `PT12H` | |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:4200` | sim |
| `ASSESSMENT_MIN_ANSWERS` | `8` | |

> `JWT_SECRET` tem um default apenas para o `docker compose up` funcionar sem setup prévio.
> Ele é um valor público, versionado neste repositório. **Defina o seu em qualquer ambiente
> que não seja a sua máquina.** O HS256 exige no mínimo 32 caracteres, e a aplicação recusa
> subir com um segredo menor.

---

## Endpoints

Todos sob `/api/v1`. Públicos: `POST /auth/register`, `POST /auth/login`,
`GET /questions`, `GET /health`. O resto exige `Authorization: Bearer <token>`.

| Método | Rota | O que faz |
|---|---|---|
| POST | `/auth/register` · `/auth/login` | cria sessão |
| GET | `/questions` | questionário ativo, com alternativas |
| POST | `/assessments` | inicia **ou retoma** o questionário em aberto |
| POST | `/assessments/{id}/answers` | grava a resposta (upsert por questão) |
| POST | `/assessments/{id}/complete` | conclui, exigindo o mínimo de respostas |
| GET | `/assessments/{id}/profile` | P(t) por trait, ordenado |
| GET | `/assessments/{id}/recommendations` | profissões + compatibilidade + justificativas |
| GET | `/career-areas` · `/professions` | catálogo (filtro `areaCode`, enriquecimento `assessmentId`) |
| GET | `/professions/{id}` | perfil completo da profissão |
| POST | `/professions/{id}/feedback` | `FAVORITE` / `NEUTRAL` / `NOT_INTERESTED` |
| GET | `/professions/{id}/micro-experience` | a tarefa prática |
| POST | `/micro-experiences/{id}/respond` | notas 1–5 + anotação livre |
| GET | `/students/me/my-path` | painel consolidado |

Erros seguem **RFC 7807** (`application/problem+json`) com `timestamp` extra, e `errors[]`
quando a falha é de validação. Isso vale inclusive para 401 e 403, que nascem na cadeia de
filtros do Spring Security, antes do `@RestControllerAdvice`.

---

## O motor de recomendação

Três classes puras em `recommendation/` — sem Spring, sem JPA — para que as fórmulas sejam
testáveis sem subir contexto.

### P(t) — `ProfileCalculator`

```
S_raw(t) = Σ peso(alternativa escolhida, t)
S_max(t) = Σ max( peso(o, t) para cada alternativa o ), por questão respondida
P(t)     = min(100, S_raw(t) / S_max(t) × 100)
```

**Ambiguidade da spec, resolvida:** `S_max(t)` considera **apenas as questões respondidas**.
É a única leitura em que P(t) significa "o quanto pontuei deste trait em relação ao quanto
poderia ter pontuado", e não penaliza quem parou no meio.

Se `S_max(t) = 0`, o trait **sai do perfil** em vez de virar 0% — nenhuma pergunta respondida
mediu aquele trait, então afirmar 0% seria inventar um dado.

### C(k) — `CompatibilityCalculator`

```
C(k) = Σ(t ∈ T_k)[ P(t) × W_k(t) ] / Σ(t ∈ T_k)[ W_k(t) × 100 ] × 100
```

**Segunda ambiguidade, resolvida:** trait exigido que o estudante não pontuou entra com
`P(t) = 0` mas **permanece no denominador**. Não pontuar algo que a profissão exige todos os
dias *deve* derrubar a compatibilidade.

`T_k` vazio devolve zero, sem divisão por zero.

### Justificativa — `ExplanationBuilder`

Ordena por contribuição `P(t) × W_k(t)`, descarta `P(t) < 60`, devolve no máximo 3. Se nada
passa do corte, **devolve lista vazia** e a interface mostra um convite a explorar. Empates
são desempatados pelo id do trait, só para a saída ser estável.

Aritmética em `BigDecimal` com `scale(2, HALF_UP)`: os testes comparam valores exatos, sem
epsilon.

---

## Mantendo os seeds

A qualidade das recomendações depende inteiramente dos pesos, que são conteúdo, não código.
Tudo é referenciado por **`code`** (`ANALISE_LOGICA`, `TECNOLOGIA`, `DESENVOLVEDOR_SOFTWARE`),
nunca por id numérico — ids dependem da ordem de execução das migrations e não são estáveis.

### Traits (V6) — 14

O vocabulário do sistema. Um trait só é útil se (a) alguma alternativa o pontua e (b) alguma
profissão o exige. Adicionar um trait exige mexer em `V15` e `V11` junto.

### Pesos de alternativa → trait (V15)

O quanto escolher aquela alternativa diz sobre o trait:

| Peso | Leitura |
|---|---|
| 5 | a alternativa é praticamente a definição do trait |
| 4 | indício forte |
| 3 | indício moderado |
| 2 | indício fraco |
| 1 | tangencial |

Cuidado com o denominador: o **maior** peso disponível em cada questão define S_max. Se toda
alternativa de uma questão der peso 5 a um trait, esse trait fica fácil de maximizar.

### Pesos de profissão → trait (V11)

O quanto o trait pesa no **dia a dia real** da profissão:

| Peso | Leitura |
|---|---|
| 5 | central, a profissão se apoia nisso todos os dias |
| 4 | muito presente |
| 3 | presente com regularidade |
| 2 | aparece de vez em quando |
| 1 | marginal |

Como traits não pontuados permanecem no denominador, **listar traits demais em uma profissão
achata a compatibilidade dela** contra todo mundo. Prefira de 4 a 6 traits que realmente
descrevem o ofício.

### Conferindo um seed novo

```sql
-- alternativa sem peso nenhum (não deve retornar nada)
SELECT ao.id FROM answer_options ao
  LEFT JOIN option_trait_weights w ON w.answer_option_id = ao.id WHERE w.id IS NULL;

-- trait que nenhuma profissão exige, ou que nenhuma alternativa pontua
SELECT t.code FROM traits t
  LEFT JOIN profession_traits pt ON pt.trait_id = t.id WHERE pt.id IS NULL;
```

---

## Notas de manutenção

**A migration `V4` foi reescrita.** Ela liga as alternativas à questão pelo texto, em vez do
`question_id = 1` fixo que existia antes. Isso muda o checksum do Flyway: um banco que já
passou da V4 vai recusar subir. Rode `flyway repair` ou recrie o volume:

```bash
docker compose down -v && docker compose up
```

**`ddl-auto=validate`.** As entidades são conferidas contra o schema real no boot. É
intencional: um `@Column` que não bate com a migration derruba a aplicação na subida, e não
em produção na primeira query.

**Testcontainers exige Docker ativo**, na máquina e no CI. Os testes do motor
(`*Calculator*Test`, `*ExplanationBuilder*Test`) são puros e rodam sem ele.

---

## Estrutura

Monólito modular, *package-by-feature*, sob `br.com.norte.norte_api`:

```
common/          ProblemDetail handler, exceções, prefixo /api/v1, CORS
security/        SecurityFilterChain, JwtService, resolver @CurrentStudent
student/         cadastro, login, dados do estudante
trait/           catálogo de características
question/        Question, AnswerOption, OptionTraitWeight
assessment/      Assessment, AssessmentAnswer
recommendation/  MOTOR (classes puras) + serviço e controller
catalog/         CareerArea, Profession, ProfessionTrait
feedback/        ProfessionFeedback
microexperience/ MicroExperience e as respostas do estudante
mypath/          agregador de leitura do painel
```

Regra de camadas: `Controller` (só HTTP) → `Service` (`@Transactional`) → `Repository`.
Controllers **nunca** expõem entidades JPA; toda saída é `record` DTO.
