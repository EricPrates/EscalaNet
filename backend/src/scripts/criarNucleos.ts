import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";
import { Nucleo } from "../modules/nucleo/Nucleo.model";

dotenv.config();
export const ScriptDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST_TEST,
    port: parseInt(process.env.DB_PORT_TEST || "3306"),
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASS_TEST,
    database: process.env.DB_NAME_TEST,
    synchronize: false,
    entities: [path.resolve(__dirname, '../modules/**/*.model.{js,ts}')],
    migrations: [],
});

export async function criarNucleos() {
    try {
        await ScriptDataSource.initialize();
    
        const nucleoRepo = ScriptDataSource.getRepository(Nucleo);

        const nucleos = [
            { nome: 'Núcleo 1', endereco: 'Endereço A' },
            { nome: 'Núcleo 2', endereco: 'Endereço B' },
            { nome: 'Núcleo 3', endereco: 'Endereço C' },
            { nome: 'Núcleo 4', endereco: 'Endereço D' },
            { nome: 'Núcleo 5', endereco: 'Endereço E' },
            { nome: 'Núcleo 6', endereco: 'Endereço F' },
            { nome: 'Núcleo 7', endereco: 'Endereço G' },
            { nome: 'Núcleo 8', endereco: 'Endereço H' },
            { nome: 'Núcleo 9', endereco: 'Endereço I' },
            { nome: 'Núcleo 10', endereco: 'Endereço J' },
            { nome: 'Núcleo 11', endereco: 'Endereço K' },
        ];
        const saved = await nucleoRepo.save(nucleos);

        console.log('✅ Núcleos criados com sucesso!');
        saved.forEach(nucleo => {
            console.log(`📌 ${nucleo.nome} - ${nucleo.endereco}`);
        });

        return saved;

    } catch (error) {
        console.error('❌ Erro ao criar núcleos:', error);
        throw error;
    }
}

if (require.main === module) {
    criarNucleos()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}