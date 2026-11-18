import { MigrationInterface, QueryRunner } from "typeorm";

export class EditandoChamadaHorario1793790009945 implements MigrationInterface {
    name = 'EditandoChamadaHorario1793790009945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD \`horario\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP COLUMN \`horario\``);
    }

}
