import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class RemoverNucleoRecebedor1785282486188 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.dropForeignKey('nucleos', 'FK_b858abae00c2d3ba2dfee0c80c0');
    // 2. Remove a coluna
        await queryRunner.dropColumn('nucleos', 'nucleo_recebedor_id');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('nucleos', new TableColumn({
        name: 'nucleo_recebedor_id',
        type: 'int',
        isNullable: true,
    }));
    // Recria a FK (o nome pode ser recriado automaticamente, mas para consistência)
    await queryRunner.createForeignKey('nucleos', new TableForeignKey({
        columnNames: ['nucleo_recebedor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'nucleos',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
    }));
    }

}
