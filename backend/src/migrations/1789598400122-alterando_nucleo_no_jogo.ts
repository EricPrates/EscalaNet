import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterandoNucleoNoJogo1789598400122 implements MigrationInterface {
    name = 'AlterandoNucleoNoJogo1789598400122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD \`nucleo_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`jogos\` ADD CONSTRAINT \`FK_0578cbe257fb9b60e87ad94222b\` FOREIGN KEY (\`nucleo_id\`) REFERENCES \`nucleos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP FOREIGN KEY \`FK_0578cbe257fb9b60e87ad94222b\``);
        await queryRunner.query(`ALTER TABLE \`jogos\` DROP COLUMN \`nucleo_id\``);
    }

}
