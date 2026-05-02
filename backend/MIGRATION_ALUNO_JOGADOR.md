# ⚠️ Instruções para Executar a Migration: Aluno → Jogador

## Mudanças no Banco de Dados

Todas as referências a "aluno" no banco foram renomeadas para "jogador":

### Alterações Realizadas:

✅ **Tabelas:**
- `alunos` → `jogadores`
- `treino_alunos` → `treino_jogadores`

✅ **Colunas:**
- `frequencia.aluno_id` → `frequencia.jogador_id`
- `eventos_jogo.aluno_envolvido_id` → `eventos_jogo.jogador_envolvido_id`
- `treino_jogadores.aluno_id` → `treino_jogadores.jogador_id`

✅ **Chaves Estrangeiras:**
- Todas as referências de constraint renomeadas

✅ **Índices:**
- Todos os índices renomeados para refletir os novos nomes

---

## Como Executar a Migration

### Opção 1: Usando TypeORM (Recomendado)

Execute o comando para rodar a migration automática:

```bash
npm run typeorm migration:run
```

Ou com a CLI do TypeORM:

```bash
npx typeorm-cli migration:run -d dist/data-source.js
```

### Opção 2: Executar SQL Manualmente

Se preferir executar direto no banco de dados (PostgreSQL):

1. Abra seu cliente SQL (pgAdmin, DBeaver, etc.)
2. Abra o arquivo: `scripts/rename_aluno_to_jogador.sql`
3. Copie e execute todo o script no seu banco de dados

Ou via terminal:

```bash
psql -U seu_usuario -d seu_banco < scripts/rename_aluno_to_jogador.sql
```

### Opção 3: Executar SQL Manualmente (SQLite)

Se está usando SQLite, alguns comandos podem precisar ajuste:

```bash
sqlite3 seu_banco.db < scripts/rename_aluno_to_jogador.sql
```

---

## Verificação Pós-Migration

Após executar a migration, verifique se tudo foi renomeado corretamente:

```sql
-- Listar todas as tabelas relacionadas a jogador
SELECT table_name FROM information_schema.tables 
WHERE table_name LIKE '%jogador%' OR table_name LIKE '%treino%jogador%';

-- Listar colunas na tabela frequencia
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'frequencia' AND column_name LIKE '%jogador%';

-- Listar colunas na tabela eventos_jogo
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'eventos_jogo' AND column_name LIKE '%jogador%';
```

---

## ⚠️ Importante: Backup Primeiro!

**ANTES de executar qualquer mudança no banco:**

```bash
# Criar backup do banco de dados
pg_dump -U seu_usuario seu_banco > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## Reversão (Se Necessário)

Se algo deu errado, você pode reverter a migration:

```bash
npm run typeorm migration:revert
```

Ou restaurar do backup:

```bash
psql -U seu_usuario seu_banco < backup_YYYYMMDD_HHMMSS.sql
```

---

## Próximos Passos

1. ✅ Execute a migration
2. ✅ Teste as APIs de Jogador, Frequência e Treino
3. ✅ Verifique que as buscas e inserções funcionam corretamente
4. ✅ Comita as mudanças no git

Qualquer dúvida ou erro, verifique os logs do TypeORM! 🚀
