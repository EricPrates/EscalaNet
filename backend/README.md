# EscalaNet — API Backend

API REST do sistema de gestão esportiva do **Programa Bom de Bola** (SEL/PJF).  
Gerencia núcleos, times, jogadores, treinos, jogos, competições, frequência, relatórios e publicações da landing page.

**Base URL:** `http://localhost:3000` (ou a URL do ambiente configurado)

---

## Sumário

- [Como rodar](#como-rodar)
- [Banco de dados e migrations](#banco-de-dados-e-migrations)
- [Autenticação](#autenticação)
- [Formato das respostas](#formato-das-respostas)
- [Paginação, filtros e includes](#paginação-filtros-e-includes)
- [Rotas públicas](#rotas-públicas)
- [Rotas protegidas](#rotas-protegidas)
  - [Usuários](#usuários)
  - [Núcleos](#núcleos)
  - [Categorias](#categorias)
  - [Times](#times)
  - [Jogadores](#jogadores)
  - [Treinos](#treinos)
  - [Jogos](#jogos)
  - [Eventos de Jogo](#eventos-de-jogo)
  - [Chamadas](#chamadas)
  - [Frequência](#frequência)
  - [Competições](#competições)
  - [Classificação](#classificação)
  - [Material de Núcleo](#material-de-núcleo)
  - [Relatórios](#relatórios)
- [Upload de arquivos](#upload-de-arquivos)
- [Referência rápida](#referência-rápida)

---

## Como rodar

```bash
# Instalar dependências
npm install

# Desenvolvimento (hot reload)
npm run dev

# Produção
npm run build
npm start
```

### Variáveis de ambiente (`.env`)

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta

DB_HOST=
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASS=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Banco de dados e migrations

O projeto usa **TypeORM** com `synchronize: false`. O schema é controlado por migrations.

```bash
# Gerar migration a partir dos models (banco deve estar vazio ou sem diff)
npm run migrate:generate -- src/migrations/NomeDaMigration

# Aplicar migrations pendentes
npm run migrate:run

# Reverter última migration
npm run migrate:revert

# Limpar todas as tabelas (cuidado: apaga tudo)
npm run typeorm -- schema:drop -d src/data-source.ts
```

**Primeira configuração (banco vazio, sem dados):**

```bash
npm run typeorm -- schema:drop -d src/data-source.ts
npm run migrate:run
```

---

## Autenticação

A API usa **JWT Bearer Token**.

### Login

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "admin@escalanet.com",
  "senha": "minimo6chars"
}
```

**Resposta (200):**

```json
{
  "message": "Login realizado com sucesso",
  "data": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@escalanet.com",
    "permissao": "admin",
    "nucleoVinculadoId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

O token também é retornado no header `Authorization: Bearer <token>`.

### Rotas protegidas

Envie o token em todas as rotas registradas **após** o middleware de autenticação:

```http
Authorization: Bearer <token>
```

Sem token ou token inválido → `401 Unauthorized`.

### Permissões

| Permissão | Descrição |
|-----------|-----------|
| `admin` | Acesso total; obrigatório para criar/editar/deletar categorias |
| `professor` | Padrão no cadastro |
| `arbitro` | Árbitro de jogos |
| `auxiliar` | Auxiliar |

---

## Formato das respostas

### Sucesso (item único)

```json
{
  "message": "Mensagem descritiva",
  "data": { }
}
```

### Sucesso (lista paginada)

```json
{
  "message": "Listagem realizada com sucesso",
  "data": [ ],
  "meta": {
    "pagina": 1,
    "limite": 10,
    "total": 42,
    "totalPaginas": 5
  }
}
```

### Erro

```json
{
  "status": 400,
  "message": "Descrição do erro",
  "detalhes": "Detalhes opcionais"
}
```

### Códigos HTTP comuns

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado |
| `204` | Removido (sem corpo) |
| `400` | Dados inválidos |
| `401` | Não autenticado |
| `403` | Sem permissão |
| `404` | Não encontrado |
| `409` | Conflito (ex.: jogos já gerados) |

---

## Paginação, filtros e includes

### Paginação

Disponível em todas as listagens (`GET` com coleção). Query params:

| Param | Tipo | Padrão | Regra |
|-------|------|--------|-------|
| `pagina` | `number` | `1` | Inteiro positivo |
| `limite` | `number` | `10` | Inteiro positivo, máx. `100` |

**Exemplo:**

```http
GET /times?pagina=1&limite=20&nome=sub-15
Authorization: Bearer <token>
```

### Filtros

Cada módulo aceita filtros específicos via query string (documentados em cada seção). Buscas de texto (`nome`, `busca`) usam correspondência parcial (ILIKE).

### Includes (relações)

Para carregar entidades relacionadas, use o parâmetro `includes` com valores separados por vírgula:

```http
GET /competicoes/1?includes=times,jogos
Authorization: Bearer <token>
```

Os valores permitidos variam por módulo (listados em cada seção).

### Datas

Envie datas em formato ISO 8601: `"2026-06-10"` ou `"2026-06-10T14:00:00.000Z"`.

### Referências por ID

Campos de relação são enviados como objeto com `id`:

```json
{ "timeA": { "id": 1 }, "timeB": { "id": 2 } }
```

---

## Rotas públicas

Não exigem token.

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Status da API |
| `POST` | `/login` | Autenticação |
| `POST` | `/usuario` | Cadastro de usuário |
| `GET` | `/postagens/publicadas` | Postagens publicadas (landing) |
| `GET` | `/postagens/:id` | Detalhe de postagem |
| `GET` | `/postagens` | Listagem admin de postagens |
| `POST` | `/postagens` | Criar postagem |
| `PUT` | `/postagens/:id` | Atualizar postagem |
| `DELETE` | `/postagens/:id` | Remover postagem |
| `POST` | `/upload/imagem` | Upload de imagem |
| `POST` | `/upload/documento` | Upload de documento |
| `POST` | `/upload/video` | Upload de vídeo |

> **Nota:** O módulo de postagens está montado antes do middleware de autenticação — todas as rotas de `/postagens` são públicas no estado atual do servidor.

---

## Rotas protegidas

Todas exigem `Authorization: Bearer <token>`.

---

### Usuários

**Base:** `/usuarios`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/usuarios` | Listar |
| `GET` | `/usuarios/:id` | Buscar por ID |
| `POST` | `/usuarios` | Criar |
| `PUT` | `/usuarios/:id` | Atualizar |
| `DELETE` | `/usuarios/:id` | Remover |

> Cadastro público alternativo: `POST /usuario` (mesmo body).

**Criar / atualizar (body):**

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "permissao": "professor",
  "nucleoVinculado": { "id": 1 }
}
```

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `nome` | `string` | sim (criar) |
| `email` | `string` (email) | sim (criar) |
| `senha` | `string` (min 6) | sim (criar) |
| `permissao` | `admin` \| `professor` \| `arbitro` \| `auxiliar` | sim (criar) |
| `nucleoVinculado` | `{ id: number }` | não |

**Filtros (query):** `id`, `nome`, `email`, `permissao`, `nucleoVinculadoId`

**Includes:** `nucleoVinculado`, `jogos`, `treinos`, `eventos`

---

### Núcleos

**Base:** `/nucleos`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/nucleos` | Listar |
| `GET` | `/nucleos/:id` | Buscar por ID |
| `GET` | `/nucleos/:id/dashboard` | Métricas do núcleo |
| `POST` | `/nucleos` | Criar |
| `PUT` | `/nucleos/:id` | Atualizar |
| `DELETE` | `/nucleos/:id` | Remover |

**Criar (body):**

```json
{
  "nome": "Núcleo Centro",
  "endereco": "Rua das Flores, 100"
}
```

**Dashboard (`GET /nucleos/:id/dashboard`)** retorna totais de jogadores, professores, jogos, treinos, times, categorias, etc.

**Filtros:** `id`, `nome`, `endereco`, `createdAt`, `updateAt`

**Includes:** `materiais`, `times`, `treinos`

---

### Categorias

**Base:** `/categorias`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/categorias` | Qualquer autenticado |
| `GET` | `/categorias/:id` | Qualquer autenticado |
| `POST` | `/categorias` | **admin** |
| `PUT` | `/categorias/:id` | **admin** |
| `DELETE` | `/categorias/:id` | **admin** |

**Criar (body):**

```json
{
  "nome": "Sub-15",
  "idadeMaxima": 15,
  "ativa": true
}
```

**Filtros:** `id`, `nome`, `ativa`, `idadeMaxima`, `buscaDataInicio`, `buscaDataFim`

**Includes:** `times`, `jogos`

---

### Times

**Base:** `/times`

| Método | Rota |
|--------|------|
| `GET` | `/times` |
| `GET` | `/times/:id` |
| `POST` | `/times` |
| `PUT` | `/times/:id` |
| `DELETE` | `/times/:id` |

**Criar (body):**

```json
{
  "nome": "Time Sub-15 A",
  "nucleoId": 1,
  "categoriaId": 2,
  "treinadorId": 3
}
```

**Filtros:** `id`, `nome`, `nucleoId`, `categoriaId`, `treinadorId`

**Includes:** `nucleo`, `categoria`, `treinador`, `jogadores`, `jogosComoTimeA`, `jogosComoTimeB`, `eventos`, `competicoes`, `chamadas`

---

### Jogadores

**Base:** `/jogadores`

| Método | Rota |
|--------|------|
| `GET` | `/jogadores` |
| `GET` | `/jogadores/:id` |
| `POST` | `/jogadores` |
| `PUT` | `/jogadores/:id` |
| `DELETE` | `/jogadores/:id` |

**Criar (body):**

```json
{
  "nome": "Pedro Santos",
  "dataNascimento": "2011-03-15",
  "ativo": true,
  "telefone": "11999999999",
  "time": { "id": 1 }
}
```

**Filtros:** `id`, `nome`, `timeId`, `treinadorId`, `ativo`, `dataNascimento`, `nucleoId`, `categoriaId`

**Includes:** `time`

---

### Treinos

**Base:** `/treinos`

| Método | Rota |
|--------|------|
| `GET` | `/treinos` |
| `GET` | `/treinos/:id` |
| `POST` | `/treinos` |
| `PUT` | `/treinos/:id` |
| `DELETE` | `/treinos/:id` |

**Criar (body):**

```json
{
  "data": "2026-06-10",
  "nucleo": { "id": 1 },
  "jogadores": [{ "id": 1 }, { "id": 2 }],
  "usuarios": [{ "id": 3 }]
}
```

**Filtros:** `id`, `data`, `nome`, `nucleoId`, `jogadorId`, `usuarioId`

**Includes:** `nucleo`, `jogadores`, `usuarios`

---

### Jogos

**Base:** `/jogo`

| Método | Rota |
|--------|------|
| `GET` | `/jogo` |
| `GET` | `/jogo/:id` |
| `POST` | `/jogo` |
| `PUT` | `/jogo/:id` |
| `DELETE` | `/jogo/:id` |

**Criar (body):**

```json
{
  "nome": "Time A x Time B",
  "data": "2026-06-15",
  "timeA": { "id": 1 },
  "timeB": { "id": 2 },
  "arbitro": { "id": 3 },
  "categoria": { "id": 1 }
}
```

**Atualizar placar (body):**

```json
{
  "golsTimeA": 2,
  "golsTimeB": 1,
  "finalizado": true
}
```

| Campo extra (update) | Descrição |
|---------------------|-----------|
| `golsTimeA` | Gols do time A |
| `golsTimeB` | Gols do time B |
| `finalizado` | `true` quando o jogo foi disputado |

> Ao marcar `finalizado: true` em jogo de competição do tipo **Liga**, a classificação é recalculada automaticamente.

**Filtros:** `id`, `nome`, `data`, `timeA`, `timeB`, `arbitro`, `categoria`, `golsTimeA`, `golsTimeB`, `chamada`, `evento`

**Includes:** `timeA`, `timeB`, `arbitro`, `categoria`, `competicao`

---

### Eventos de Jogo

**Base:** `/eventos`

| Método | Rota |
|--------|------|
| `GET` | `/eventos` |
| `GET` | `/eventos/:id` |
| `POST` | `/eventos` |
| `PUT` | `/eventos/:id` |
| `DELETE` | `/eventos/:id` |

**Criar (body):**

```json
{
  "tipo": "gol",
  "descricao": "Gol de falta",
  "minuto": 23,
  "jogo": { "id": 1 },
  "usuario": { "id": 3 },
  "nucleo": { "id": 1 },
  "jogadorEnvolvido": { "id": 5 }
}
```

**Tipos de evento (`tipo`):**

`gol` · `falta` · `cartao_amarelo` · `cartao_vermelho` · `escanteio` · `substituicao`

**Filtros:** `tipo`, `minuto`, `jogoId`, `usuarioId`, `nucleoId`, `jogadorEnvolvidoId`, `descricao`, `acrescimo`

**Includes:** `time`, `jogo`, `jogadorEnvolvido`, `usuario`

---

### Chamadas

**Base:** `/chamadas`

| Método | Rota |
|--------|------|
| `GET` | `/chamadas` |
| `GET` | `/chamadas/:id` |
| `POST` | `/chamadas` |
| `PUT` | `/chamadas/:id` |
| `DELETE` | `/chamadas/:id` |

**Criar (body):**

```json
{
  "data": "2026-06-10",
  "timeId": 1,
  "treinoId": 5,
  "jogoId": null
}
```

Informe `treinoId` **ou** `jogoId` (o outro como `null`).

**Filtros:** `dataInicio`, `dataFim`, `timeId`, `jogoId`, `treinoId`

**Includes:** `time`, `jogo`, `treino`

---

### Frequência

**Base:** `/frequencias`

| Método | Rota |
|--------|------|
| `GET` | `/frequencias` |
| `GET` | `/frequencias/:id` |
| `POST` | `/frequencias` |
| `PUT` | `/frequencias/:id` |
| `DELETE` | `/frequencias/:id` |

**Criar (body):**

```json
{
  "data": "2026-06-10",
  "presente": true,
  "jogadorId": 1,
  "treinoId": 5,
  "jogoId": null
}
```

**Filtros:** `chamadaId`, `presente`, `jogadorId`, `justificativa`

**Includes:** `jogador`, `treino`, `jogo`

---

### Competições

**Base:** `/competicoes`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/competicoes` | Listar |
| `GET` | `/competicoes/:id` | Buscar por ID |
| `POST` | `/competicoes` | Criar |
| `PUT` | `/competicoes/:id` | Atualizar |
| `DELETE` | `/competicoes/:id` | Remover |
| `PUT` | `/competicoes/:id/times` | Vincular times |
| `POST` | `/competicoes/:id/gerar-jogos` | Gerar jogos automaticamente |
| `POST` | `/competicoes/:id/recalcular-classificacao` | Recalcular tabela |

**Criar (body):**

```json
{
  "nome": "Liga Bom de Bola 2026",
  "tipo": "Liga",
  "intervaloDias": 7,
  "duplaVolta": true
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | `string` | Nome da competição |
| `tipo` | `Copa` \| `Liga` | Formato |
| `intervaloDias` | `number` | Dias entre rodadas (padrão: 7) |
| `duplaVolta` | `boolean` | Dois turnos (só Liga; padrão: false) |

**Vincular times (`PUT /competicoes/:id/times`):**

```json
{
  "timeIds": [1, 2, 3, 4]
}
```

**Gerar jogos (`POST /competicoes/:id/gerar-jogos`):**

```json
{
  "dataInicio": "2026-06-10"
}
```

- **Liga:** gera round-robin (todos contra todos); com `duplaVolta: true` inverte o mando no segundo turno.
- **Copa:** gera apenas a primeira rodada do mata-mata.
- Requer pelo menos 2 times vinculados.
- Não gera novamente se já existirem jogos (retorna `409`).

**Filtros:** `id`, `nome`, `tipo`

**Includes:** `jogos`, `times`

#### Fluxo completo de uma competição Liga

```bash
# 1. Criar competição
POST /competicoes
{ "nome": "Liga 2026", "tipo": "Liga", "intervaloDias": 7, "duplaVolta": true }

# 2. Vincular times
PUT /competicoes/1/times
{ "timeIds": [1, 2, 3, 4] }

# 3. Gerar jogos
POST /competicoes/1/gerar-jogos
{ "dataInicio": "2026-06-10" }

# 4. Registrar placar (marca jogo como finalizado)
PUT /jogo/5
{ "golsTimeA": 2, "golsTimeB": 1, "finalizado": true }

# 5. Consultar classificação
GET /classificacoes?competicaoId=1&includes=time,competicao
```

---

### Classificação

**Base:** `/classificacoes`

| Método | Rota |
|--------|------|
| `GET` | `/classificacoes` |
| `GET` | `/classificacoes/:id` |
| `POST` | `/classificacoes` |
| `PUT` | `/classificacoes/:id` |
| `DELETE` | `/classificacoes/:id` |

Em competições **Liga**, a tabela é criada ao gerar jogos e atualizada automaticamente quando um jogo é finalizado. O endpoint manual de recálculo fica em `POST /competicoes/:id/recalcular-classificacao`.

**Criar manualmente (body):**

```json
{
  "competicaoId": 1,
  "timeId": 3,
  "pontos": 9,
  "jogos": 3,
  "vitorias": 3,
  "empates": 0,
  "derrotas": 0,
  "golsPro": 8,
  "golsContra": 2,
  "saldoGols": 6,
  "aproveitamento": 100
}
```

**Filtros:** `id`, `competicaoId`, `timeId`, `timeNome`

**Includes:** `competicao`, `time`

**Critérios de ordenação:** pontos → saldo de gols → gols pró.

---

### Material de Núcleo

**Base:** `/material-nucleo`

| Método | Rota |
|--------|------|
| `GET` | `/material-nucleo` |
| `GET` | `/material-nucleo/:id` |
| `POST` | `/material-nucleo` |
| `PUT` | `/material-nucleo/:id` |
| `DELETE` | `/material-nucleo/:id` |

**Criar (body):**

```json
{
  "quantidade": 10,
  "tipoMaterial": "Bola",
  "observacao": "Bolas novas",
  "nucleo": { "id": 1 },
  "dataRecebimento": "2026-01-15"
}
```

**Filtros:** `id`, `quantidade`, `tipoMaterial`, `nucleoId`, `dataRecebimento`

**Includes:** `nucleo`

---

### Relatórios

**Base:** `/relatorios`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/relatorios/frequencia` | Presença por jogador |
| `GET` | `/relatorios/desempenho` | Estatísticas de jogo por jogador |

#### Frequência

```http
GET /relatorios/frequencia?nucleoId=1&timeId=2&dataInicio=2026-01-01&dataFim=2026-06-30&tipo=todos
```

| Filtro | Tipo | Padrão |
|--------|------|--------|
| `nucleoId` | `number` | — |
| `timeId` | `number` | — |
| `jogadorId` | `number` | — |
| `dataInicio` | `date` | — |
| `dataFim` | `date` | — |
| `tipo` | `treino` \| `jogo` \| `todos` | `todos` |

#### Desempenho

```http
GET /relatorios/desempenho?competicaoId=1&timeId=2&dataInicio=2026-01-01&dataFim=2026-06-30
```

| Filtro | Tipo |
|--------|------|
| `nucleoId` | `number` |
| `timeId` | `number` |
| `jogadorId` | `number` |
| `jogoId` | `number` |
| `competicaoId` | `number` |
| `dataInicio` | `date` |
| `dataFim` | `date` |

---

## Upload de arquivos

**Base:** `/upload` (público)  
**Content-Type:** `multipart/form-data`

| Método | Rota | Campo do form | Tipos aceitos | Tamanho máx. |
|--------|------|---------------|---------------|--------------|
| `POST` | `/upload/imagem` | `imagem` | jpeg, png, webp, gif | 5 MB |
| `POST` | `/upload/documento` | `documento` | pdf, doc, docx | 10 MB |
| `POST` | `/upload/video` | `video` | mp4, mov, avi, webm | 100 MB |

**Resposta (201):**

```json
{
  "message": "Imagem enviada com sucesso",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "imagens/abc123",
    "formato": "jpg",
    "tamanhoBytes": 245000
  }
}
```

Use a `url` retornada em campos como `imagemUrl` ao criar postagens.

---

## Postagens (landing page)

**Base:** `/postagens` (público)

| Método | Rota | Uso |
|--------|------|-----|
| `GET` | `/postagens/publicadas` | Landing — só `status: publicado` |
| `GET` | `/postagens/:id` | Detalhe |
| `GET` | `/postagens` | Listagem admin |
| `POST` | `/postagens` | Criar |
| `PUT` | `/postagens/:id` | Atualizar |
| `DELETE` | `/postagens/:id` | Remover |

**Criar (body):**

```json
{
  "titulo": "Campeonato 2026",
  "conteudo": "Texto completo da notícia...",
  "resumo": "Resumo curto",
  "imagemUrl": "https://res.cloudinary.com/...",
  "status": "publicado",
  "publicadoEm": "2026-06-01"
}
```

**Filtros (admin):** `status`, `busca`, `dataInicio`, `dataFim`

---

## Referência rápida

| Módulo | Base | Auth |
|--------|------|------|
| Status / Login | `/`, `/login`, `/usuario` | Público |
| Postagens | `/postagens` | Público |
| Upload | `/upload` | Público |
| Usuários | `/usuarios` | Token |
| Núcleos | `/nucleos` | Token |
| Categorias | `/categorias` | Token (+ admin para mutações) |
| Times | `/times` | Token |
| Jogadores | `/jogadores` | Token |
| Treinos | `/treinos` | Token |
| Jogos | `/jogo` | Token |
| Eventos | `/eventos` | Token |
| Chamadas | `/chamadas` | Token |
| Frequências | `/frequencias` | Token |
| Competições | `/competicoes` | Token |
| Classificações | `/classificacoes` | Token |
| Material | `/material-nucleo` | Token |
| Relatórios | `/relatorios` | Token |

---

## Testes

```bash
npm test
```
