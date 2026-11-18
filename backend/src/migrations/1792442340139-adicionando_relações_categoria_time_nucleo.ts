import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoRelaçõesCategoriaTimeNucleo1792442340139 implements MigrationInterface {
    name = 'AdicionandoRelaçõesCategoriaTimeNucleo1792442340139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`time_categorias\` DROP FOREIGN KEY \`FK_7bfe502e340165ec7e163372023\``);
        await queryRunner.query(`ALTER TABLE \`time_categorias\` ADD CONSTRAINT \`FK_7bfe502e340165ec7e163372023\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`time_categorias\` DROP FOREIGN KEY \`FK_7bfe502e340165ec7e163372023\``);
        await queryRunner.query(`ALTER TABLE \`time_categorias\` ADD CONSTRAINT \`FK_7bfe502e340165ec7e163372023\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
