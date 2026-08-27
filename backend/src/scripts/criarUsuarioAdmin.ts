// src/scripts/criarUsuarioAdmin.ts
import bcrypt from 'bcrypt';
import { DataSource } from "typeorm";
import { Usuario } from "../modules/usuario/Usuario.model";
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
    entities: [path.resolve(__dirname, '../modules/**/*.model.{js,ts}')],
    migrations: [],
    synchronize: false,
});

export async function criarUsuarioAdmin() {
    try {
        await ScriptDataSource.initialize();

    
        const usuarioRepo = ScriptDataSource.getRepository(Usuario);

        const existente = await usuarioRepo.findOne({
            where: { email: 'admin@example.com' },
        });

        if (existente) {
            console.log('⚠️ Usuário admin já existe.');
            return existente;
        }

        const senhaHash = await bcrypt.hash('admin123', 10);

        const admin = usuarioRepo.create({
            nome: 'Admin',
            email: 'admin@example.com',
            senha: senhaHash,
            permissao: 'admin',
            nucleoVinculado: null,
        });

        const saved = await usuarioRepo.save(admin);
        console.log('✅ Usuário admin criado com sucesso!');
        console.log('📧 Email: admin@example.com');
        console.log('🔑 Senha: admin123');
        return saved;
    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error);
        throw error;
    } finally {
        await ScriptDataSource.destroy();
    }
}

if (require.main === module) {
    criarUsuarioAdmin();
}