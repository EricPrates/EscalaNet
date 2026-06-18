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
            let finalWhere: FindOptionsWhere<Material> = where ? { ...where } : {};

            // Professor só vê materiais do próprio núcleo
            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                finalWhere = { ...finalWhere, nucleo: { id: usuario.nucleoVinculadoId } };
            }

            const { data, total } = await materialRepo.listar(pagina, limite, finalWhere, relations);
            return SchemaRespostaPaginada(SchemaMaterialResposta).parse({
                data,
                meta: montarPaginacao(pagina, limite, total),
            });
        },

        async obterPorId(id: number, relations?: FindOptionsRelations<Material>): Promise<RespostaMaterialDTO> {
            const usuario = authStorage.getStore();
            // Garante que nucleo sempre vem carregado para validação e resposta
            const material = await materialRepo.obterPorId(id, { ...relations, nucleo: true });
            if (!material) throw new AppError(404, 'Material não encontrado');

            if (usuario?.permissao === 'professor') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                if (material.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado: material pertence a outro núcleo');
                }
            }

            return SchemaMaterialResposta.parse(material);
        },

        async criar(data: CriarMaterialDTO): Promise<RespostaMaterialDTO> {
            const usuario = authStorage.getStore();

            // Professor só pode criar material para o próprio núcleo
            if (usuario && usuario.permissao !== 'admin') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                // Sobrescreve o núcleo com o do professor (ignora o que veio no body)
                data = { ...data, nucleo: { id: usuario.nucleoVinculadoId } };
            }

            if (!data.nucleo?.id) {
                throw new AppError(400, 'Informe o núcleo do material');
            }

            const material = await materialRepo.criar(data);
            return SchemaMaterialResposta.parse(material);
        },

        async atualizar(id: number, data: AtualizarMaterialDTO): Promise<RespostaMaterialDTO> {
            const usuario = authStorage.getStore();
            const materialExistente = await materialRepo.obterPorId(id, { nucleo: true });
            if (!materialExistente) throw new AppError(404, 'Material não encontrado');

            if (usuario && usuario.permissao !== 'admin') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                if (materialExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado: material pertence a outro núcleo');
                }
                // Professor não pode mover o material para outro núcleo
                if (data.nucleo && data.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Não é permitido mover material para outro núcleo');
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

            if (usuario && usuario.permissao !== 'admin') {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                if (materialExistente.nucleo.id !== usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Acesso negado: material pertence a outro núcleo');
                }
            }

            const deletado = await materialRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Material não encontrado');
            return deletado;
        },

        
    
    };
}
