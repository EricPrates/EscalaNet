import { DataSource } from "typeorm";
import { Frequencia } from "../frequencia/frequencia.model";
import { montarRespostaSucesso } from "../../shared/utils/construtorResposta";
import { Request, Response } from "express";
import { SchemaFiltroFrequencia } from "../frequencia/frequencia.schemas";
import { authStorage } from "../../shared/utils/authStorage";
import { AppError } from "../../shared/utils/AppError";
import { Jogador } from "../jogador/jogador.model";
import { Nucleo } from "../nucleo/Nucleo.model";
import { SchemaFiltrosJogo } from "../jogo/jogo.schemas";
import { Jogo } from "../jogo/Jogo.model";
import { Time } from "../time/time.model";
import { Usuario } from "../usuario/Usuario.model";



export function fazerDash(dataSource: DataSource) {
    return {
        async frequenciaTotalContagem(req: Request, res: Response) {
            const usuario = authStorage.getStore();
            const filtros = SchemaFiltroFrequencia.parse(req.query);

            const qb = dataSource.getRepository(Frequencia).createQueryBuilder('f');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                qb.andWhere('f.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }
            if (filtros.nucleo) {
                qb.andWhere('f.nucleo_id = :nucleoId', { nucleoId: filtros.nucleo });
            }

            if (filtros.jogador) {
                qb.andWhere('f.jogador_id = :jogadorId', { jogadorId: filtros.jogador });
            }
            const total = await qb.getCount();
            return res.status(200).json(montarRespostaSucesso('Total de frequências obtido com sucesso', total));
        },

        async frequenciaPorNucleo(req: Request, res: Response) {
            const usuario = authStorage.getStore();
            if (usuario?.permissao !== "admin") {
                throw new AppError(403, 'Acesso negado: apenas administradores podem acessar este relatório');
            }

            const filtros = SchemaFiltroFrequencia.parse(req.query);
            if (!filtros.nucleo) {
                throw new AppError(400, 'É necessário fornecer o ID do núcleo (nucleoId)');
            }

            const resultados = await dataSource
                .getRepository(Frequencia)
                .createQueryBuilder('f')
                .select('f.nucleo_id', 'nucleoId')
                .addSelect('COUNT(f.id)', 'totalFrequencias')
                .where('f.nucleo_id = :nucleoId', { nucleoId: filtros.nucleo })
                .groupBy('f.nucleo_id')
                .getRawMany();

            return res.status(200).json(montarRespostaSucesso('Frequências por núcleo obtidas com sucesso', resultados));
        },

        async frequenciaPorJogador(req: Request, res: Response) {
            const usuario = authStorage.getStore();
            const filtros = SchemaFiltroFrequencia.parse(req.query);

            const qb = dataSource.getRepository(Frequencia).createQueryBuilder('f')
                .select('f.jogador_id', 'jogadorId')
                .addSelect('COUNT(f.id)', 'totalFrequencias')
                .groupBy('f.jogador_id');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                qb.andWhere('f.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }
            if (filtros.nucleo) {
                qb.andWhere('f.nucleo_id = :nucleoId', { nucleoId: filtros.nucleo });
            }
            if (filtros.jogador) {
                qb.andWhere('f.jogador_id = :jogadorId', { jogadorId: filtros.jogador });
            }

            const resultados = await qb.getRawMany();
            return res.status(200).json(montarRespostaSucesso('Frequências por jogador obtidas com sucesso', resultados));
        },

        async frequenciaPorTreino(req: Request, res: Response) {
            const usuario = authStorage.getStore();
            const filtros = SchemaFiltroFrequencia.parse(req.query);


            const qb = dataSource.getRepository(Frequencia).createQueryBuilder('f')
                .select('f.treino_id', 'treinoId')
                .addSelect('COUNT(f.id)', 'totalFrequencias')
                .groupBy('f.treino_id');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                qb.andWhere('f.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }
            if (filtros.nucleo) {
                qb.andWhere('f.nucleo_id = :nucleoId', { nucleoId: filtros.nucleo });
            }

            const resultados = await qb.getRawMany();
            return res.status(200).json(montarRespostaSucesso('Frequências por treino obtidas com sucesso', resultados));
        },

        async contagemDeJogadores(_req: Request, res: Response) {
            const usuario = authStorage.getStore();

            const qb = dataSource.getRepository(Jogador).createQueryBuilder('j');
          
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                qb.where('j.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }


            const total = await qb.getCount();
            return res.status(200).json(montarRespostaSucesso('Contagem de jogadores obtida com sucesso', total));
        },
        async contagemdeNucleos(_req: Request, res: Response) {
            const usuario = authStorage.getStore();


            if (usuario?.permissao !== "admin") {
                throw new AppError(403, 'Acesso negado: apenas administradores podem acessar este relatório');
            }
            const qb = dataSource.getRepository(Nucleo).createQueryBuilder('n');
            const total = await qb.getCount();
            return res.status(200).json(montarRespostaSucesso('Contagem de núcleos obtida com sucesso', total));
        },
        async jogosAgendados(req: Request, res: Response) {
            const usuario = authStorage.getStore();
            const filtros = SchemaFiltrosJogo.parse(req.query);

            const qb = dataSource.getRepository(Jogo).createQueryBuilder('j')
                .select('j.id', 'id')
                .addSelect('j.nome', 'nome')
                .addSelect('j.data', 'data')
                .addSelect('j.time_a_id', 'timeAId')
                .addSelect('j.time_b_id', 'timeBId');


            if (filtros.id) qb.andWhere('j.id = :id', { id: filtros.id });
            if (filtros.nome) qb.andWhere('j.nome LIKE :nome', { nome: `%${filtros.nome}%` });
            if (filtros.timeA) qb.andWhere('j.time_a_id = :timeAId', { timeAId: filtros.timeA });
            if (filtros.timeB) qb.andWhere('j.time_b_id = :timeBId', { timeBId: filtros.timeB });
            if (filtros.categoria) qb.andWhere('j.categoria_id = :categoriaId', { categoriaId: filtros.categoria });


            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');

                qb.innerJoin('j.timeA', 'timeA')
                    .innerJoin('j.timeB', 'timeB')
                    .andWhere('timeA.nucleo_id = :nucleoId OR timeB.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }

            const resultados = await qb.getRawMany();
            return res.status(200).json(montarRespostaSucesso('Jogos agendados obtidos com sucesso', resultados));
        },

        async frequenciasPorData(req: Request, res: Response) {
            const usuario = authStorage.getStore();

            const { dataInicio, dataFim, presente } = req.query as { dataInicio?: string; dataFim?: string; presente?: string };

            if (!dataInicio || !dataFim) {
                throw new AppError(400, 'Datas de início e fim são obrigatórias');
            }

            const qb = dataSource.getRepository(Frequencia)
                .createQueryBuilder('f')
                .innerJoin('f.chamada', 'c')
                .select('c.data', 'data')
                .addSelect('COUNT(f.id)', 'totalFrequencias')
                .where('c.data BETWEEN :dataInicio AND :dataFim', { dataInicio, dataFim })
                .andWhere('f.presente = :presente', { presente: presente == 'true' ? true : false })
                .groupBy('c.data');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Professor sem núcleo vinculado');
                }
                qb.andWhere('f.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }

            const resultados = await qb.getRawMany();
            return res.status(200).json(montarRespostaSucesso('Frequências por data obtidas com sucesso', resultados));
        },

        async contagemDeTimes(_req: Request, res: Response) {
            const usuario = authStorage.getStore();

            const qb = dataSource.getRepository(Time).createQueryBuilder('t');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                qb.where('t.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }

            const total = await qb.getCount();
            return res.status(200).json(montarRespostaSucesso('Contagem de times obtida com sucesso', total));
        },
        async contagemDeUsuariosPorNucleo(req: Request, res: Response) {
            const usuario = authStorage.getStore();
            const { id } = req.params;
            
            const qb = dataSource.getRepository(Usuario).createQueryBuilder('u');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                qb.where('u.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }
            if (id) {
                qb.andWhere('u.nucleo_id = :nucleoId', { nucleoId: Number(id) });
            }
            const total = await qb.getCount();
            return res.status(200).json(montarRespostaSucesso('Contagem de usuários por núcleo obtida com sucesso', total));
        },
        async contagemDeJogadoresPorNucleo(req: Request, res: Response) {
            const usuario = authStorage.getStore();
            const { id } = req.params;
            console.log('nucleoId recebido:', id);
            const qb = dataSource.getRepository(Jogador).createQueryBuilder('j');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo vinculado');
                qb.where('j.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }
            if (id) {
                qb.andWhere('j.nucleo_id = :nucleoId', { nucleoId: Number(id) });
            }
            const total = await qb.getCount();
            return res.status(200).json(montarRespostaSucesso('Contagem de jogadores por núcleo obtida com sucesso', total));
        },
        async jogadoresCadastradosHoje(_req: Request, res: Response) {
            const usuario = authStorage.getStore(); 
            
            const hoje = new Date();
            const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            const dataFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);

            const qb = dataSource.getRepository(Jogador).createQueryBuilder('j');

            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) {
                    throw new AppError(403, 'Professor sem núcleo vinculado');
                }
                qb.andWhere('j.nucleo_id = :nucleoId', { nucleoId: usuario.nucleoVinculadoId });
            }

            qb.andWhere('j.createdAt >= :dataInicio', { dataInicio })
                .andWhere('j.createdAt < :dataFim', { dataFim });

            const total = await qb.getRawMany();
            return res.status(200).json(montarRespostaSucesso('Contagem de jogadores cadastrados obtida com sucesso', total));
        }
    };


}