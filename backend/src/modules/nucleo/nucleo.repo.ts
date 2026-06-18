import { DataSource, FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { Nucleo } from "./Nucleo.model";
import { CriarNucleoDTO } from "./nucleo.schemas";
import { INucleoRepository } from "./nucleo.interfaces";
import { DashboardNucleoDTO } from "./nucleo.schemas";

export function fazerNucleoRepo(dataSource: DataSource): INucleoRepository {
    const repo = dataSource.getRepository(Nucleo);

    return {
        async listar(pagina: number, limite: number, where?: FindOptionsWhere<Nucleo>, relations?: FindOptionsRelations<Nucleo>) {
            const skip = (pagina - 1) * limite;
            const [data, total] = await repo.findAndCount({
                where,
                relations,
                skip,
                take: limite,
                order: { id: 'ASC' }
            });
            return { data, total };
        },
        async obterPorNome(nome: string) {
            const nucleo = await repo.findOne({ where: { nome } });
            return nucleo || null;
        },
        async obterPorId(id: number) {
            const nucleo = await repo.findOne({ where: { id } });
            return nucleo || null;
        },

        async criar(data: CriarNucleoDTO) {
            const nucleo = repo.create(data);
            return repo.save(nucleo);
        },

        async atualizar(id: number, data: Partial<CriarNucleoDTO>) {
            const nucleo = await repo.findOne({ where: { id } });
            if (!nucleo) return null;
            repo.merge(nucleo, data as any);
            await repo.save(nucleo);
            return this.obterPorId(id);
        },

        async deletar(id: number) {
            const result = await repo.delete({ id });
            return (result.affected ?? 0) > 0;
        },

        async obterDashboard(nucleoId: number): Promise<DashboardNucleoDTO> {
            const hoje = new Date();
            const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

            // Contagem de jogadores ativos (via times do núcleo)
            const totalJogadores = await dataSource
                .createQueryBuilder()
                .select('COUNT(DISTINCT j.id)', 'total')
                .from('jogadores', 'j')
                .innerJoin('times', 't', 't.id = j.time_id')
                .where('t.nucleo_id = :nucleoId', { nucleoId })
                .andWhere('j.ativo = true')
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            // Professores vinculados ao núcleo
            const totalProfessores = await dataSource
                .createQueryBuilder()
                .select('COUNT(u.id)', 'total')
                .from('usuarios', 'u')
                .where('u.nucleo_id = :nucleoId', { nucleoId })
                .andWhere("u.permissao IN ('professor', 'auxiliar')")
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            // Total de times do núcleo
            const totalTimes = await dataSource
                .createQueryBuilder()
                .select('COUNT(t.id)', 'total')
                .from('times', 't')
                .where('t.nucleo_id = :nucleoId', { nucleoId })
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            // Total de treinos do núcleo
            const totalTreinos = await dataSource
                .createQueryBuilder()
                .select('COUNT(tr.id)', 'total')
                .from('treinos', 'tr')
                .where('tr.nucleo_id = :nucleoId', { nucleoId })
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            // Jogos realizados (data <= hoje, envolvendo times do núcleo)
            const jogosRealizados = await dataSource
                .createQueryBuilder()
                .select('COUNT(DISTINCT jg.id)', 'total')
                .from('jogos', 'jg')
                .innerJoin('times', 'ta', 'ta.id = jg.time_a_id')
                .innerJoin('times', 'tb', 'tb.id = jg.time_b_id')
                .where('(ta.nucleo_id = :nucleoId OR tb.nucleo_id = :nucleoId)', { nucleoId })
                .andWhere('jg.data <= :hoje', { hoje: inicioDia })
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            // Jogos futuros
            const jogosFuturos = await dataSource
                .createQueryBuilder()
                .select('COUNT(DISTINCT jg.id)', 'total')
                .from('jogos', 'jg')
                .innerJoin('times', 'ta', 'ta.id = jg.time_a_id')
                .innerJoin('times', 'tb', 'tb.id = jg.time_b_id')
                .where('(ta.nucleo_id = :nucleoId OR tb.nucleo_id = :nucleoId)', { nucleoId })
                .andWhere('jg.data > :hoje', { hoje: inicioDia })
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            // Categorias distintas nos times do núcleo
            const totalCategorias = await dataSource
                .createQueryBuilder()
                .select('COUNT(DISTINCT t.categoria_id)', 'total')
                .from('times', 't')
                .where('t.nucleo_id = :nucleoId', { nucleoId })
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            // Crescimento de jogadores: compara mês atual vs mês anterior
            const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);

            const jogadoresMesAtual = await dataSource
                .createQueryBuilder()
                .select('COUNT(j.id)', 'total')
                .from('jogadores', 'j')
                .innerJoin('times', 't', 't.id = j.time_id')
                .where('t.nucleo_id = :nucleoId', { nucleoId })
                .andWhere('j.created_at >= :inicio', { inicio: inicioMesAtual })
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            const jogadoresMesAnterior = await dataSource
                .createQueryBuilder()
                .select('COUNT(j.id)', 'total')
                .from('jogadores', 'j')
                .innerJoin('times', 't', 't.id = j.time_id')
                .where('t.nucleo_id = :nucleoId', { nucleoId })
                .andWhere('j.created_at >= :inicio AND j.created_at < :fim', {
                    inicio: inicioMesAnterior,
                    fim: inicioMesAtual,
                })
                .getRawOne()
                .then(r => Number(r?.total ?? 0));

            const crescimentoJogadores = jogadoresMesAnterior > 0
                ? Math.round(((jogadoresMesAtual - jogadoresMesAnterior) / jogadoresMesAnterior) * 100)
                : jogadoresMesAtual > 0 ? 100 : 0;

            return {
                totalJogadores,
                totalProfessores,
                totalTimes,
                totalJogos: jogosRealizados + jogosFuturos,
                totalTreinos,
                totalCategorias,
                totalNucleos: 1,
                crescimentoJogadores,
                jogosRealizados,
                jogosFuturos,
            };
        },
    };
}