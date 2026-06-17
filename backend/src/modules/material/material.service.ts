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
            const material = await materialRepo.obterPorId(id, { ...relations, nucleo: true });
            if (!material) throw new AppError(404, 'Material não encontrado');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (material.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a material fora do núcleo vinculado');
                }
            }
            return SchemaMaterialResposta.parse(material);
        },

        async criar(data: CriarMaterialDTO): Promise<RespostaMaterialDTO> {
            const usuario = authStorage.getStore();

            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                data.nucleoId = usuario.nucleoVinculadoId;
            } else if (!data.nucleoId) {
                throw new AppError(400, 'Núcleo é obrigatório');
            }

            const material = await materialRepo.criar(data);
            return SchemaMaterialResposta.parse(material);
        },

        async atualizar(id: number, data: AtualizarMaterialDTO): Promise<RespostaMaterialDTO> {
            const usuario = authStorage.getStore();
            const materialExistente = await materialRepo.obterPorId(id, { nucleo: true });
            if (!materialExistente) throw new AppError(404, 'Material não encontrado');

            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (materialExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a material fora do núcleo vinculado');
                }
            }

            const material = await materialRepo.atualizar(id, data);
            if (!material) throw new AppError(404, 'Material não encontrado');
            return SchemaMaterialResposta.parse(material);
        },

        async deletar(id: number): Promise<boolean> {
            const usuario = authStorage.getStore();
            const materialExistente = await materialRepo.obterPorId(id, { nucleo: true });
            if (!materialExistente) throw new AppError(404, 'Material não encontrado');

            if (usuario && usuario?.permissao !== "admin") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (materialExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado a material fora do núcleo vinculado');
                }
            }

            const deletado = await materialRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Material não encontrado');
            return deletado;
        },
    };
}