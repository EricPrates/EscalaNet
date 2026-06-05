// Importações necessárias do TypeORM e utilitários locais
import { DataSource, DeepPartial } from 'typeorm';
import { AppError } from '../../shared/utils/AppError';
import { Competicao } from './Competicao.model';
import { Jogo } from '../jogo/Jogo.model';
import { Classificacao } from '../classificacao/Classificacao.model';
import { Time } from '../time/time.model';

// ============================================================
// TIPOS AUXILIARES
// ============================================================

// Representa um time com apenas id e nome (usado na geração de chaveamento)
type TimeBasico = { id: number; nome: string };

// Representa um placeholder para o vencedor de uma partida futura no chaveamento
interface PlaceholderWinner {
    placeholderWinnerOf: string; // Ex: "0-1" (round 0, índice do par)
}

// Participante pode ser um time real, null (bye) ou um placeholder de vencedor
type Participante = TimeBasico | null | PlaceholderWinner;

// TimeOuNull é usado no algoritmo round‑robin para permitir folgas (bye)
type TimeOuNull = Time | null;

// Extensão da entidade Competicao para incluir configurações opcionais
// que podem existir no objeto JSON, mesmo não estando no modelo oficial
interface CompeticaoComConfig extends Competicao {
    intervaloDias?: number;   // dias entre rodadas (padrão 7)
    duplaVolta?: boolean;     // se verdadeiro, gera dois turnos
}

// ============================================================
// FUNÇÃO PRINCIPAL: GERAR JOGOS DA COMPETIÇÃO
// ============================================================

/**
 * Gera automaticamente os jogos de uma competição de acordo com seu tipo.
 * - Liga: round‑robin (todos contra todos), com opção de dois turnos.
 * - Copa: chaveamento eliminatório simples (gera apenas a primeira rodada).
 *
 * @param competicaoId - ID da competição
 * @param dataInicio   - data do primeiro jogo (os demais são escalonados)
 * @param dataSource   - conexão ativa do TypeORM
 * @returns Promise com array de jogos criados
 */
export async function gerarJogosCompeticao(
    competicaoId: number,
    dataInicio: Date,
    dataSource: DataSource,
): Promise<Jogo[]> {
    // Repositórios necessários
    const competicaoRepo = dataSource.getRepository(Competicao);
    const jogoRepo = dataSource.getRepository(Jogo);
    const classificacaoRepo = dataSource.getRepository(Classificacao);

    // 1. Carrega a competição com seus times (relação many-to-many)
    const competicao = await competicaoRepo.findOne({
        where: { id: competicaoId },
        relations: { times: true }, // forma correta (objeto) e não array de strings
    });

    // Validações básicas
    if (!competicao) throw new AppError(404, 'Competição não encontrada');
    if (!competicao.times || competicao.times.length < 2) {
        throw new AppError(400, 'A competição precisa ter pelo menos 2 times para gerar jogos');
    }

    // Evita duplicação: se já existem jogos, não gera novamente
    const jogosExistentes = await jogoRepo.count({ where: { competicao: { id: competicaoId } } });
    if (jogosExistentes > 0) {
        throw new AppError(409, 'Esta competição já possui jogos gerados. Delete-os antes de gerar novamente');
    }

    const times = competicao.times;
    const jogosParaCriar: DeepPartial<Jogo>[] = []; // armazena jogos em memória antes de salvar

    // Configurações extra (intervalo entre rodadas e dupla volta)
    const config = competicao as CompeticaoComConfig;
    const intervaloDias = config.intervaloDias ?? 7;   // padrão 7 dias
    const duplaVolta = !!config.duplaVolta;           // força booleano

    // ============================================================
    // LÓGICA PARA COMPETIÇÕES DO TIPO LIGA (ROUND-ROBIN)
    // ============================================================
    if (competicao.tipo === 'Liga') {
        // Algoritmo do círculo (circle method) para gerar rodadas balanceadas.
        // A lista pode conter null para representar "bye" (time sem adversário).
        let lista: TimeOuNull[] = [...times];
        const odd = lista.length % 2 === 1;
        if (odd) lista.push(null); // se número ímpar, adiciona folga

        const n = lista.length;
        const rounds = n - 1; // número de rodadas por turno

        // scheduleRounds armazena, para cada rodada, os pares de times (ou null)
        const scheduleRounds: Array<Array<[TimeOuNull, TimeOuNull]>> = [];

        // Gera as rodadas do primeiro turno
        for (let r = 0; r < rounds; r++) {
            const pairs: Array<[TimeOuNull, TimeOuNull]> = [];
            for (let i = 0; i < n / 2; i++) {
                const a = lista[i];
                const b = lista[n - 1 - i];
                if (a && b) pairs.push([a, b]); // só adiciona se ambos existirem
            }
            scheduleRounds.push(pairs);

            // Rotaciona a lista (fixa o primeiro, move o último para a posição 1, etc.)
            // O uso de "!" é seguro porque sabemos que lista[0] existe (n >= 2)
            lista = [lista[0]!, ...lista.slice(n - 1), ...lista.slice(1, n - 1)];
        }

        const totalRounds = duplaVolta ? rounds * 2 : rounds;

        // Itera sobre todas as rodadas (primeiro e, se houver, segundo turno)
        for (let r = 0; r < totalRounds; r++) {
            const isSecondTurn = duplaVolta && r >= rounds;
            const roundIndex = isSecondTurn ? r - rounds : r;
            const pairs = scheduleRounds[roundIndex] ?? [];

            const data = new Date(dataInicio);
            data.setDate(data.getDate() + r * intervaloDias); // escalona a data

            for (const [home, away] of pairs) {
                // No segundo turno, inverte os mandos
                const timeA = isSecondTurn ? away : home;
                const timeB = isSecondTurn ? home : away;
                if (!timeA || !timeB) continue; // segurança contra null inesperado

                jogosParaCriar.push({
                    nome: `${timeA.nome} x ${timeB.nome}`,
                    data: new Date(data),
                    timeA,
                    timeB,
                    golsTimeA: 0,
                    golsTimeB: 0,
                    competicao,
                    categoria: undefined,
                    arbitro: undefined,
                });
            }
        }
    }
    // ============================================================
    // LÓGICA PARA COMPETIÇÕES DO TIPO COPA (MATA-MATA)
    // ============================================================
    else {
        const seeds = [...times];
        // Gera toda a estrutura de chaveamento (bracket) em memória
        const bracket = gerarEstruturaChaveamento(seeds);
        // Pega apenas os confrontos da primeira rodada (os que têm times reais)
        const firstRoundPairs = bracket[0] ?? [];

        for (let r = 0; r < firstRoundPairs.length; r++) {
            const pair = firstRoundPairs[r];
            if (!pair) continue; // elimina undefined (garantia de tipo)

            const [a, b] = pair; // agora pair é com certeza um par
            const data = new Date(dataInicio);
            data.setDate(data.getDate() + r * intervaloDias);

            // Verifica se ambos são times reais (não placeholders) e não nulos
            if (a && b && !('placeholderWinnerOf' in a) && !('placeholderWinnerOf' in b)) {
                jogosParaCriar.push({
                    nome: `Copa - ${a.nome} x ${b.nome}`,
                    data: new Date(data),
                    timeA: a,
                    timeB: b,
                    golsTimeA: 0,
                    golsTimeB: 0,
                    competicao,
                    categoria: undefined,
                    arbitro: undefined,
                });
            }
            // Se houver bye (a ou b null), não cria jogo – o time avança automaticamente
        }
    }

    // ============================================================
    // PERSISTÊNCIA DOS JOGOS
    // ============================================================
    const jogos = jogoRepo.create(jogosParaCriar); // converte objetos parciais em entidades
    const jogosSalvos = await jogoRepo.save(jogos);

    // Para competições do tipo Liga, também inicializa a tabela de classificação com zeros
    if (competicao.tipo === 'Liga') {
        const classificacoesExistentes = await classificacaoRepo.count({
            where: { competicao: { id: competicaoId } },
        });
        if (classificacoesExistentes === 0) {
            const classificacoes = times.map(time =>
                classificacaoRepo.create({
                    competicao: { id: competicaoId }, // referência pelo ID
                    time: { id: time.id },
                    pontos: 0, jogos: 0, vitorias: 0, empates: 0,
                    derrotas: 0, golsPro: 0, golsContra: 0, saldoGols: 0, aproveitamento: 0,
                })
            );
            await classificacaoRepo.save(classificacoes);
        }
    }

    return jogosSalvos;
}

// ============================================================
// FUNÇÃO: RECALCULAR CLASSIFICAÇÃO DE UMA LIGA
// ============================================================

/**
 * Recalcula toda a tabela de classificação de uma competição do tipo Liga
 * com base nos resultados (gols) de todos os jogos já registrados.
 * Deve ser chamada sempre que um placar for inserido/alterado.
 *
 * @param competicaoId - ID da competição
 * @param dataSource - conexão TypeORM
 * @returns Lista de classificações atualizadas e ordenadas
 */
export async function recalcularClassificacao(
    competicaoId: number,
    dataSource: DataSource,
): Promise<Classificacao[]> {
    const jogoRepo = dataSource.getRepository(Jogo);
    const classificacaoRepo = dataSource.getRepository(Classificacao);
    const competicaoRepo = dataSource.getRepository(Competicao);

    // Carrega competição com seus times
    const competicao = await competicaoRepo.findOne({
        where: { id: competicaoId },
        relations: { times: true },
    });

    if (!competicao) throw new AppError(404, 'Competição não encontrada');
    if (competicao.tipo !== 'Liga') {
        throw new AppError(400, 'Cálculo de tabela só é aplicável a competições do tipo Liga');
    }

    // Carrega todos os jogos da competição, com os times relacionados
    const jogos = await jogoRepo.find({
        where: { competicao: { id: competicaoId } },
        relations: { timeA: true, timeB: true },
    });

    // Mapa para acumular estatísticas por time (id -> stats)
    const tabela = new Map<number, {
        timeId: number;
        pontos: number; jogos: number; vitorias: number;
        empates: number; derrotas: number;
        golsPro: number; golsContra: number;
    }>();

    // Inicializa todos os times com zero
    for (const time of competicao.times ?? []) {
        tabela.set(time.id, {
            timeId: time.id,
            pontos: 0, jogos: 0, vitorias: 0,
            empates: 0, derrotas: 0,
            golsPro: 0, golsContra: 0,
        });
    }

    // Processa cada jogo (apenas os que têm placar definido, gols podem ser zero)
    for (const jogo of jogos) {
        const golsA = jogo.golsTimeA ?? 0;
        const golsB = jogo.golsTimeB ?? 0;
        const idA = jogo.timeA?.id;
        const idB = jogo.timeB?.id;
        if (!idA || !idB) continue; // jogo sem times? ignora

        const timeA = tabela.get(idA);
        const timeB = tabela.get(idB);
        if (!timeA || !timeB) continue;

        // Atualiza jogos e gols
        timeA.jogos++; timeB.jogos++;
        timeA.golsPro += golsA; timeA.golsContra += golsB;
        timeB.golsPro += golsB; timeB.golsContra += golsA;

        // Define resultado e pontos
        if (golsA > golsB) {
            timeA.vitorias++; timeA.pontos += 3;
            timeB.derrotas++;
        } else if (golsB > golsA) {
            timeB.vitorias++; timeB.pontos += 3;
            timeA.derrotas++;
        } else {
            timeA.empates++; timeA.pontos += 1;
            timeB.empates++; timeB.pontos += 1;
        }
    }

    // Agora atualiza (ou cria) os registros de Classificacao no banco
    const classificacoesAtualizadas: Classificacao[] = [];

    for (const [timeId, stats] of tabela) {
        const saldoGols = stats.golsPro - stats.golsContra;
        const aproveitamento = stats.jogos > 0
            ? Math.round((stats.pontos / (stats.jogos * 3)) * 100)
            : 0;

        // Tenta buscar registro existente
        let classificacao = await classificacaoRepo.findOne({
            where: { competicao: { id: competicaoId }, time: { id: timeId } },
        });

        if (!classificacao) {
            // Cria um novo (o TypeORM aceita referências por ID)
            classificacao = classificacaoRepo.create({
                competicao: { id: competicaoId },
                time: { id: timeId },
            });
        }

        // Atualiza todos os campos
        classificacao.pontos = stats.pontos;
        classificacao.jogos = stats.jogos;
        classificacao.vitorias = stats.vitorias;
        classificacao.empates = stats.empates;
        classificacao.derrotas = stats.derrotas;
        classificacao.golsPro = stats.golsPro;
        classificacao.golsContra = stats.golsContra;
        classificacao.saldoGols = saldoGols;
        classificacao.aproveitamento = aproveitamento;

        classificacoesAtualizadas.push(await classificacaoRepo.save(classificacao));
    }

    // Ordena: maior pontos → maior saldo → maior gols pró
    return classificacoesAtualizadas.sort((a, b) =>
        b.pontos - a.pontos ||
        b.saldoGols - a.saldoGols ||
        b.golsPro - a.golsPro
    );
}

// ============================================================
// FUNÇÃO AUXILIAR: GERAR ESTRUTURA DE CHAVEAMENTO (BRACKET)
// ============================================================

/**
 * Cria uma estrutura de chaveamento eliminatório (mata‑mata) em memória.
 * Ajusta o número de participantes para a potência de 2 superior (com byes).
 * Retorna um array de rodadas; cada rodada é um array de pares [participante, participante].
 *
 * @param seeds - Lista de times iniciais (TimeBasico)
 * @returns Bracket completo com placeholders para vencedores futuros
 */
export function gerarEstruturaChaveamento(seeds: TimeBasico[]): Array<Array<[Participante, Participante]>> {
    // Cópia da lista de participantes
    const participants: Participante[] = [...seeds];

    // Calcula a próxima potência de 2 (ex.: 5 times → 8)
    const potencia = Math.pow(2, Math.ceil(Math.log2(participants.length)));
    const byes = potencia - participants.length;

    // Adiciona entradas nulas (bye) para completar o bracket
    for (let i = 0; i < byes; i++) participants.push(null);

    const rounds: Array<Array<[Participante, Participante]>> = [];

    // Primeira rodada: pares consecutivos (0-1, 2-3, ...)
    const firstRound: Array<[Participante, Participante]> = [];
    for (let i = 0; i < participants.length; i += 2) {
        firstRound.push([participants[i] ?? null, participants[i + 1] ?? null]);
    }
    rounds.push(firstRound);

    // Gera rodadas seguintes (quartas, semi, final) com placeholders
    let currentCount = firstRound.length;
    while (currentCount > 1) {
        const nextRound: Array<[Participante, Participante]> = [];
        for (let i = 0; i < currentCount; i += 2) {
            // Cada placeholder guarda a referência ao jogo anterior (rodada, índice)
            nextRound.push([
                { placeholderWinnerOf: `${rounds.length - 1}-${i}` },
                { placeholderWinnerOf: `${rounds.length - 1}-${i + 1}` },
            ]);
        }
        rounds.push(nextRound);
        currentCount = nextRound.length;
    }

    return rounds;
}