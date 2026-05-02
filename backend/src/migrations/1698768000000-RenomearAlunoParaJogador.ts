import { MigrationInterface, QueryRunner } from "typeorm";

export class RenomearAlunoParaJogador1698768000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Renomear tabela alunos para jogadores
        await queryRunner.renameTable("alunos", "jogadores");

        // Renomear colunas em frequencia
        await queryRunner.renameColumn("frequencia", "aluno_id", "jogador_id");

        // Renomear colunas em eventos_jogo
        await queryRunner.renameColumn("eventos_jogo", "aluno_envolvido_id", "jogador_envolvido_id");

        // Renomear tabela de junção treino_alunos para treino_jogadores
        await queryRunner.renameTable("treino_alunos", "treino_jogadores");

        // Renomear coluna na tabela de junção
        await queryRunner.renameColumn("treino_jogadores", "aluno_id", "jogador_id");

        // Atualizar constrains de chave estrangeira em frequencia
        await queryRunner.query(`
            ALTER TABLE frequencia 
            DROP CONSTRAINT IF EXISTS "FK_frequencia_aluno_id",
            ADD CONSTRAINT "FK_frequencia_jogador_id" 
            FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id")
        `);

        // Atualizar constrains de chave estrangeira em eventos_jogo
        await queryRunner.query(`
            ALTER TABLE eventos_jogo 
            DROP CONSTRAINT IF EXISTS "FK_eventos_jogo_aluno_envolvido_id",
            ADD CONSTRAINT "FK_eventos_jogo_jogador_envolvido_id" 
            FOREIGN KEY ("jogador_envolvido_id") REFERENCES "jogadores"("id")
        `);

        // Atualizar constrains de chave estrangeira em times
        await queryRunner.query(`
            ALTER TABLE times 
            DROP CONSTRAINT IF EXISTS "FK_times_alunos",
            ADD CONSTRAINT "FK_times_jogadores" 
            FOREIGN KEY ("time_id") REFERENCES "jogadores"("id")
        `);

        // Atualizar constrains de chave estrangeira na tabela de junção
        await queryRunner.query(`
            ALTER TABLE treino_jogadores 
            DROP CONSTRAINT IF EXISTS "FK_treino_alunos_aluno_id",
            ADD CONSTRAINT "FK_treino_jogadores_jogador_id" 
            FOREIGN KEY ("jogador_id") REFERENCES "jogadores"("id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter mudanças
        await queryRunner.renameTable("jogadores", "alunos");
        await queryRunner.renameColumn("frequencia", "jogador_id", "aluno_id");
        await queryRunner.renameColumn("eventos_jogo", "jogador_envolvido_id", "aluno_envolvido_id");
        await queryRunner.renameTable("treino_jogadores", "treino_alunos");
        await queryRunner.renameColumn("treino_alunos", "jogador_id", "aluno_id");

        // Restaurar constrains
        await queryRunner.query(`
            ALTER TABLE frequencia 
            DROP CONSTRAINT IF EXISTS "FK_frequencia_jogador_id",
            ADD CONSTRAINT "FK_frequencia_aluno_id" 
            FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id")
        `);

        await queryRunner.query(`
            ALTER TABLE eventos_jogo 
            DROP CONSTRAINT IF EXISTS "FK_eventos_jogo_jogador_envolvido_id",
            ADD CONSTRAINT "FK_eventos_jogo_aluno_envolvido_id" 
            FOREIGN KEY ("aluno_envolvido_id") REFERENCES "alunos"("id")
        `);

        await queryRunner.query(`
            ALTER TABLE times 
            DROP CONSTRAINT IF EXISTS "FK_times_jogadores",
            ADD CONSTRAINT "FK_times_alunos" 
            FOREIGN KEY ("time_id") REFERENCES "alunos"("id")
        `);

        await queryRunner.query(`
            ALTER TABLE treino_alunos 
            DROP CONSTRAINT IF EXISTS "FK_treino_jogadores_jogador_id",
            ADD CONSTRAINT "FK_treino_alunos_aluno_id" 
            FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id")
        `);
    }
}
