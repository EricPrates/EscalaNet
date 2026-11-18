import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoSexoCategoria1790631465065 implements MigrationInterface {
    name = 'AdicionandoSexoCategoria1790631465065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categorias\` ADD \`sexo\` varchar(1) NULL`);
        await queryRunner.query(`ALTER TABLE \`jogadores\` CHANGE \`sexo\` \`sexo\` varchar(1) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogadores\` CHANGE \`sexo\` \`sexo\` varchar(1) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categorias\` DROP COLUMN \`sexo\``);
    }

}
