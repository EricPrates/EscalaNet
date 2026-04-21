import { AppError } from "../../shared/utils/AppError";
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { IAlunoRepository, IAlunoService } from "./aluno.interfaces";
import { CriarAlunoDTO, FiltrosAlunoDTO, RespostaAlunoDTO, SchemaAlunoResposta } from "./aluno.schemas";
import { FindOptionsWhere, ILike } from "typeorm";
import { Aluno } from "./Aluno.model";


export function fazerAlunoService(alunoRepo: IAlunoRepository): IAlunoService {
    return {
        
        async listar(pagina: number, limite: number, filtros: FiltrosAlunoDTO) {
            const where: FindOptionsWhere<Aluno> = {};
            if (filtros.nome) where.nome = ILike(`%${filtros.nome}%`);
            if (filtros.nucleoId) where.nucleo = { id: filtros.nucleoId };
            if (filtros.categoriaId) where.categoria = { id: filtros.categoriaId };
            const { data, total } = await alunoRepo.listar(pagina, limite, where);
            const totalPaginas = Math.ceil(total / limite);
            const dataValidada = SchemaAlunoResposta.array().parse(data);
            return SchemaRespostaPaginada(SchemaAlunoResposta).parse({
                data: dataValidada,
                meta: { pagina, limite, total, totalPaginas },
            });
        },


        async obterPorId(id: number): Promise<RespostaAlunoDTO> {
            const aluno = await alunoRepo.obterPorId(id);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return SchemaAlunoResposta.parse(aluno);
        },

        async criar(data: CriarAlunoDTO): Promise<RespostaAlunoDTO> {
            const aluno = await alunoRepo.criar(data);
            return SchemaAlunoResposta.parse(aluno);
        },

        async atualizar(id: number, data: Partial<CriarAlunoDTO>): Promise<RespostaAlunoDTO> {
            const aluno = await alunoRepo.atualizar(id, data);
            if (!aluno) throw new AppError(404, 'Aluno não encontrado');
            return SchemaAlunoResposta.parse(aluno);
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await alunoRepo.deletar(id);
            if (!deletado) throw new AppError(404, 'Aluno não encontrado');
            return deletado;
        },
    };
}
