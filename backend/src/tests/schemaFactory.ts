// src/tests/factories/factories.ts
import { SchemaBaseCategoria, RespostaCategoriaDTO } from '../modules/categoria/categoria.schemas';
import { SchemaBaseChamada, RespostaChamadaDTO } from '../modules/chamada/chamada.schemas';
import { SchemaTimeResposta, RespostaTimeDTO } from '../modules/time/time.schemas';
import { SchemaJogadorResumido, RespostaResumidaJogadorDTO } from '../modules/jogador/jogador.schemas';
import { SchemaJogoResposta, RespostaJogoDTO } from '../modules/jogo/jogo.schemas';
import { SchemaUsuarioResumido, RespostaUsuarioDTO } from '../modules/usuario/usuario.schemas';
import { SchemaEventoJogoRespostaDetalhada, RespostaEventoJogoDTO } from '../modules/eventos_jogo/eventos_jogo.schemas';
import { SchemaFrequenciaResposta, RespostaFrequenciaDTO } from '../modules/frequencia/frequencia.schemas';
import { SchemaNucleoResposta, RespostaNucleoDTO } from '../modules/nucleo/nucleo.schemas';
import { SchemaTreinoResposta, RespostaTreinoDTO } from '../modules/treino/treino.schemas';
import { SchemaMaterialResposta, RespostaMaterialDTO } from '../modules/material/material.schemas';
import { SchemaBaseCompeticao, RespostaCompeticaoDTO } from '../modules/competicao/competicao.schemas';
import { SchemaBaseClassificacao, RespostaClassificacaoDTO } from '../modules/classificacao/classificacao.schemas';

export class CategoriaFactory {
    static create(params?: Partial<RespostaCategoriaDTO>): RespostaCategoriaDTO {
        const base = {
            id: 1,
            ativa: true,
            nome: 'Categoria A',
            idadeMaxima: 15,
            createdAt: undefined,
            updatedAt: undefined,
        };
        return SchemaBaseCategoria.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaCategoriaDTO>): RespostaCategoriaDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Categoria ${String.fromCharCode(65 + i)}` })
        );
    }
}

// Chamada
export class ChamadaFactory {
    static create(params?: Partial<RespostaChamadaDTO>): RespostaChamadaDTO {
        const base = {
            id: 1,
            data: new Date(),
            time: { id: 1, nome: 'Time A' },
            nucleo: { id: 1, nome: 'Núcleo A' },
            jogo: undefined,
            treino: undefined,
        };
        return SchemaBaseChamada.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaChamadaDTO>): RespostaChamadaDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}


export class TimeFactory {
    static create(params?: Partial<RespostaTimeDTO>): RespostaTimeDTO {
        const base = {
            id: 1,
            nome: 'Time A',
            nucleo: { id: 1, nome: 'Núcleo A' },
            categoria: { id: 1, nome: 'Categoria A' },
            treinador: { id: 1, nome: 'Treinador A' },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return SchemaTimeResposta.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaTimeDTO>): RespostaTimeDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Time ${String.fromCharCode(65 + i)}`, treinador: { id: i + 1, nome: `Treinador ${String.fromCharCode(65 + i)}` } })
        );
    }
}


export class JogadorFactory {
    static create(params?: Partial<RespostaResumidaJogadorDTO>): RespostaResumidaJogadorDTO {
        const base = {
            id: 1,
            nome: 'Jogador A',
            dataNascimento: new Date('2000-01-01'),
            ativo: true,
            telefone: '(11) 99999-9999',
        };
        return SchemaJogadorResumido.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaResumidaJogadorDTO>): RespostaResumidaJogadorDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Jogador ${String.fromCharCode(65 + i)}` })
        );
    }
}

// Jogo
export class JogoFactory {
    static create(params?: Partial<RespostaJogoDTO>): RespostaJogoDTO {
        const base = {
            id: 1,
            nome: 'Jogo A',
            data: new Date(),
            timeA: { id: 1, nome: 'Time A' },
            timeB: { id: 2, nome: 'Time B' },
            golsTimeA: 0,
            golsTimeB: 0,
            finalizado: false,
        };
        return SchemaJogoResposta.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaJogoDTO>): RespostaJogoDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Jogo ${String.fromCharCode(65 + i)}` })
        );
    }
}

// Usuario
export class UsuarioFactory {
    static create(params?: Partial<RespostaUsuarioDTO>): RespostaUsuarioDTO {
        const base = {
            id: 1,
            nome: 'Usuário A',
            email: 'usuario@test.com',
            permissao: 'professor' as const,
            nucleoVinculado: { id: 1, nome: 'Núcleo A' },
        };
        return SchemaUsuarioResumido.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaUsuarioDTO>): RespostaUsuarioDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Usuário ${String.fromCharCode(65 + i)}`, email: `usuario${i+1}@test.com` })
        );
    }
}

// EventosJogo
export class EventosJogoFactory {
    static create(params?: Partial<RespostaEventoJogoDTO>): RespostaEventoJogoDTO {
        const base = {
            id: 1,
            tipo: 'gol' as const,
            descricao: 'Gol de falta',
            minuto: 15,
            jogo: { id: 1, nome: 'Jogo A', data: new Date() },
            usuario: { id: 1, nome: 'Usuário A' },
            nucleo: { id: 1, nome: 'Núcleo A' },
            jogadorEnvolvido: { id: 1, nome: 'Jogador A' },
        };
        return SchemaEventoJogoRespostaDetalhada.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaEventoJogoDTO>): RespostaEventoJogoDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}


export class FrequenciaFactory {
    static create(params?: Partial<RespostaFrequenciaDTO>): RespostaFrequenciaDTO {
        const base = {
            id: 1,
            presente: true,
            jogador: { id: 1, nome: 'Jogador A' },
            chamada: { id: 1, data: new Date() },
        };
        return SchemaFrequenciaResposta.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaFrequenciaDTO>): RespostaFrequenciaDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}


export class NucleoFactory {
    static create(params?: Partial<RespostaNucleoDTO>): RespostaNucleoDTO {
        const base = {
            id: 1,
            nome: 'Núcleo A',
            endereco: 'Rua X, 123',
        };
        return SchemaNucleoResposta.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaNucleoDTO>): RespostaNucleoDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Núcleo ${String.fromCharCode(65 + i)}` })
        );
    }
}

// Treino
export class TreinoFactory {
    static create(params?: Partial<RespostaTreinoDTO>): RespostaTreinoDTO {
        const base = {
            id: 1,
            data: new Date(),
            nucleo: { id: 1, nome: 'Núcleo A' },
        };
        return SchemaTreinoResposta.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaTreinoDTO>): RespostaTreinoDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}

// Material
export class MaterialFactory {
    static create(params?: Partial<RespostaMaterialDTO>): RespostaMaterialDTO {
        const base = {
            id: 1,
            quantidade: 10,
            dataRecebimento: new Date(),
            observacao: 'Observação',
            tipoMaterial: 'Material A',
            nucleo: { id: 1, nome: 'Núcleo A' },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return SchemaMaterialResposta.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaMaterialDTO>): RespostaMaterialDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}


export class CompeticaoFactory {
    static create(params?: Partial<RespostaCompeticaoDTO>): RespostaCompeticaoDTO {
        const base = {
            id: 1,
            nome: 'Competição A',
            tipo: 'Liga' as const,
            intervaloDias: 7,
            duplaVolta: false,
        };
        return SchemaBaseCompeticao.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaCompeticaoDTO>): RespostaCompeticaoDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1, nome: `Competição ${String.fromCharCode(65 + i)}` })
        );
    }
}

// Classificacao
export class ClassificacaoFactory {
    static create(params?: Partial<RespostaClassificacaoDTO>): RespostaClassificacaoDTO {
        const base = {
            id: 1,
            competicao: { id: 1, nome: 'Competição A' },
            time: { id: 1, nome: 'Time A' },
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
        return SchemaBaseClassificacao.parse({ ...base, ...params });
    }
    static createList(count: number = 3, params?: Partial<RespostaClassificacaoDTO>): RespostaClassificacaoDTO[] {
        return Array.from({ length: count }, (_, i) =>
            this.create({ ...params, id: i + 1 })
        );
    }
}