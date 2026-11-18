import { MigrationInterface, QueryRunner } from "typeorm";

export class EditandoCategoriasEmJogadores1793875743474 implements MigrationInterface {
    name = 'EditandoCategoriasEmJogadores1793875743474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categoria_jogadores\` (\`categoria_id\` int NOT NULL, \`jogador_id\` int NOT NULL, INDEX \`IDX_0c074cfed0c4d450444fdcee8b\` (\`categoria_id\`), INDEX \`IDX_9ce05f0e97aa0a867386bb9b6f\` (\`jogador_id\`), PRIMARY KEY (\`categoria_id\`, \`jogador_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`categoria_jogadores\` ADD CONSTRAINT \`FK_0c074cfed0c4d450444fdcee8ba\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`categoria_jogadores\` ADD CONSTRAINT \`FK_9ce05f0e97aa0a867386bb9b6fb\` FOREIGN KEY (\`jogador_id\`) REFERENCES \`jogadores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categoria_jogadores\` DROP FOREIGN KEY \`FK_9ce05f0e97aa0a867386bb9b6fb\``);
        await queryRunner.query(`ALTER TABLE \`categoria_jogadores\` DROP FOREIGN KEY \`FK_0c074cfed0c4d450444fdcee8ba\``);
        await queryRunner.query(`DROP INDEX \`IDX_9ce05f0e97aa0a867386bb9b6f\` ON \`categoria_jogadores\``);
        await queryRunner.query(`DROP INDEX \`IDX_0c074cfed0c4d450444fdcee8b\` ON \`categoria_jogadores\``);
        await queryRunner.query(`DROP TABLE \`categoria_jogadores\``);
    }

}
