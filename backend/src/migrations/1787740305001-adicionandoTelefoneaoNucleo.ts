import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoTelefoneaoNucleo1787740305001 implements MigrationInterface {
    name = 'AdicionandoTelefoneaoNucleo1787740305001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nucleos\` ADD \`telefone\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nucleos\` DROP COLUMN \`telefone\``);
    }

}
