import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { IMaterialNucleoRepository, IMaterialNucleoService } from "./materialNucleo.interfaces";
import { Material } from "./Material";
import { AtualizarMaterialDTO, CriarMaterialDTO, FiltrosMaterialDTO, RespostaMaterialDTO, SchemaMaterialResposta } from "./materialNucleo.schemas";

function mapearMaterial(material: any): RespostaMaterialDTO {
    return SchemaMaterialResposta.parse({
        id: material.id,
        quantidade: material.quantidade,
        dataRecebimento: material.dataRecebimento,
        observacao: material.observacao,
        tipoMaterial: material.tipoMaterial,
        nucleo: material.nucleo ? { id: material.nucleo.id, nome: material.nucleo.nome } : undefined,
        createdAt: material.createdAt,
        updatedAt: material.updatedAt,
    });
}

export function fazerMaterialNucleoService(materialRepo: IMaterialNucleoRepository): IMaterialNucleoService {
    return {
        async listar(pagina: number, limite: number, where?: FiltrosMaterialDTO, relations?: FindOptionsRelations<Material>) {
            const { data, total } = await materialRepo.listar(pagina, limite, where as FindOptionsWhere<Material> | undefined, relations);
            return SchemaRespostaPaginada(SchemaMaterialResposta).parse({
                data: data.map(mapearMaterial),
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Material>): Promise<RespostaMaterialDTO> {
            const material = await materialRepo.obterPorId(id, relations);
            if (!material) throw new AppError(404, 'Material não encontrado');
            return mapearMaterial(material);
        },

        async criar(data: CriarMaterialDTO): Promise<RespostaMaterialDTO> {
            const material = await materialRepo.criar(data);
            return mapearMaterial(material);
        },

        async atualizar(id: number, data: AtualizarMaterialDTO): Promise<RespostaMaterialDTO> {
            const material = await materialRepo.atualizar(id, data);
            if (!material) throw new AppError(404, 'Material não encontrado');
            return mapearMaterial(material);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await materialRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Material não encontrado');
            return deletado;
        },
    };
}