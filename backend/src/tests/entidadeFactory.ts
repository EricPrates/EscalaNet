// src/tests/factories/entity.factories.ts
import { Categoria } from '../modules/categoria/Categoria.model';
import { Chamada } from '../modules/chamada/chamada.model';
import { Time } from '../modules/time/time.model';
import { Jogador } from '../modules/jogador/jogador.model';
import { Jogo } from '../modules/jogo/Jogo.model';
import { Usuario } from '../modules/usuario/Usuario.model';
import { EventosJogo } from '../modules/eventos_jogo/EventosJogo.model';
import { Frequencia } from '../modules/frequencia/frequencia.model';
import { Nucleo } from '../modules/nucleo/Nucleo.model';
import { Treino } from '../modules/treino/Treino.model';
import { Material } from '../modules/material/material.model';
import { Competicao } from '../modules/competicao/Competicao.model';
import { Classificacao } from '../modules/classificacao/Classificacao.model';
import { Postagem } from '../modules/postagem/postagem.model';

// ============================================
// ENTITY FACTORIES
// ============================================

export class NucleoEntityFactory {
    static create(params?: Partial<Nucleo>): Nucleo {
        const base: Nucleo = {
            id: 1,
            nome: 'Núcleo A',
            endereco: 'Rua X, 123',
            eventos: [],
            jogadores: [],
            frequencias: [],
            chamadas: [],
            times: [],
            treinos: [],
            usuariosVinculados: [],
            eventosJogo: [],
            materiais: {} as Material[], // auto-relacionamento, pode ser undefined ou nulo
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Nucleo>): Nucleo[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Núcleo ${String.fromCharCode(65 + i)}` })
        );
    }
}

export class UsuarioEntityFactory {
    static create(params?: Partial<Usuario>): Usuario {
        const base: Usuario = {
            id: 1,
            nome: 'Usuário A',
            email: 'usuario@test.com',
            senha: 'hash_senha',
            permissao: 'professor',
            nucleoVinculado: NucleoEntityFactory.create({ id: 1 }),
            treinos: [],
            jogos: [],
            eventos: [],
            postagem: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Usuario>): Usuario[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Usuário ${String.fromCharCode(65 + i)}`, email: `usuario${i+1}@test.com` })
        );
    }
}

export class CategoriaEntityFactory {
    static create(params?: Partial<Categoria>): Categoria {
        const base: Categoria = {
            id: 1,
            nome: 'Categoria A',
            idadeMaxima: 15,
            ativa: true,
            times: [],
            jogos: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Categoria>): Categoria[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Categoria ${String.fromCharCode(65 + i)}` })
        );
    }
}

export class TimeEntityFactory {
    static create(params?: Partial<Time>): Time {
        const base: Time = {
            id: 1,
            nome: 'Time A',
            nucleo: NucleoEntityFactory.create({ id: 1 }),
            categoria: CategoriaEntityFactory.create({ id: 1 }),
            treinador: UsuarioEntityFactory.create({ id: 1 }),
            jogadores: [],
            jogosComoTimeA: [],
            jogosComoTimeB: [],
            eventos: [],
            competicoes: [],
            chamadas: [],
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Time>): Time[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Time ${String.fromCharCode(65 + i)}` })
        );
    }
}

export class JogadorEntityFactory {
    static create(params?: Partial<Jogador>): Jogador {
        const base: Jogador = {
            id: 1,
            nome: 'Jogador A',
            dataNascimento: new Date('2000-01-01'),
            nucleo: NucleoEntityFactory.create({ id: 1 }),
            time: TimeEntityFactory.create({ id: 1 }),
            treinos: [],
            frequencias: [],
            eventos: [],
            ativo: true,
            telefone: '(11) 99999-9999',
            responsavel: 'Responsável A',
            cpf: '123.456.789-00',
            createdAt: new Date(),
            updatedAt: new Date(),
            matricula: 'MAT12345',
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Jogador>): Jogador[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Jogador ${String.fromCharCode(65 + i)}` })
        );
    }
}

export class JogoEntityFactory {
    static create(params?: Partial<Jogo>): Jogo {
        const base: Jogo = {
            id: 1,
            nome: 'Jogo A',
            data: new Date(),
            timeA: TimeEntityFactory.create({ id: 1 }),
            timeB: TimeEntityFactory.create({ id: 2 }),
            arbitro: UsuarioEntityFactory.create({ id: 1 }),
            categoria: CategoriaEntityFactory.create({ id: 1 }),
            golsTimeA: 0,
            golsTimeB: 0,
            finalizado: false,
            competicao: undefined,
            chave: 'R1-G1',
            eventos: [],
            chamadas: [],
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Jogo>): Jogo[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Jogo ${String.fromCharCode(65 + i)}` })
        );
    }
}

export class EventosJogoEntityFactory {
    static create(params?: Partial<EventosJogo>): EventosJogo {
        const base: EventosJogo = {
            id: 1,
            tipo: 'gol',
            descricao: 'Gol de falta',
            minuto: 15,
            jogo: JogoEntityFactory.create({ id: 1 }),
            usuario: UsuarioEntityFactory.create({ id: 1 }),
            time: TimeEntityFactory.create({ id: 1 }),
            nucleo: NucleoEntityFactory.create({ id: 1 }),
            jogadorEnvolvido: JogadorEntityFactory.create({ id: 1 }),
            acrescimo: null,
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<EventosJogo>): EventosJogo[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}

export class ChamadaEntityFactory {
    static create(params?: Partial<Chamada>): Chamada {
        const base: Chamada = {
            id: 1,
            data: new Date(),
            nucleo: NucleoEntityFactory.create({ id: 1 }),
            time: TimeEntityFactory.create({ id: 1 }),
            treino: undefined,
            jogo: undefined,
            frequencias: [],
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Chamada>): Chamada[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}

export class FrequenciaEntityFactory {
    static create(params?: Partial<Frequencia>): Frequencia {
        const base: Frequencia = {
            id: 1,
            presente: true,
            jogador: JogadorEntityFactory.create({ id: 1 }),
            nucleo: NucleoEntityFactory.create({ id: 1 }),
            chamada: ChamadaEntityFactory.create({ id: 1 }),
            justificativa: 'Justificativa',
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Frequencia>): Frequencia[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}

export class TreinoEntityFactory {
    static create(params?: Partial<Treino>): Treino {
        const base: Treino = {
            id: 1,
            data: new Date(),
            nucleo: NucleoEntityFactory.create({ id: 1 }),
            jogadores: [],
            usuarios: [],
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Treino>): Treino[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}

export class MaterialEntityFactory {
    static create(params?: Partial<Material>): Material {
        const base: Material = {
            id: 1,
            nucleo: NucleoEntityFactory.create({ id: 1 }),
            quantidade: 10,
            dataRecebimento: new Date(),
            observacao: 'Observação',
            tipoMaterial: 'Material A',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Material>): Material[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}

export class CompeticaoEntityFactory {
    static create(params?: Partial<Competicao>): Competicao {
        const base: Competicao = {
            id: 1,
            nome: 'Competição A',
            tipo: 'Liga',
            intervaloDias: 7,
            duplaVolta: false,
            jogos: [],
            times: [],
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Competicao>): Competicao[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Competição ${String.fromCharCode(65 + i)}` })
        );
    }
}

export class ClassificacaoEntityFactory {
    static create(params?: Partial<Classificacao>): Classificacao {
        const base: Classificacao = {
            id: 1,
            competicao: CompeticaoEntityFactory.create({ id: 1 }),
            time: TimeEntityFactory.create({ id: 1 }),
            pontos: 9,
            jogos: 3,
            vitorias: 3,
            empates: 0,
            derrotas: 0,
            golsPro: 6,
            golsContra: 1,
            saldoGols: 5,
            aproveitamento: 100,
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Classificacao>): Classificacao[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}

export class PostagemEntityFactory {
    static create(params?: Partial<Postagem>): Postagem {
        const base: Postagem = {
            id: 1,
            titulo: 'Título da Postagem',
            conteudo: 'Conteúdo da postagem',
            imagemUrl: 'https://example.com/image.jpg',
            resumo: 'Resumo da postagem',
            status: 'publicado',
            autor: UsuarioEntityFactory.create({ id: 1 }),
            createdAt: new Date(),
            updatedAt: new Date(),
            publicadoEm: new Date(),
        };
        return { ...base, ...params };
    }
    static createList(count: number = 3, params?: Partial<Postagem>): Postagem[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, titulo: `Postagem ${String.fromCharCode(65 + i)}` })
        );
    }
}