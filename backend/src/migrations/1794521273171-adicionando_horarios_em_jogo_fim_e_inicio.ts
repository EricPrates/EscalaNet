import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoHorariosEmJogoFimEInicio1794521273171 implements MigrationInterface {
    name = 'AdicionandoHorariosEmJogoFimEInicio1794521273171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`horario\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`horarioInicio\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`horarioFim\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`horarioFim\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`horarioInicio\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`horario\` varchar(255) NULL`);
    }

}
