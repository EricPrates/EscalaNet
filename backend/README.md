# EscalaNet Backend API

API REST do sistema de gestão esportiva do **Programa Bom de Bola**.

O backend é construído com **Node.js**, **TypeScript**, **Express**, **TypeORM**, **Zod** e **JWT**. O foco é gerenciar núcleos, categorias, times, jogadores, treinos, jogos, frequência, competições, classificação, materiais, relatórios, upload e usuários.

Base local padrão: `http://localhost:3000`

---

## O Que Foi Atualizado

As últimas mudanças alinharam os módulos de domínio com um padrão mais consistente de entrada, saída e permissão:

- `time`
  - schema base passou a usar `*_Id` para relações na entrada;
  - respostas usam o schema de resposta;
  - filtros foram limpos de casts inseguros;
  - rotas de escrita passaram a usar `verificarPermissao`;
  - service valida núcleo em criar, atualizar e deletar.
- `treino`
  - entrada agora usa `nucleoId` com transformação para relação;
  - filtros inválidos foram removidos;
  - repository passou a aceitar `relations` no `listar`;
  - `obterPorId` não força mais `select` fixo;
  - rotas de escrita agora exigem permissão.
- `material`
  - schema e service foram ajustados para trabalhar com relação `nucleo` de forma consistente;
  - o repositório foi corrigido para evitar inferência errada de tipos no create/save.

As últimas mudanças foram aplicadas e os módulos principais seguem compilando. Há ainda pendências em testes sob `src/tests/relatorio` que podem afetar a compilação total do projeto.

---

## Sumário

- [Como rodar](#como-rodar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Banco de dados e migrations](#banco-de-dados-e-migrations)
- [Autenticação e permissões](#autenticação-e-permissões)
- [Convenções da API](#convenções-da-api)
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
  - [Materiais](#materiais)
  - [Relatórios](#relatórios)
  - [Upload](#upload)
- [Respostas](#respostas)

---

## Como Rodar

```bash
npm install
npm run dev
```

Build e produção:

```bash
npm run build
npm start
```

---

## Variáveis de Ambiente

Exemplo de `.env`:

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

## Scripts

```bash
npm run dev
npm run build
npm start
npm test
npm run migrate:generate -- src/migrations/NomeDaMigration
npm run migrate:run
npm run migrate:revert
```

---

## Banco de Dados e Migrations

O projeto usa **TypeORM** com `synchronize: false`. O schema do banco é controlado por migrations.

```bash
npm run typeorm -- schema:drop -d src/data-source.ts
npm run migrate:run
```

Para gerar uma migration a partir dos models:

```bash
npm run migrate:generate -- src/migrations/NomeDaMigration
```

---

## Autenticação e Permissões

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

O token deve ser enviado em todas as rotas protegidas:

```http
Authorization: Bearer <token>
```

### Perfis

| Permissão | Uso |
|-----------|-----|
| `admin` | Acesso total |
| `professor` | Acesso restrito ao próprio núcleo |
| `arbitro` | Uso em fluxos de jogo, quando aplicável |
| `auxiliar` | Uso em fluxos administrativos, quando aplicável |

### Regra geral

- `admin` pode criar, editar e excluir em praticamente todos os módulos.
- `professor` enxerga e altera apenas dados do núcleo vinculado.
- Em alguns módulos, a permissão é reforçada também no service para evitar bypass de rota.

---

## Convenções da API

### Paginação

Listagens paginadas aceitam:

| Parâmetro | Padrão |
|-----------|--------|
| `pagina` | `1` |
| `limite` | `10` |

### Includes

Use `includes` para carregar relações:

```http
GET /times?includes=nucleo,categoria,treinador
```

### Datas

Datas devem ser enviadas em formato ISO 8601:

```json
"2026-06-10"
```

ou

```json
"2026-06-10T14:00:00.000Z"
```

### Relações por ID

Os schemas mais recentes seguem este padrão:

- entrada usa campos como `nucleoId`, `categoriaId`, `treinadorId`, `timeId`, `jogadorId`;
- o schema transforma esses IDs para objetos de relação antes de chegar ao repositório;
- o repositório salva a entidade já com a estrutura esperada pelo TypeORM.

Exemplo:

```json
{
  "nucleoId": 1,
  "categoriaId": 2,
  "treinadorId": 3
}
```

---

## Guia De Consumo Do Frontend

Para consumir a API sem precisar abrir o backend, o front deve seguir estas regras:

- rotas públicas não precisam de token;
- rotas protegidas exigem `Authorization: Bearer <token>`;
- quando a resposta for paginada, use `data` e `meta`;
- quando o payload tiver relações, envie os campos `*Id` ou objetos com `id`, conforme o schema do módulo;
- trate `403` como bloqueio de permissão ou bloqueio de núcleo do professor.

### Fluxo de integração recomendado

1. Fazer login em `POST /login`.
2. Salvar o token recebido.
3. Enviar o token no header `Authorization` em todas as ações protegidas.
4. Buscar as listas por módulo usando paginação e includes quando necessário.
5. Em telas de edição, reaproveitar os objetos retornados pelo backend para manter o estado sincronizado.

### Padrões de consumo que o front deve esperar

- `200`: leitura e atualização com sucesso.
- `201`: criação com sucesso.
- `204`: exclusão com sucesso, sem corpo.
- `400`: validação inválida no formulário.
- `401`: token ausente ou inválido.
- `403`: sem permissão ou fora do núcleo permitido.
- `404`: recurso não encontrado.
- `409`: conflito de negócio, como duplicidade.

---

## Rotas Públicas

Não exigem token.

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Status da API |
| `POST` | `/login` | Autenticação |
| `POST` | `/usuario` | Cadastro público de usuário |
| `GET` | `/postagens` | Listagem pública de postagens publicadas |
| `GET` | `/postagens/:id` | Detalhe público de uma postagem |

### Postagens

O módulo de postagens está dividido em duas bases:

- `/postagens` para fluxo público;
- `/admin/postagens` para ações protegidas por `admin`.

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/postagens` | público |
| `GET` | `/postagens/:id` | público |
| `POST` | `/admin/postagens` | `admin` |
| `PUT` | `/admin/postagens/:id` | `admin` |
| `DELETE` | `/admin/postagens/:id` | `admin` |

---

## Rotas Protegidas

Todas as rotas abaixo exigem `Authorization: Bearer <token>`.

### Usuários

Base: `/usuarios`

| Método | Rota |
|--------|------|
| `GET` | `/usuarios` |
| `GET` | `/usuarios/:id` |
| `POST` | `/usuarios` |
| `PUT` | `/usuarios/:id` |
| `DELETE` | `/usuarios/:id` |

### Núcleos

Base: `/nucleos`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/nucleos` | `admin` |
| `GET` | `/nucleos/:id` | `admin`, `professor` |
| `GET` | `/nucleos/:id/dashboard` | `admin`, `professor` |
| `POST` | `/nucleos` | `admin` |
| `PUT` | `/nucleos/:id` | `admin`, `professor` |
| `DELETE` | `/nucleos/:id` | `admin` |

### Categorias

Base: `/categorias`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/categorias` | autenticado |
| `GET` | `/categorias/:id` | autenticado |
| `POST` | `/categorias` | `admin` |
| `PUT` | `/categorias/:id` | `admin` |
| `DELETE` | `/categorias/:id` | `admin` |

### Times

Base: `/times`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/times` | autenticado |
| `GET` | `/times/:id` | autenticado |
| `POST` | `/times` | `admin`, `professor` |
| `PUT` | `/times/:id` | `admin`, `professor` |
| `DELETE` | `/times/:id` | `admin`, `professor` |

Exemplo de criação:

```json
{
  "nome": "Time Sub-15 A",
  "nucleoId": 1,
  "categoriaId": 2,
  "treinadorId": 3
}
```

Filtros comuns: `id`, `nome`, `nucleoId`, `categoriaId`, `treinadorId`

### Jogadores

Base: `/jogadores`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/jogadores` | autenticado |
| `GET` | `/jogadores/:id` | autenticado |
| `POST` | `/jogadores` | `admin`, `professor` |
| `PUT` | `/jogadores/:id` | `admin`, `professor` |
| `DELETE` | `/jogadores/:id` | `admin`, `professor` |

### Treinos

Base: `/treinos`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/treinos` | autenticado |
| `GET` | `/treinos/:id` | autenticado |
| `POST` | `/treinos` | `admin`, `professor` |
| `PUT` | `/treinos/:id` | `admin`, `professor` |
| `DELETE` | `/treinos/:id` | `admin`, `professor` |

Exemplo de criação:

```json
{
  "data": "2026-06-10",
  "nucleoId": 1,
  "jogadores": [{ "id": 1 }, { "id": 2 }],
  "usuarios": [{ "id": 3 }]
}
```

Filtros aceitos: `id`, `data`, `nucleoId`

### Jogos

Base: `/jogos`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/jogos` | autenticado |
| `GET` | `/jogos/:id` | autenticado |
| `POST` | `/jogos` | `admin`, `professor` |
| `PUT` | `/jogos/:id` | `admin`, `professor` |
| `DELETE` | `/jogos/:id` | `admin`, `professor` |

### Eventos de Jogo

Base: `/eventos`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/eventos` | `admin`, `professor` |
| `GET` | `/eventos/:id` | `admin`, `professor` |
| `POST` | `/eventos` | `admin`, `professor` |
| `PUT` | `/eventos/:id` | `admin`, `professor` |
| `DELETE` | `/eventos/:id` | `admin` |

### Chamadas

Base: `/chamadas`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/chamadas` | `admin` |
| `GET` | `/chamadas/data` | `admin`, `professor` |
| `GET` | `/chamadas/:id` | `admin`, `professor` |
| `POST` | `/chamadas` | `admin`, `professor` |
| `PUT` | `/chamadas/:id` | `admin`, `professor` |
| `DELETE` | `/chamadas/:id` | `admin` |

### Frequência

Base: `/frequencias`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/frequencias` | `admin`, `professor` |
| `GET` | `/frequencias/:id` | `admin`, `professor` |
| `POST` | `/frequencias` | `admin`, `professor` |
| `PUT` | `/frequencias/:id` | `admin`, `professor` |
| `DELETE` | `/frequencias/:id` | `admin` |

### Competições

Base: `/competicoes`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/competicoes` | autenticado |
| `GET` | `/competicoes/:id` | autenticado |
| `POST` | `/competicoes` | `admin` |
| `PUT` | `/competicoes/:id` | `admin` |
| `DELETE` | `/competicoes/:id` | `admin` |
| `PUT` | `/competicoes/:id/times` | `admin` |
| `POST` | `/competicoes/:id/gerar-jogos` | `admin` |
| `POST` | `/competicoes/:id/recalcular-classificacao` | `admin` |

### Classificação

Base: `/classificacoes`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/classificacoes` | `admin`, `professor` |
| `GET` | `/classificacoes/:id` | `admin`, `professor` |
| `POST` | `/classificacoes` | `admin`, `professor` |
| `PUT` | `/classificacoes/:id` | `admin`, `professor` |
| `DELETE` | `/classificacoes/:id` | `admin` |

### Materiais

Base: `/materiais`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/materiais` | `admin`, `professor` |
| `GET` | `/materiais/:id` | `admin`, `professor` |
| `POST` | `/materiais` | `admin`, `professor` |
| `PUT` | `/materiais/:id` | `admin`, `professor` |
| `DELETE` | `/materiais/:id` | `admin` |

Exemplo de criação:

```json
{
  "quantidade": 10,
  "tipoMaterial": "Bola",
  "observacao": "Bolas novas",
  "nucleoId": 1,
  "dataRecebimento": "2026-01-15"
}
```

### Relatórios

Base: `/relatorios`

| Método | Rota | Permissão |
|--------|------|-----------|
| `GET` | `/relatorios/frequencia` | `admin`, `professor` |
| `GET` | `/relatorios/desempenho` | `admin`, `professor` |
| `GET` | `/relatorios/frequencia/pdf` | `admin`, `professor` |
| `GET` | `/relatorios/desempenho/pdf` | `admin`, `professor` |

### Upload

Base: `/upload`

| Método | Rota | Permissão |
|--------|------|-----------|
| `POST` | `/upload/imagem` | `admin` |
| `POST` | `/upload/documento` | `admin` |
| `POST` | `/upload/video` | `admin` |

---

## Respostas

### Sucesso de item único

```json
{
  "message": "Mensagem descritiva",
  "data": {}
}
```

### Sucesso paginado

```json
{
  "message": "Listagem realizada com sucesso",
  "data": [],
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

### Códigos HTTP mais comuns

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado |
| `204` | Removido sem corpo |
| `400` | Dados inválidos |
| `401` | Não autenticado |
| `403` | Sem permissão |
| `404` | Não encontrado |
| `409` | Conflito |

---

## Observações Finais

- O backend já está compilando com sucesso.
- Os módulos mais recentes seguem o padrão de transformar `*_Id` em relações antes de salvar.
- Quando houver dúvida sobre um payload, prefira consultar o schema do módulo correspondente em `src/modules/*/*.schemas.ts`.