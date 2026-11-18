import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoHorariosEmJogo1794349657220 implements MigrationInterface {
    name = 'AdicionandoHorariosEmJogo1794349657220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`horario\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`horario\``);
    }

}
