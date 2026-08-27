import { MigrationInterface, QueryRunner } from "typeorm";

export class NomeDaMigracao1785377464292 implements MigrationInterface {
    name = 'NomeDaMigracao1785377464292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`frequencia\` CHANGE \`chamada_id\` \`chamadaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`jogadores\` ADD \`responsavel\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`jogadores\` ADD \`cpf\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogadores\` DROP COLUMN \`cpf\``);
        await queryRunner.query(`ALTER TABLE \`jogadores\` DROP COLUMN \`responsavel\``);
        await queryRunner.query(`ALTER TABLE \`frequencia\` CHANGE \`chamadaId\` \`chamada_id\` int NULL`);
    }

}
