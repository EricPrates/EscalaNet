import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { montarPaginacao } from "../../shared/utils/montarPaginacao";
import { FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { IMaterialRepository, IMaterialService } from "./material.interfaces";

import { Material } from "./material.model";
import { AtualizarMaterialDTO, CriarMaterialDTO, RespostaMaterialDTO, SchemaMaterialResposta } from "./material.schemas";
import { authStorage } from "../../shared/utils/authStorage";


export function fazerMaterialNucleoService(materialRepo: IMaterialRepository): IMaterialService {
    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Material>, relations?: FindOptionsRelations<Material>) {
            const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleo: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await materialRepo.listar(pagina, limite, finalWhere, relations);
            return SchemaRespostaPaginada(SchemaMaterialResposta).parse({
                data: data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Material>): Promise<RespostaMaterialDTO> {
            const usuario = authStorage.getStore();
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a frequência fora do núcleo vinculado');
                }
            }
            const material = await materialRepo.obterPorId(id, relations);
            if (!material) throw new AppError(404, 'Material não encontrado');
            return SchemaMaterialResposta.parse(material);
        },

        async criar(data: CriarMaterialDTO): Promise<RespostaMaterialDTO> {
            const material = await materialRepo.criar(data);
            return SchemaMaterialResposta.parse(material);
        },

        async atualizar(id: number, data: AtualizarMaterialDTO): Promise<RespostaMaterialDTO> {
            const material = await materialRepo.atualizar(id, data);
            if (!material) throw new AppError(404, 'Material não encontrado');
            return SchemaMaterialResposta.parse(material);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await materialRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Material não encontrado');
            return deletado;
        },
    };
}