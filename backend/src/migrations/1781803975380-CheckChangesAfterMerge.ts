import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckChangesAfterMerge1781803975380 implements MigrationInterface {
    name = 'CheckChangesAfterMerge1781803975380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`materiais\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantidade\` int NOT NULL, \`data_recebimento\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`observacao\` text NULL, \`tipoMaterial\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`nucleo_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` ADD \`nucleo_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD \`nucleo_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`frequencia\` ADD \`nucleo_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`jogadores\` ADD \`nucleo_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`treinos\` ADD \`time_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`chave\` varchar(50) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_ed2838a6b6c8cd4d3ca27d0028\` ON \`eventos_jogo\` (\`nucleo_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_b23aca58d796b5d3af80135631\` ON \`frequencia\` (\`nucleo_id\`)`);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` ADD CONSTRAINT \`FK_ed2838a6b6c8cd4d3ca27d00284\` FOREIGN KEY (\`nucleo_id\`) REFERENCES \`nucleos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD CONSTRAINT \`FK_fc7e6354a0ab46bd7fb517ecb90\` FOREIGN KEY (\`nucleo_id\`) REFERENCES \`nucleos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`frequencia\` ADD CONSTRAINT \`FK_b23aca58d796b5d3af801356311\` FOREIGN KEY (\`nucleo_id\`) REFERENCES \`nucleos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`jogadores\` ADD CONSTRAINT \`FK_45010bd0a241af54eb8c33e4d57\` FOREIGN KEY (\`nucleo_id\`) REFERENCES \`nucleos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`treinos\` ADD CONSTRAINT \`FK_54257435f981d78be8b190a2346\` FOREIGN KEY (\`time_id\`) REFERENCES \`times\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`materiais\` ADD CONSTRAINT \`FK_034134692ba9d9da8a15c7dee9c\` FOREIGN KEY (\`nucleo_id\`) REFERENCES \`nucleos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`materiais\` DROP FOREIGN KEY \`FK_034134692ba9d9da8a15c7dee9c\``);
        await queryRunner.query(`ALTER TABLE \`treinos\` DROP FOREIGN KEY \`FK_54257435f981d78be8b190a2346\``);
        await queryRunner.query(`ALTER TABLE \`jogadores\` DROP FOREIGN KEY \`FK_45010bd0a241af54eb8c33e4d57\``);
        await queryRunner.query(`ALTER TABLE \`frequencia\` DROP FOREIGN KEY \`FK_b23aca58d796b5d3af801356311\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP FOREIGN KEY \`FK_fc7e6354a0ab46bd7fb517ecb90\``);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` DROP FOREIGN KEY \`FK_ed2838a6b6c8cd4d3ca27d00284\``);
        await queryRunner.query(`DROP INDEX \`IDX_b23aca58d796b5d3af80135631\` ON \`frequencia\``);
        await queryRunner.query(`DROP INDEX \`IDX_ed2838a6b6c8cd4d3ca27d0028\` ON \`eventos_jogo\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`chave\``);
        await queryRunner.query(`ALTER TABLE \`treinos\` DROP COLUMN \`time_id\``);
        await queryRunner.query(`ALTER TABLE \`jogadores\` DROP COLUMN \`nucleo_id\``);
        await queryRunner.query(`ALTER TABLE \`frequencia\` DROP COLUMN \`nucleo_id\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP COLUMN \`nucleo_id\``);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` DROP COLUMN \`nucleo_id\``);
        await queryRunner.query(`DROP TABLE \`materiais\``);
    }

}
