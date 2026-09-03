import { DataSource, DeepPartial, FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { IUsuarioRepository } from "./usuario.interfaces";
import { Usuario } from "./Usuario.model";
import { CriarUsuarioDTO } from './usuario.schemas';



export function fazerUsuarioRepo(dataSource: DataSource): IUsuarioRepository {
    const repo = dataSource.getRepository(Usuario);

    return {

        async listar(pagina: number = 1, limite: number = 10, where?: FindOptionsWhere<Usuario>, relations?: FindOptionsRelations<Usuario>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,      
                relations,  
                skip,
                take: limite,
                order: { id: 'ASC' },
               
            });
            return { data, total };
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Usuario>) {
            const defaultRelations = { nucleoVinculado: true };
            return await repo.findOne({
                where: { id },
                relations: { ...defaultRelations, ...relations }
            }) || null;
        },

        async obterPorEmail(email: string) {
            const defaultRelations = { nucleoVinculado: true };
            return await repo.findOne({
                where: { email },
                relations: { ...defaultRelations } // combina
            }) || null;
        },

        async criar(data: CriarUsuarioDTO): Promise<Usuario> {
            const usuario = repo.create(data as DeepPartial<Usuario>);
            return repo.save(usuario);
        },



        async atualizar(id: number, data: CriarUsuarioDTO): Promise<Usuario | null> {
            const usuario = await repo.findOne({ where: { id } });
            if (!usuario) return null;
            repo.merge(usuario, data);
            await repo.save(usuario);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    };
}