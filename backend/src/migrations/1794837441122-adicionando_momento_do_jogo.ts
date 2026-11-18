import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoMomentoDoJogo1794837441122 implements MigrationInterface {
    name = 'AdicionandoMomentoDoJogo1794837441122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` CHANGE \`minuto\` \`momento\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` DROP COLUMN \`momento\``);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` ADD \`momento\` varchar(6) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` DROP COLUMN \`momento\``);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` ADD \`momento\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`eventos_jogo\` CHANGE \`momento\` \`minuto\` int NOT NULL`);
    }

}
