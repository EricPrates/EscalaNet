import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterandoFinalizadoPStatusNoJogo1789406639578 implements MigrationInterface {
    name = 'AlterandoFinalizadoPStatusNoJogo1789406639578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_727ad87a0b372c7a3e466c1adb\` ON \`jogadores\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` CHANGE \`finalizado\` \`status\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`competicoes\` ADD \`status\` varchar(255) NULL DEFAULT 'Em Andamento'`);
        await queryRunner.query(`ALTER TABLE \`competicoes\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`competicoes\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`status\` enum ('AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO') NOT NULL DEFAULT 'AGENDADO'`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`telefone\` \`telefone\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios\` CHANGE \`telefone\` \`telefone\` varchar(20) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`status\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`competicoes\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`competicoes\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`competicoes\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` CHANGE \`status\` \`finalizado\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX \`IDX_727ad87a0b372c7a3e466c1adb\` ON \`jogadores\` (\`telefone\`)`);
    }

}
