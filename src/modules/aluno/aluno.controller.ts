import { Request, Response } from "express";
import { montarRespostaPaginada, montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { SchemaPaginacaoQuery } from "../../shared/utils/listas.schema";
import { IAlunoService } from "./aluno.interfaces";
import { AtualizarAlunoDTO, CriarAlunoDTO, SchemaAtualizarAluno, SchemaCriarAluno, SchemaFiltrosAluno } from "./aluno.schemas";
import { getContext } from "../../shared/utils/authStorage";
import { AppError } from "../../shared/utils/AppError";


export function fazerAlunoController(service: IAlunoService) {
    return {
        async listar(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const filtros = SchemaFiltrosAluno.parse(req.query);
            const includes = req.query.includes
                ? String(req.query.includes).split(',').map(s => s.trim())
                : [];
            const { data, meta } = await service.listar(pagina, limite, filtros, includes);
            return res.status(200).json(montarRespostaPaginada('Alunos listados com sucesso', data, meta));
        },

        async listarPorNucleoParaTreinador(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const nucleoId = getContext()!.nucleoVinculadoId;
            if (!nucleoId) throw new AppError(400, 'Núcleo não vinculado');
            const filtros = SchemaFiltrosAluno.parse( { nucleoId } );
            const includes = req.query.includes
                ? String(req.query.includes).split(',').map(s => s.trim())
                : [];

            const { data, meta } = await service.listar(pagina, limite, filtros, includes);
            return res.status(200).json(montarRespostaPaginada('Alunos listados com sucesso', data, meta));
        },

        async obterAlunoPorId(req: Request, res: Response) {
            const {id} = SchemaFiltrosAluno.parse(req.params);
            const includes = req.query.includes
                ? String(req.query.includes).split(',').map(s => s.trim())
                : [];
        
            const aluno = await service.obterPorId(Number(id), includes);
            return res.status(200).json(montarRespostaSucesso('Aluno obtido com sucesso', aluno));
        },

        async criarAluno(req: Request, res: Response) {
            const data: CriarAlunoDTO = SchemaCriarAluno.parse(req.body);
            const aluno = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Aluno criado com sucesso', aluno));
        },

        async atualizarAluno(req: Request, res: Response) {
            const { id } = req.params;
            const data = SchemaAtualizarAluno.parse(req.body) as AtualizarAlunoDTO;
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
