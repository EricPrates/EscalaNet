import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionarTabelaDeEventos1786586273329 implements MigrationInterface {
    name = 'AdicionarTabelaDeEventos1786586273329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`eventos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`descricao\` varchar(1000) NULL, \`data\` date NOT NULL, \`hora\` time NOT NULL, \`local\` varchar(255) NULL, \`nucleoId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`eventos_usuarios\` (\`evento_id\` int NOT NULL, \`usuario_id\` int NOT NULL, INDEX \`IDX_73c51ff5e8bf8db59649aebd9b\` (\`evento_id\`), INDEX \`IDX_a9eb4d0da1d9ae96a7c09adf13\` (\`usuario_id\`), PRIMARY KEY (\`evento_id\`, \`usuario_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`eventos\` ADD CONSTRAINT \`FK_847530c625a90d17abc66fc05a1\` FOREIGN KEY (\`nucleoId\`) REFERENCES \`nucleos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`eventos_usuarios\` ADD CONSTRAINT \`FK_73c51ff5e8bf8db59649aebd9be\` FOREIGN KEY (\`evento_id\`) REFERENCES \`eventos\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`eventos_usuarios\` ADD CONSTRAINT \`FK_a9eb4d0da1d9ae96a7c09adf137\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`eventos_usuarios\` DROP FOREIGN KEY \`FK_a9eb4d0da1d9ae96a7c09adf137\``);
        await queryRunner.query(`ALTER TABLE \`eventos_usuarios\` DROP FOREIGN KEY \`FK_73c51ff5e8bf8db59649aebd9be\``);
        await queryRunner.query(`ALTER TABLE \`eventos\` DROP FOREIGN KEY \`FK_847530c625a90d17abc66fc05a1\``);
        await queryRunner.query(`DROP INDEX \`IDX_a9eb4d0da1d9ae96a7c09adf13\` ON \`eventos_usuarios\``);
        await queryRunner.query(`DROP INDEX \`IDX_73c51ff5e8bf8db59649aebd9b\` ON \`eventos_usuarios\``);
        await queryRunner.query(`DROP TABLE \`eventos_usuarios\``);
        await queryRunner.query(`DROP TABLE \`eventos\``);
    }

}
