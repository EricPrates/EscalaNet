import { DataSource, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { Material } from "./Material";
import { CriarMaterialDTO } from "./materialNucleo.schemas";
import { IMaterialNucleoRepository } from "./materialNucleo.interfaces";

export function fazerMaterialNucleoRepo(dataSource: DataSource): IMaterialNucleoRepository {
    const repo = dataSource.getRepository(Material);

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Material>, relations?: FindOptionsRelations<Material>, select?: FindOptionsSelect<Material>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                select,
                skip,
                take: limite,
                order: { dataRecebimento: 'DESC' },
            });
            return { data, total };
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Material>, select?: FindOptionsSelect<Material>) {
            return await repo.findOne({
                where: { id },
                relations,
                select,
            }) || null;
        },

        async criar(data: CriarMaterialDTO) {
            const material = repo.create(data);
            return repo.save(material);
        },

        async atualizar(id: number, data: Partial<CriarMaterialDTO>) {
            const material = await repo.findOne({ where: { id } });
            if (!material) return null;
            repo.merge(material, data);
            await repo.save(material);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },
    };
}