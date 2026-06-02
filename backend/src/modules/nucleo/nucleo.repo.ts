import { DataSource } from "typeorm";
import { Nucleo } from "./Nucleo.model";
import { CriarNucleoDTO } from "./nucleo.schemas";

import { INucleoRepository } from "./nucleo.interfaces";




export function fazerNucleoRepo(dataSource: DataSource): INucleoRepository {
    const repo = dataSource.getRepository(Nucleo);

    return {
        async listar(pagina: number = 1, limite: number = 10) {
            const skip = (pagina - 1) * limite;

            const [data, total] = await repo.findAndCount({
                skip,
                take: limite,
                order: { id: 'ASC' }
            });
            return {data, total};          
        },
        async obterPorNome(nome: string) {
            const nucleo = await repo.findOne({ where: { nome } });
            return nucleo || null;
        },
        async obterPorId(id: number){
            const nucleo = await repo.findOne({ where: { id } });
            return nucleo || null;
        },

        async criar(data: CriarNucleoDTO) {
            const nucleo = repo.create(data);
            return repo.save(nucleo);
        },

        async atualizar(id: number, data: Partial<CriarNucleoDTO>) {
            const nucleo = await repo.findOne({ where: { id } });
            if (!nucleo) return null;
            repo.merge(nucleo, data as any);
            await repo.save(nucleo);
            return this.obterPorId(id);
        },
        async obterPorFiltros(pagina: number, limite: number, where: any) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                skip,
                take: limite,
                order: { id: 'ASC' },
            });
            return { data, total };
        },
        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        }
    };
}