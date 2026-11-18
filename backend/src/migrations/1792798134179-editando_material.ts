    import { MigrationInterface, QueryRunner } from "typeorm";

export class EditandoMaterial1792798134179 implements MigrationInterface {
    name = 'EditandoMaterial1792798134179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`materiais\` ADD \`status\` enum ('Excelente', 'Necessita Manutenção', 'Descartado') NOT NULL DEFAULT 'Excelente'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`materiais\` DROP COLUMN \`status\``);
    }

}
