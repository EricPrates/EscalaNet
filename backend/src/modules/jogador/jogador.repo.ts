import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Jogador } from "./jogador.model";
import { CriarJogadorDTO } from "./jogador.schemas";
import { IJogadorRepository } from "./jogador.interfaces";




export function fazerJogadorRepo(dataSource: DataSource): IJogadorRepository {
    const repo = dataSource.getRepository(Jogador);

  

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Jogador>, relations?: FindOptionsRelations<Jogador>, select?: FindOptionsSelect<Jogador>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                select,
                skip,
                take: limite,
                order: { nome: 'ASC' },
            });
            return { data, total };
        },
      
        async obterPorId(id: number, relations?: FindOptionsRelations<Jogador>, select?: FindOptionsSelect<Jogador>) {
            return await repo.findOne({
                where: { id },
                relations,
                select,
            }) || null;
        },

        async criar(data: CriarJogadorDTO) {
            const jogador = repo.create(data);
            return repo.save(jogador);
        },

        async atualizar(id: number, data: Partial<CriarJogadorDTO>) {
            const jogador = await repo.findOne({ where: { id } });
            if (!jogador) return null;
            repo.merge(jogador, data);
            await repo.save(jogador);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}
