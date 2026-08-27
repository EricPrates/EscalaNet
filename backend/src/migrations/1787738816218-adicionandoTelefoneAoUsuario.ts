import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoTelefoneAoUsuario1787738816218 implements MigrationInterface {
    name = 'AdicionandoTelefoneAoUsuario1787738816218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`materiais\` ADD \`nome\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD \`telefone\` varchar(20) NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP COLUMN \`telefone\``);
        await queryRunner.query(`ALTER TABLE \`materiais\` DROP COLUMN \`nome\``);
    }

}
