import { DataSource } from 'typeorm';
import {
    FiltrosRelatorioFrequenciaDTO,
    FiltrosRelatorioDesempenhoDTO,
    RelatorioFrequenciaDTO,
    RelatorioDesempenhoDTO,
} from './relatorio.schemas';

export function fazerRelatorioRepo(dataSource: DataSource) {
    return {
        async frequencia(filtros: FiltrosRelatorioFrequenciaDTO): Promise<RelatorioFrequenciaDTO> {
           
            let chamadaQuery = dataSource
                .createQueryBuilder()
                .select('ch.id', 'chamadaId')
                .addSelect('ch.data', 'data')
                .addSelect('t.id', 'timeId')
                .addSelect('t.nome', 'timeNome')
                .addSelect('CASE WHEN ch.treino_id IS NOT NULL THEN \'treino\' ELSE \'jogo\' END', 'tipoChamada')
                .from('chamada', 'ch')
                .innerJoin('times', 't', 't.id = ch.time_id');

            if (filtros.nucleoId) {
                chamadaQuery = chamadaQuery.andWhere('t.nucleo_id = :nucleoId', { nucleoId: filtros.nucleoId });
            }
            if (filtros.timeId) {
                chamadaQuery = chamadaQuery.andWhere('ch.time_id = :timeId', { timeId: filtros.timeId });
            }
            if (filtros.dataInicio) {
                chamadaQuery = chamadaQuery.andWhere('ch.data >= :dataInicio', { dataInicio: filtros.dataInicio });
            }
            if (filtros.dataFim) {
                chamadaQuery = chamadaQuery.andWhere('ch.data <= :dataFim', { dataFim: filtros.dataFim });
            }
            if (filtros.tipo === 'treino') {
                chamadaQuery = chamadaQuery.andWhere('ch.treino_id IS NOT NULL');
            } else if (filtros.tipo === 'jogo') {
                chamadaQuery = chamadaQuery.andWhere('ch.jogo_id IS NOT NULL');
            }

            const chamadas = await chamadaQuery.getRawMany();
            const chamadaIds = chamadas.map(c => c.chamadaId);

            if (chamadaIds.length === 0) {
                return {
                    periodo: {
                        inicio: filtros.dataInicio ?? null,
                        fim: filtros.dataFim ?? null,
                    },
                    totalChamadas: 0,
                    mediaPresenca: 0,
                    jogadores: [],
                };
            }

            // Busca frequências das chamadas filtradas
            let freqQuery = dataSource
                .createQueryBuilder()
                .select('f.jogador_id', 'jogadorId')
                .addSelect('j.nome', 'jogadorNome')
                .addSelect('t.id', 'timeId')
                .addSelect('t.nome', 'timeNome')
                .addSelect('COUNT(f.id)', 'totalChamadas')
                .addSelect('SUM(CASE WHEN f.presente = 1 THEN 1 ELSE 0 END)', 'totalPresencas')
                .addSelect('SUM(CASE WHEN f.presente = 0 THEN 1 ELSE 0 END)', 'totalFaltas')
                .from('frequencia', 'f')
                .innerJoin('jogadores', 'j', 'j.id = f.jogador_id')
                .innerJoin('times', 't', 't.id = j.time_id')
                .where('f.chamada_id IN (:...chamadaIds)', { chamadaIds })
                .groupBy('f.jogador_id')
                .addGroupBy('j.nome')
                .addGroupBy('t.id')
                .addGroupBy('t.nome');

            if (filtros.jogadorId) {
                freqQuery = freqQuery.andWhere('f.jogador_id = :jogadorId', { jogadorId: filtros.jogadorId });
            }

            const frequencias = await freqQuery.getRawMany();

            // Busca detalhes das faltas (chamadas onde ficou ausente)
            const faltasDetalhe = await dataSource
                .createQueryBuilder()
                .select('f.jogador_id', 'jogadorId')
                .addSelect('ch.data', 'data')
                .addSelect('f.justificativa', 'justificativa')
                .addSelect('CASE WHEN ch.treino_id IS NOT NULL THEN \'treino\' ELSE \'jogo\' END', 'tipo')
                .from('frequencia', 'f')
                .innerJoin('chamada', 'ch', 'ch.id = f.chamada_id')
                .where('f.chamada_id IN (:...chamadaIds)', { chamadaIds })
                .andWhere('f.presente = 0')
                .getRawMany();

            const faltasPorJogador = new Map<number, typeof faltasDetalhe>();
            for (const falta of faltasDetalhe) {
                const id = Number(falta.jogadorId);
                if (!faltasPorJogador.has(id)) faltasPorJogador.set(id, []);
                faltasPorJogador.get(id)!.push(falta);
            }

            const jogadores = frequencias.map(f => {
                const total = Number(f.totalChamadas);
                const presencas = Number(f.totalPresencas);
                const faltas = Number(f.totalFaltas);
                const jogadorId = Number(f.jogadorId);
                return {
                    jogadorId,
                    jogadorNome: f.jogadorNome,
                    timeId: Number(f.timeId),
                    timeNome: f.timeNome,
                    totalChamadas: total,
                    totalPresencas: presencas,
                    totalFaltas: faltas,
                    percentualPresenca: total > 0 ? Math.round((presencas / total) * 100) : 0,
                    faltas: (faltasPorJogador.get(jogadorId) ?? []).map(fa => ({
                        data: new Date(fa.data),
                        justificativa: fa.justificativa ?? null,
                        tipo: fa.tipo as 'treino' | 'jogo',
                    })),
                };
            });

            const mediaPresenca = jogadores.length > 0
                ? Math.round(jogadores.reduce((acc, j) => acc + j.percentualPresenca, 0) / jogadores.length)
                : 0;

            // Dados do núcleo/time para o cabeçalho
            let nucleoInfo = null;
            let timeInfo = null;

            if (filtros.nucleoId) {
                const nucleo = await dataSource
                    .createQueryBuilder()
                    .select('n.id', 'id').addSelect('n.nome', 'nome')
                    .from('nucleos', 'n').where('n.id = :id', { id: filtros.nucleoId })
                    .getRawOne();
                if (nucleo) nucleoInfo = { id: Number(nucleo.id), nome: nucleo.nome };
            }

            if (filtros.timeId) {
                const time = await dataSource
                    .createQueryBuilder()
                    .select('t.id', 'id').addSelect('t.nome', 'nome')
                    .from('times', 't').where('t.id = :id', { id: filtros.timeId })
                    .getRawOne();
                if (time) timeInfo = { id: Number(time.id), nome: time.nome };
            }

            return {
                periodo: {
                    inicio: filtros.dataInicio ?? null,
                    fim: filtros.dataFim ?? null,
                },
                nucleo: nucleoInfo ?? undefined,
                time: timeInfo ?? undefined,
                totalChamadas: chamadas.length,
                mediaPresenca,
                jogadores: jogadores.sort((a, b) => b.percentualPresenca - a.percentualPresenca),
            };
        },

        async desempenho(filtros: FiltrosRelatorioDesempenhoDTO): Promise<RelatorioDesempenhoDTO> {
            // Query de eventos agrupados por jogador
            let eventoQuery = dataSource
                .createQueryBuilder()
                .select('e.jogador_envolvido_id', 'jogadorId')
                .addSelect('j.nome', 'jogadorNome')
                .addSelect('t.id', 'timeId')
                .addSelect('t.nome', 'timeNome')
                .addSelect('COUNT(DISTINCT e.jogo_id)', 'totalJogos')
                .addSelect("SUM(CASE WHEN e.tipo = 'gol' THEN 1 ELSE 0 END)", 'gols')
                .addSelect("SUM(CASE WHEN e.tipo = 'falta' THEN 1 ELSE 0 END)", 'faltas')
                .addSelect("SUM(CASE WHEN e.tipo = 'cartao_amarelo' THEN 1 ELSE 0 END)", 'cartoesAmarelos')
                .addSelect("SUM(CASE WHEN e.tipo = 'cartao_vermelho' THEN 1 ELSE 0 END)", 'cartoesVermelhos')
                .addSelect("SUM(CASE WHEN e.tipo = 'substituicao' THEN 1 ELSE 0 END)", 'substituicoes')
                .addSelect("SUM(CASE WHEN e.tipo = 'escanteio' THEN 1 ELSE 0 END)", 'escanteios')
                .from('eventos_jogo', 'e')
                .innerJoin('jogadores', 'j', 'j.id = e.jogador_envolvido_id')
                .innerJoin('times', 't', 't.id = j.time_id')
                .innerJoin('jogos', 'jg', 'jg.id = e.jogo_id')
                .where('e.jogador_envolvido_id IS NOT NULL')
                .groupBy('e.jogador_envolvido_id')
                .addGroupBy('j.nome')
                .addGroupBy('t.id')
                .addGroupBy('t.nome');

            if (filtros.nucleoId) {
                eventoQuery = eventoQuery.andWhere('t.nucleo_id = :nucleoId', { nucleoId: filtros.nucleoId });
            }
            if (filtros.timeId) {
                eventoQuery = eventoQuery.andWhere('t.id = :timeId', { timeId: filtros.timeId });
            }
            if (filtros.jogadorId) {
                eventoQuery = eventoQuery.andWhere('e.jogador_envolvido_id = :jogadorId', { jogadorId: filtros.jogadorId });
            }
            if (filtros.jogoId) {
                eventoQuery = eventoQuery.andWhere('e.jogo_id = :jogoId', { jogoId: filtros.jogoId });
            }
            if (filtros.competicaoId) {
                eventoQuery = eventoQuery.andWhere('jg.competicao_id = :competicaoId', { competicaoId: filtros.competicaoId });
            }
            if (filtros.dataInicio) {
                eventoQuery = eventoQuery.andWhere('jg.data >= :dataInicio', { dataInicio: filtros.dataInicio });
            }
            if (filtros.dataFim) {
                eventoQuery = eventoQuery.andWhere('jg.data <= :dataFim', { dataFim: filtros.dataFim });
            }

            const eventos = await eventoQuery.getRawMany();

            const jogadores = eventos.map(e => ({
                jogadorId: Number(e.jogadorId),
                jogadorNome: e.jogadorNome,
                timeId: Number(e.timeId),
                timeNome: e.timeNome,
                totalJogos: Number(e.totalJogos),
                gols: Number(e.gols),
                faltas: Number(e.faltas),
                cartoesAmarelos: Number(e.cartoesAmarelos),
                cartoesVermelhos: Number(e.cartoesVermelhos),
                substituicoes: Number(e.substituicoes),
                escanteios: Number(e.escanteios),
            }));

            const totalGols = jogadores.reduce((acc, j) => acc + j.gols, 0);
            const totalJogos = jogadores.length > 0 ? Math.max(...jogadores.map(j => j.totalJogos)) : 0;

            // Cabeçalho
            let nucleoInfo = null;
            let timeInfo = null;

            if (filtros.nucleoId) {
                const nucleo = await dataSource
                    .createQueryBuilder()
                    .select('n.id', 'id').addSelect('n.nome', 'nome')
                    .from('nucleos', 'n').where('n.id = :id', { id: filtros.nucleoId })
                    .getRawOne();
                if (nucleo) nucleoInfo = { id: Number(nucleo.id), nome: nucleo.nome };
            }

            if (filtros.timeId) {
                const time = await dataSource
                    .createQueryBuilder()
                    .select('t.id', 'id').addSelect('t.nome', 'nome')
                    .from('times', 't').where('t.id = :id', { id: filtros.timeId })
                    .getRawOne();
                if (time) timeInfo = { id: Number(time.id), nome: time.nome };
            }

            return {
                periodo: {
                    inicio: filtros.dataInicio ?? null,
                    fim: filtros.dataFim ?? null,
                },
                nucleo: nucleoInfo ?? undefined,
                time: timeInfo ?? undefined,
                totalJogos,
                totalGols,
                jogadores: jogadores.sort((a, b) => b.gols - a.gols),
            };
        },
    };
}
