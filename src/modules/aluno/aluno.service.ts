import { FindOptionsWhere, In } from 'typeorm';
import { AppError } from '../../shared/utils/AppError';
import { getContext } from '../../shared/utils/authStorage';
import { SchemaRespostaPaginada } from '../../shared/utils/listas.schema';
import { IAlunoRepository, IAlunoService } from './aluno.interfaces';
import { Aluno } from './Aluno.model';
import { CriarAlunoDTO, AtualizarAlunoDTO, RespostaAlunoDTO, SchemaAlunoResposta } from './aluno.schema';
export const fazerAlunoService = (alunoRepo: IAlunoRepository): IAlunoService => {
    return {
        async listar(pagina: number, limite: number) {
            const contexto = getContext();
            const permissao = contexto!.permissao;
            let where: FindOptionsWhere<Aluno> = {};

            if (permissao === 'coordenador' || permissao === 'professor' || permissao === 'auxiliar') {
                where.nucleo = { id: contexto!.nucleoVinculado! };
            }
                else if (permissao === 'admin') {
                    where = {};
                }

            const { data, total } = await alunoRepo.listar(pagina, limite, where);
            const dataValidada = SchemaAlunoResposta.array().parse(data);
            const totalPaginas = Math.ceil(total / limite);

            return SchemaRespostaPaginada(SchemaAlunoResposta).parse({
                data: dataValidada,
                meta: { pagina, limite, total, totalPaginas }
            });
        },

        async obterPorId(id: number) {
            const aluno = await alunoRepo.obterPorId(id);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return SchemaAlunoResposta.parse(aluno);
        },

        async criar(data: CriarAlunoDTO) {
            // Verifica se o usuário tem permissão para criar no núcleo informado
            const contexto = getContext();
            if (contexto?.permissao !== 'admin') {
                const nucleoPermitido = contexto?.permissao === 'coordenador'
                    ? contexto.nucleoCoordenado?.id
                    : contexto?.nucleoVinculado?.id;
                if (data.nucleoId !== nucleoPermitido) {
                    throw new AppError(403, 'Você só pode criar alunos para o seu núcleo');
                }
            }

            const aluno = await alunoRepo.criar({
                ...data,
                nucleo: { id: data.nucleoId },
                categoria: data.categoriaId ? { id: data.categoriaId } : undefined,
            });
            if (!aluno) throw new AppError(500, 'Erro ao criar aluno');
            return SchemaAlunoResposta.parse(aluno);
        },

        async atualizar(id: number, data: AtualizarAlunoDTO) {
            const updateData: any = { ...data };
            if (data.nucleoId) updateData.nucleo = { id: data.nucleoId };
            if (data.categoriaId) updateData.categoria = { id: data.categoriaId };

            const aluno = await alunoRepo.atualizar(id, updateData);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return SchemaAlunoResposta.parse(aluno);
        },

        async deletar(id: number) {
            const deletado = await alunoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Aluno não encontrado');
            return true;
        }
    };
};