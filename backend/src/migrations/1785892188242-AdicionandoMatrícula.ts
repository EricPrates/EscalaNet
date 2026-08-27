import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoMatrícula1785892188242 implements MigrationInterface {
    name = 'AdicionandoMatrícula1785892188242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogadores\` ADD \`matricula\` varchar(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogadores\` DROP COLUMN \`matricula\``);
    }

}
