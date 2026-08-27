import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionandoJoinColumChamadaIdEMFrequencia1786578629848 implements MigrationInterface {
    name = 'AdicionandoJoinColumChamadaIdEMFrequencia1786578629848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`frequencia\` DROP FOREIGN KEY \`FK_6ae70af21009335bbc68afd9bdc\``);
        await queryRunner.query(`ALTER TABLE \`frequencia\` CHANGE \`chamadaId\` \`chamada_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`frequencia\` ADD CONSTRAINT \`FK_e438b0657269913412016cf4bac\` FOREIGN KEY (\`chamada_id\`) REFERENCES \`chamada\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`frequencia\` DROP FOREIGN KEY \`FK_e438b0657269913412016cf4bac\``);
        await queryRunner.query(`ALTER TABLE \`frequencia\` CHANGE \`chamada_id\` \`chamadaId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`frequencia\` ADD CONSTRAINT \`FK_6ae70af21009335bbc68afd9bdc\` FOREIGN KEY (\`chamadaId\`) REFERENCES \`chamada\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
