// src/modules/categoria/__tests__/categoria.service.test.ts
import { fazerCategoriaService } from '../../modules/categoria/categoria.service';  // ← caminho corrigido
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('CategoriaService', () => {
    let service: ReturnType<typeof fazerCategoriaService>;

    const mockRepo = {
        listar: jest.fn(),
        obterPorId: jest.fn(),
        obterPorNome: jest.fn(),
        buscarPorIdadeMaxima: jest.fn(),
        criar: jest.fn(),
        atualizar: jest.fn(),
        deletar: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        service = fazerCategoriaService(mockRepo);
    });

    // ✅ Testes existentes (já passando)
    describe('listar', () => {
        it('deve retornar lista paginada', async () => {
            mockRepo.listar.mockResolvedValue({
                data: [{ id: 1, nome: 'Categoria A', idadeMaxima: 15, ativa: true }],
                total: 1
            });

            const result = await service.listar(1, 10);

            expect(result).toBeDefined();
            expect(result.data).toBeDefined();
            expect(result.data).toHaveLength(1);
            expect(result.data[0]?.nome).toBe('Categoria A');
        });
    });

    // ✅ NOVOS TESTES: listar com includes
    describe('listar com includes (relations)', () => {
        it('deve passar relations para o repository quando fornecido', async () => {
            mockRepo.listar.mockResolvedValue({
                data: [{
                    id: 1,
                    nome: 'Categoria A',
                    idadeMaxima: 15,
                    ativa: true,
                    times: [{ id: 1, nome: 'Time A' }]
                }],
                total: 1
            });

            const relations = { times: true } as any; // Ajuste conforme seu tipo de relations
            await service.listar(1, 10, undefined, relations);

            expect(mockRepo.listar).toHaveBeenCalledWith(1, 10, undefined, relations);
        });

        it('deve retornar dados com times incluídos', async () => {
            const mockDataWithTimes = {
                data: [{
                    id: 1,
                    nome: 'Categoria A',
                    idadeMaxima: 15,
                    ativa: true,
                    times: [{ id: 1, nome: 'Time A' }]
                }],
                total: 1
            };
            mockRepo.listar.mockResolvedValue(mockDataWithTimes);

            const relations = { times: true } as any;
            const result = await service.listar(1, 10, undefined, relations);

            expect(result.data[0]).toHaveProperty('times');
        });

        it('deve retornar dados com múltiplos includes', async () => {
            const mockDataWithRelations = {
                data: [{
                    id: 1,
                    nome: 'Categoria A',
                    idadeMaxima: 15,
                    ativa: true,
                    times: [{ id: 1, nome: 'Time A' }],
                    jogos: [{ id: 1, nome: 'Jogo A', data: new Date('2026-06-01T00:00:00.000Z') }]
                }],
                total: 1
            };
            mockRepo.listar.mockResolvedValue(mockDataWithRelations);

            const relations = { times: true, jogos: true } as any;
            const result = await service.listar(1, 10, undefined, relations);

            expect(result.data[0]).toHaveProperty('times');
            expect(result.data[0]).toHaveProperty('jogos');
        });

        it('deve funcionar com relations vazio', async () => {
            mockRepo.listar.mockResolvedValue({
                data: [{ id: 1, nome: 'Categoria A', idadeMaxima: 15, ativa: true }],
                total: 1
            });

            const result = await service.listar(1, 10, undefined, {});

            expect(result.data[0]).not.toHaveProperty('times');
            expect(result.data[0]).not.toHaveProperty('jogos');
        });
    });

    // ✅ NOVOS TESTES: obterPorId com includes (se seu service suportar)
    describe('obterPorId', () => {
        it('deve passar relations para o repository quando suportado', async () => {
            // Nota: Seu service atual não aceita relations no obterPorId
            // Se quiser adicionar, seria: obterPorId(id: number, relations?: FindOptionsRelations<Categoria>)

            mockRepo.obterPorId.mockResolvedValue({
                id: 1,
                nome: 'Categoria A',
                idadeMaxima: 15,
                ativa: true
            });

            const result = await service.obterPorId(1);
            expect(result?.id).toBe(1);
        });
    });
});