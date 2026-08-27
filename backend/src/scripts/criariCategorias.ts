import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

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

export async function criarCategorias() {
    try {
        await ScriptDataSource.initialize();

        const categoriaRepo = ScriptDataSource.getRepository('Categoria');

        const categorias = [
            { nome: 'Sub 13', idadeMaxima: 13, ativa: true },
            { nome: 'Sub 15', idadeMaxima: 15, ativa: true },
            { nome: 'Sub 17', idadeMaxima: 17, ativa: true },
            { nome: 'Sub 19', idadeMaxima: 19, ativa: true },
            { nome: 'Sub 21', idadeMaxima: 21, ativa: true },
        ];

        const saved = await categoriaRepo.save(categorias);

        console.log('✅ Categorias criadas com sucesso!');
        saved.forEach(categoria => {
            console.log(`📌 ${categoria.nome} - Idade Máxima: ${categoria.idadeMaxima}`);
        }
        );

        return saved;
    } catch (error) {
        console.error('❌ Erro ao criar categorias:', error);
        throw error;
    }
}

if (require.main === module) {
    criarCategorias()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}