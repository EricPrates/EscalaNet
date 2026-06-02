// src/modules/categoria/__tests__/categoria.service.test.ts
import { fazerCategoriaService } from '../../modules/categoria/categoria.service';  // ← caminho corrigido
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('CategoriaService', () => {
    let service: ReturnType<typeof fazerCategoriaService>;
    
    // ✅ Mock repository com as any
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
    describe('validação', () => {
    it('deve validar campos obrigatórios', async () => {
        const data = { nome: '', idadeMaxima: -5 };
        
        // Seu schema já deve validar isso
        await expect(service.criar(data as any)).rejects.toThrow();
    });
});

    describe('listar', () => {
        it('deve retornar lista paginada', async () => {
            const mockData = {
                data: [{ id: 1, nome: 'Categoria A', idadeMaxima: 15, ativa: true }],
                total: 1
            };
            mockRepo.listar.mockResolvedValue(mockData);

            const result = await service.listar(1, 10);

            expect(result).toBeDefined();
            expect(result.data).toHaveLength(1);
            expect(result.data?.[0]?.nome).toBe('Categoria A');
            expect(result.meta.total).toBe(1);
            expect(result.meta.pagina).toBe(1);
            expect(result.meta.limite).toBe(10);
        });

        it('deve retornar lista vazia quando não há dados', async () => {
            mockRepo.listar.mockResolvedValue({
                data: [],
                total: 0
            });

            const result = await service.listar(1, 10);

            expect(result.data).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });
    });

    describe('obterPorId', () => {
        it('deve retornar categoria quando encontrada', async () => {
            mockRepo.obterPorId.mockResolvedValue({
                id: 1,
                nome: 'Categoria A',
                idadeMaxima: 15,
                ativa: true
            });

            const result = await service.obterPorId(1);

            expect(result.id).toBe(1);
            expect(result.nome).toBe('Categoria A');
        });

        it('deve lançar erro quando não encontrada', async () => {
            mockRepo.obterPorId.mockResolvedValue(null);

            await expect(service.obterPorId(999)).rejects.toThrow('Categoria não encontrada');
        });
    });

    describe('obterPorNome', () => {
        it('deve retornar categoria quando encontrada', async () => {
            mockRepo.obterPorNome.mockResolvedValue({
                id: 1,
                nome: 'Categoria A',
                idadeMaxima: 15,
                ativa: true
            });

            const result = await service.obterPorNome('Categoria A');

            expect(result.nome).toBe('Categoria A');
        });

        it('deve lançar erro quando não encontrada', async () => {
            mockRepo.obterPorNome.mockResolvedValue(null);

            await expect(service.obterPorNome('Inexistente')).rejects.toThrow('Categoria não encontrada');
        });
    });

    describe('buscarPorIdadeMaxima', () => {
        it('deve retornar categoria quando encontrada', async () => {
            mockRepo.buscarPorIdadeMaxima.mockResolvedValue({
                id: 1,
                nome: 'Categoria A',
                idadeMaxima: 15,
                ativa: true
            });

            const result = await service.buscarPorIdadeMaxima(15);

            expect(result).toHaveProperty('idadeMaxima', 15);
        });

        it('deve retornar null quando não encontrada', async () => {
            mockRepo.buscarPorIdadeMaxima.mockResolvedValue(null);

            const result = await service.buscarPorIdadeMaxima(99);

            expect(result).toBeNull();
        });
    });

    describe('criar', () => {
        it('deve criar categoria com sucesso', async () => {
            mockRepo.obterPorNome.mockResolvedValue(null);
            mockRepo.criar.mockResolvedValue({
                id: 2,
                nome: 'Nova Categoria',
                idadeMaxima: 18,
                ativa: true
            });

            const data = { nome: 'Nova Categoria', idadeMaxima: 18, ativa: true };
            const result = await service.criar(data);

            expect(result.id).toBe(2);
            expect(result.nome).toBe('Nova Categoria');
            expect(mockRepo.obterPorNome).toHaveBeenCalledWith('Nova Categoria');
            expect(mockRepo.criar).toHaveBeenCalledWith(data);
        });

        it('deve lançar erro quando categoria já existe', async () => {
            mockRepo.obterPorNome.mockResolvedValue({
                id: 1,
                nome: 'Existente',
                idadeMaxima: 15,
                ativa: true
            });

            const data = { nome: 'Existente', idadeMaxima: 18, ativa: true };

            await expect(service.criar(data)).rejects.toThrow('Categoria já cadastrada');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar categoria com sucesso', async () => {
            mockRepo.atualizar.mockResolvedValue({
                id: 1,
                nome: 'Atualizada',
                idadeMaxima: 20,
                ativa: true
            });

            const result = await service.atualizar(1, { nome: 'Atualizada' });

            expect(result.nome).toBe('Atualizada');
            expect(mockRepo.atualizar).toHaveBeenCalledWith(1, { nome: 'Atualizada' });
        });

        it('deve lançar erro quando categoria não encontrada', async () => {
            mockRepo.atualizar.mockResolvedValue(null);

            await expect(service.atualizar(999, { nome: 'Teste' })).rejects.toThrow('Categoria não encontrada');
        });
    });

    describe('deletar', () => {
        it('deve deletar categoria com sucesso', async () => {
            mockRepo.deletar.mockResolvedValue(true);

            const result = await service.deletar(1);

            expect(result).toBe(true);
            expect(mockRepo.deletar).toHaveBeenCalledWith(1);
        });

        it('deve lançar erro quando categoria não encontrada', async () => {
            mockRepo.deletar.mockResolvedValue(false);

            await expect(service.deletar(999)).rejects.toThrow('Categoria não encontrada');
        });
    });
});