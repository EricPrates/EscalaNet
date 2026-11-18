import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoSexoCategriasEAJogadores1790621161386 implements MigrationInterface {
    name = 'AdicionandoSexoCategriasEAJogadores1790621161386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`times\` DROP FOREIGN KEY \`FK_90b779214fba1edc252e01dfcaa\``);
        await queryRunner.query(`DROP INDEX \`IDX_90b779214fba1edc252e01dfca\` ON \`times\``);
        await queryRunner.query(`CREATE TABLE \`time_categorias\` (\`time_id\` int NOT NULL, \`categoria_id\` int NOT NULL, INDEX \`IDX_11883cb7281d60368968d0f3b6\` (\`time_id\`), INDEX \`IDX_7bfe502e340165ec7e16337202\` (\`categoria_id\`), PRIMARY KEY (\`time_id\`, \`categoria_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`times\` DROP COLUMN \`categoria_id\``);
        await queryRunner.query(`ALTER TABLE \`jogadores\` ADD \`sexo\` varchar(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`time_categorias\` ADD CONSTRAINT \`FK_11883cb7281d60368968d0f3b6d\` FOREIGN KEY (\`time_id\`) REFERENCES \`times\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`time_categorias\` ADD CONSTRAINT \`FK_7bfe502e340165ec7e163372023\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`time_categorias\` DROP FOREIGN KEY \`FK_7bfe502e340165ec7e163372023\``);
        await queryRunner.query(`ALTER TABLE \`time_categorias\` DROP FOREIGN KEY \`FK_11883cb7281d60368968d0f3b6d\``);
        await queryRunner.query(`ALTER TABLE \`jogadores\` DROP COLUMN \`sexo\``);
        await queryRunner.query(`ALTER TABLE \`times\` ADD \`categoria_id\` int NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_7bfe502e340165ec7e16337202\` ON \`time_categorias\``);
        await queryRunner.query(`DROP INDEX \`IDX_11883cb7281d60368968d0f3b6\` ON \`time_categorias\``);
        await queryRunner.query(`DROP TABLE \`time_categorias\``);
        await queryRunner.query(`CREATE INDEX \`IDX_90b779214fba1edc252e01dfca\` ON \`times\` (\`categoria_id\`)`);
        await queryRunner.query(`ALTER TABLE \`times\` ADD CONSTRAINT \`FK_90b779214fba1edc252e01dfcaa\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
