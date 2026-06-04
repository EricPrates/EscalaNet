# EscalaNet — API Backend

API REST do sistema de gestão esportiva do **Programa Bom de Bola** (SEL/PJF).  
Gerencia núcleos, times, jogadores, treinos, jogos, competições, frequência e publicações da landing page.

---

## Sumário

- [Como rodar](#como-rodar)
- [Autenticação](#autenticação)
- [Formato das respostas](#formato-das-respostas)
- [Paginação e filtros](#paginação-e-filtros)
- [Includes (relações)](#includes-relações)
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
  - [Postagens (admin)](#postagens-admin)
- [Upload de arquivos](#upload-de-arquivos)

---

## Como rodar

```bash
# instalar dependências
npm install

# desenvolvimento (hot reload)
npm run dev

# produção
npm run build
npm start
```

Variáveis de ambiente necessárias no `.env`:

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

## Autenticação

A API usa **JWT Bearer Token**.

### Login

```
POST /login
Content-Type: application/json
```

```json
{
  "email": "admin@escalanet.com",
  "senha": "minimo6chars"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Todas as rotas protegidas exigem o token no header:

```
Authorization: Bearer <token>
```

O token expira em **1 hora**.

---

## Formato das respostas

**Sucesso simples:**
```json
{
  "message": "Recurso obtido com sucesso",
  "data": { ... }
}
```

**Lista paginada:**
```json
{
  "message": "Recursos listados com sucesso",
  "data": [ ... ],
  "meta": {
    "total": 42,
    "totalPaginas": 5,
    "pagina": 1,
    "limite": 10
  }
}
```

**Erro:**
```json
{
  "status": 400,
  "message": "Dados de entrada inválidos",
  "detalhes": "nome: Required; email: Invalid email"
}
```

---

## Paginação e filtros

Todas as rotas de listagem aceitam:

| Query param | Tipo | Padrão | Descrição |
|---|---|---|---|
| `pagina` | number | 1 | Página atual |
| `limite` | number | 10 | Itens por página |

Filtros específicos de cada módulo são passados também como query params. Exemplos:

```
GET /jogadores?nome=carlos&ativo=true&timeId=3
GET /jogos?categoriaId=2&pagina=2&limite=5
GET /postagens?status=publicado&busca=campeonato
```

---

## Includes (relações)

Para carregar relações junto com o recurso, use o parâmetro `includes` com os nomes separados por vírgula:

```
GET /times/1?includes=nucleo,categoria,jogadores
GET /jogos?includes=timeA,timeB,arbitro
```

Cada módulo tem suas relações disponíveis documentadas abaixo.

---

## Rotas públicas

Estas rotas **não exigem token**. Destinadas à landing page.

### Postagens publicadas

```
GET /postagens/publicadas
GET /postagens/publicadas?pagina=1&limite=6
```

Retorna apenas postagens com `status = "publicado"` e `publicadoEm <= hoje`, ordenadas da mais recente para a mais antiga.

```
GET /postagens/:id
```

Retorna uma postagem específica (pública ou rascunho — validar no front se necessário).

### Upload de arquivos

```
POST /upload/imagem
POST /upload/documento
POST /upload/video
```

Ver seção [Upload de arquivos](#upload-de-arquivos).

---

## Rotas protegidas

> Todas as rotas abaixo exigem `Authorization: Bearer <token>`.

---

### Usuários

```
POST   /usuario          → criar usuário (público — cadastro)
GET    /usuarios         → listar
GET    /usuarios/:id     → buscar por ID
PUT    /usuarios/:id     → atualizar
DELETE /usuarios/:id     → deletar
```

**Campos para criar/atualizar:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "permissao": "professor",
  "nucleoVinculado": { "id": 2 }
}
```

Permissões disponíveis: `admin` | `professor` | `arbitro` | `auxiliar`

**Includes disponíveis:** `nucleoVinculado`, `jogos`, `treinos`, `eventos`

---

### Núcleos

```
GET    /nucleos       → listar
GET    /nucleos/:id   → buscar por ID
POST   /nucleos       → criar
PUT    /nucleos/:id   → atualizar
DELETE /nucleos/:id   → deletar
```

**Campos para criar/atualizar:**
```json
{
  "nome": "Núcleo Centro",
  "endereco": "Rua XV de Novembro, 123"
}
```

**Filtros:** `nome`, `endereco`

**Includes disponíveis:** `materiais`, `times`, `treinos`, `usuariosVinculados`

---

### Categorias

```
GET    /categorias       → listar
GET    /categorias/:id   → buscar por ID
POST   /categorias       → criar
PUT    /categorias/:id   → atualizar
DELETE /categorias/:id   → deletar
```

**Campos para criar/atualizar:**
```json
{
  "nome": "Sub-13",
  "idadeMaxima": 13,
  "ativa": true
}
```

**Filtros:** `nome`, `idadeMaxima`, `ativa`

**Includes disponíveis:** `times`, `jogos`

---

### Times

```
GET    /times       → listar
GET    /times/:id   → buscar por ID
POST   /times       → criar
PUT    /times/:id   → atualizar
DELETE /times/:id   → deletar
```

**Campos para criar:**
```json
{
  "nome": "Sub-13 A",
  "nucleoId": 1,
  "categoriaId": 2,
  "treinadorId": 5
}
```

**Filtros:** `nome`, `nucleoId`, `categoriaId`, `treinadorId`

**Includes disponíveis:** `nucleo`, `categoria`, `treinador`, `jogadores`, `jogosComoTimeA`, `jogosComoTimeB`, `eventos`, `competicoes`, `chamadas`

---

### Jogadores

```
GET    /jogadores       → listar
GET    /jogadores/:id   → buscar por ID
POST   /jogadores       → criar
PUT    /jogadores/:id   → atualizar
DELETE /jogadores/:id   → deletar
```

**Campos para criar:**
```json
{
  "nome": "Carlos Silva",
  "dataNascimento": "2011-03-15",
  "ativo": true,
  "telefone": "(32) 99999-9999",
  "time": { "id": 3 }
}
```

**Filtros:** `nome`, `timeId`, `nucleoId`, `categoriaId`, `treinadorId`, `ativo`, `dataNascimento`

**Includes disponíveis:** `time`

---

### Treinos

```
GET    /treinos       → listar
GET    /treinos/:id   → buscar por ID
POST   /treinos       → criar
PUT    /treinos/:id   → atualizar
DELETE /treinos/:id   → deletar
```

**Campos para criar:**
```json
{
  "data": "2026-06-10",
  "nucleo": { "id": 1 },
  "jogadores": [{ "id": 5 }, { "id": 8 }],
  "usuarios": [{ "id": 2 }]
}
```

> Usuários sem `nucleoVinculado` (admin) veem todos os treinos.  
> Usuários com núcleo vinculado veem apenas treinos do seu núcleo.

**Filtros:** `nucleoId`, `data`, `jogadorId`, `usuarioId`

**Includes disponíveis:** `nucleo`, `jogadores`, `usuarios`

---

### Jogos

```
GET    /jogo       → listar
GET    /jogo/:id   → buscar por ID
POST   /jogo       → criar
PUT    /jogo/:id   → atualizar
DELETE /jogo/:id   → deletar
```

**Campos para criar:**
```json
{
  "nome": "Final Sub-13",
  "data": "2026-07-20",
  "timeA": { "id": 3 },
  "timeB": { "id": 7 },
  "arbitro": { "id": 4 },
  "categoria": { "id": 2 }
}
```

**Filtros:** `nome`, `timeA`, `timeB`, `arbitro`, `categoriaId`, `data`, `golsTimeA`, `golsTimeB`

**Includes disponíveis:** `timeA`, `timeB`, `arbitro`, `categoria`

---

### Eventos de Jogo

```
GET    /eventos       → listar
GET    /eventos/:id   → buscar por ID
POST   /eventos       → criar
PUT    /eventos/:id   → atualizar
DELETE /eventos/:id   → deletar
```

**Campos para criar:**
```json
{
  "tipo": "gol",
  "minuto": 35,
  "descricao": "Gol de cabeça",
  "jogo": { "id": 12 },
  "usuario": { "id": 4 },
  "nucleo": { "id": 1 },
  "jogadorEnvolvido": { "id": 9 }
}
```

**Tipos de evento:** `gol` | `falta` | `cartao_amarelo` | `cartao_vermelho` | `escanteio` | `substituicao`

**Filtros:** `tipo`, `jogoId`, `usuarioId`, `nucleoId`, `jogadorEnvolvidoId`, `minuto`

**Includes disponíveis:** `jogo`, `treino`, `jogadorEnvolvido`, `usuario`

---

### Chamadas

```
GET    /chamadas       → listar
GET    /chamadas/:id   → buscar por ID
POST   /chamadas       → criar
PUT    /chamadas/:id   → atualizar
DELETE /chamadas/:id   → deletar
```

Uma chamada é o registro de presença de um **time** em um treino ou jogo específico.  
Depois de criar a chamada, registre a frequência individual de cada jogador via `/frequencia`.

**Campos para criar:**
```json
{
  "data": "2026-06-10",
  "timeId": 3,
  "treinoId": 8,
  "jogoId": null
}
```

> `treinoId` ou `jogoId` — preencha apenas um dos dois.

**Filtros:** `data`, `timeId`, `treinoId`, `jogoId`

**Includes disponíveis:** `time`, `jogo`, `treino`

---

### Frequência

```
GET    /frequencia       → listar
GET    /frequencia/:id   → buscar por ID
POST   /frequencia       → criar
PUT    /frequencia/:id   → atualizar
DELETE /frequencia/:id   → deletar
```

Registra a presença/ausência de um **jogador** em uma chamada.

**Campos para criar:**
```json
{
  "presente": true,
  "jogadorId": 9,
  "chamadaId": 14,
  "justificativa": null
}
```

**Filtros:** `chamadaId`, `jogadorId`, `presente`

**Includes disponíveis:** `jogador`, `treino`, `jogo`

---

### Competições

```
GET    /competicoes       → listar
GET    /competicoes/:id   → buscar por ID
POST   /competicoes       → criar
PUT    /competicoes/:id   → atualizar
DELETE /competicoes/:id   → deletar
```

**Campos para criar:**
```json
{
  "nome": "Copa Bom de Bola 2026",
  "tipo": "Copa"
}
```

**Tipos:** `Copa` | `Liga`

**Filtros:** `nome`, `tipo`

**Includes disponíveis:** `jogos`, `times`

---

### Classificação

```
GET    /classificacoes       → listar
GET    /classificacoes/:id   → buscar por ID
POST   /classificacoes       → criar
PUT    /classificacoes/:id   → atualizar
DELETE /classificacoes/:id   → deletar
```

**Campos para criar:**
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

**Filtros:** `competicaoId`, `timeId`, `timeNome`

**Includes disponíveis:** `competicao`, `time`

---

### Material de Núcleo

```
GET    /material-nucleo       → listar
GET    /material-nucleo/:id   → buscar por ID
POST   /material-nucleo       → criar
PUT    /material-nucleo/:id   → atualizar
DELETE /material-nucleo/:id   → deletar
```

**Campos para criar:**
```json
{
  "tipoMaterial": "Bola oficial",
  "quantidade": 10,
  "dataRecebimento": "2026-05-01",
  "observacao": "Bolas para treino",
  "nucleo": { "id": 2 }
}
```

**Filtros:** `tipoMaterial`, `nucleoId`, `quantidade`, `dataRecebimento`

**Includes disponíveis:** `nucleo`

---

### Postagens (admin)

```
GET    /postagens       → listar todas (com filtros de status)
GET    /postagens/:id   → buscar por ID
POST   /postagens       → criar
PUT    /postagens/:id   → atualizar
DELETE /postagens/:id   → deletar
```

**Campos para criar:**
```json
{
  "titulo": "Campeonato Municipal começa em julho",
  "conteudo": "Texto completo da notícia em HTML ou markdown...",
  "resumo": "Breve descrição exibida na listagem",
  "imagemUrl": "https://res.cloudinary.com/...",
  "status": "publicado",
  "publicadoEm": "2026-07-01T10:00:00"
}
```

| Campo | Obrigatório | Descrição |
|---|---|---|
| `titulo` | ✅ | Mínimo 3 caracteres |
| `conteudo` | ✅ | HTML ou texto livre |
| `resumo` | ❌ | Máximo 300 caracteres |
| `imagemUrl` | ❌ | URL do Cloudinary (use `/upload/imagem` primeiro) |
| `status` | ❌ | `"rascunho"` (padrão) ou `"publicado"` |
| `publicadoEm` | ❌ | Data/hora de publicação (pode ser futura) |

**Filtros:** `status`, `busca` (pesquisa em título e resumo), `dataInicio`, `dataFim`

```
GET /postagens?status=publicado
GET /postagens?busca=campeonato
GET /postagens?dataInicio=2026-06-01&dataFim=2026-06-30
```

---

## Upload de arquivos

O upload é feito em **dois passos**: primeiro envia o arquivo, depois usa a URL retornada ao criar/atualizar o recurso.

As rotas de upload são **públicas** (não exigem token).

### Upload de imagem

```
POST /upload/imagem
Content-Type: multipart/form-data
```

| Campo do form | Tipo aceito | Tamanho máximo |
|---|---|---|
| `imagem` | JPEG, PNG, WebP, GIF | 5 MB |

**Resposta:**
```json
{
  "message": "Imagem enviada com sucesso",
  "data": {
    "url": "https://res.cloudinary.com/escalanet/imagens/abc123.webp",
    "publicId": "escalanet/imagens/abc123",
    "tipo": "imagem",
    "formato": "webp",
    "tamanhoBytes": 84320
  }
}
```

### Upload de documento

```
POST /upload/documento
Content-Type: multipart/form-data
```

| Campo do form | Tipo aceito | Tamanho máximo |
|---|---|---|
| `documento` | PDF, Word (.doc, .docx) | 10 MB |

### Upload de vídeo

```
POST /upload/video
Content-Type: multipart/form-data
```

| Campo do form | Tipo aceito | Tamanho máximo |
|---|---|---|
| `video` | MP4, MOV, AVI, WebM | 100 MB |

### Como usar no front (exemplo com fetch)

```javascript
// 1. Faz o upload da imagem
const formData = new FormData();
formData.append('imagem', arquivoSelecionado);

const uploadRes = await fetch('http://localhost:3000/upload/imagem', {
  method: 'POST',
  body: formData,
});
const { data } = await uploadRes.json();
const imagemUrl = data.url;

// 2. Cria a postagem com a URL da imagem
await fetch('http://localhost:3000/postagens', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    titulo: 'Nova notícia',
    conteudo: 'Texto da notícia...',
    imagemUrl,
    status: 'publicado',
  }),
});
```

---

## Fluxo de chamada e frequência

Para registrar presença em um treino:

```
1. POST /chamadas
   → { data, timeId, treinoId }
   → retorna { id: 14, ... }

2. Para cada jogador do time:
   POST /frequencia
   → { presente: true/false, jogadorId, chamadaId: 14, justificativa: null }
```

Para registrar presença em um jogo, mesmo fluxo mas com `jogoId` no lugar de `treinoId`.
