import { MigrationInterface, QueryRunner } from "typeorm";

export class EditandoMaterial1792800734216 implements MigrationInterface {
    name = 'EditandoMaterial1792800734216'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`materiais\` CHANGE \`status\` \`status\` enum ('Bom', 'Manutencao', 'Descartado') NOT NULL DEFAULT 'Bom'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`materiais\` CHANGE \`status\` \`status\` enum ('Excelente', 'Necessita Manutenção', 'Descartado') NOT NULL DEFAULT 'Excelente'`);
    }

}
