import { Request, Response } from 'express';
import { montarRespostaPaginada, montarRespostaSucesso } from '../../shared/utils/construtorResposta';
import { SchemaPaginacaoQuery } from '../../shared/utils/listas.schema';
import { IAlunoService } from './aluno.interfaces';
import { CriarAlunoDTO, AtualizarAlunoDTO } from './aluno.schema';

export function fazerAlunoController(service: IAlunoService) {
    return {
        async listar(req: Request, res: Response) {
            const { pagina, limite } = SchemaPaginacaoQuery.parse(req.query);
            const result = await service.listar(pagina, limite);
            return res.status(200).json(montarRespostaPaginada('Alunos listados com sucesso', result.data, result.meta));
        },
        async obterPorId(req: Request, res: Response) {
            const aluno = await service.obterPorId(Number(req.params.id));
            return res.status(200).json(montarRespostaSucesso('Aluno obtido com sucesso', aluno));
        },
        async criar(req: Request, res: Response) {
            const data = req.body as CriarAlunoDTO;
            const aluno = await service.criar(data);
            return res.status(201).json(montarRespostaSucesso('Aluno criado com sucesso', aluno));
        },
        async atualizar(req: Request, res: Response) {
            const data = req.body as AtualizarAlunoDTO;
            const aluno = await service.atualizar(Number(req.params.id), data);
            return res.status(200).json(montarRespostaSucesso('Aluno atualizado com sucesso', aluno));
        },
        async deletar(req: Request, res: Response) {
            await service.deletar(Number(req.params.id));
            return res.status(200).json(montarRespostaSucesso('Aluno deletado com sucesso'));
        }
    };
}