import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IAlunoService } from "./aluno.interfaces";
import { CriarAlunoDTO, SchemaFiltrosAluno } from "./aluno.schemas";
import { getContext } from "../../shared/utils/authStorage";


export function fazerAlunoController(service: IAlunoService) {
    return {
        async listar(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosAluno.parse(req.query);
            const { data, meta } = await service.listar(pagina, limite, filtros);
            return res.status(200).json(montarRespostaPaginada('Alunos listados com sucesso', data, meta));
        },

        async listarPorNucleo(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const nucleoId = getContext()?.nucleoVinculadoId;
            const { data, meta } = await service.listar(pagina, limite, { nucleoId });
            return res.status(200).json(montarRespostaPaginada('Alunos listados com sucesso', data, meta));
        },

        async obterAlunoPorId(req: Request, res: Response) {
            const aluno = await service.obterPorId(Number(req.params.id));
            return res.status(200).json(montarRespostaSucesso('Aluno obtido com sucesso', aluno));
        },

        async criarAluno(req: Request, res: Response) {
            const data = req.body as CriarAlunoDTO;
            const aluno = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Aluno criado com sucesso', aluno));
        },

        async atualizarAluno(req: Request, res: Response) {
            const { id } = req.params;
            const data = req.body as Partial<CriarAlunoDTO>;
            const aluno = await service.atualizar(Number(id), data);
            return res.status(200).json(montarRespostaSucesso('Aluno atualizado com sucesso', aluno));
        },

        async deletarAluno(req: Request, res: Response) {
            const { id } = req.params;
            await service.deletar(Number(id));
            return res.status(200).json(montarRespostaSucesso('Aluno deletado com sucesso'));
        },
    };
}
