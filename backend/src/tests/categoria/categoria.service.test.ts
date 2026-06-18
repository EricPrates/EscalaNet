// src/modules/categoria/__tests__/categoria.service.test.ts
import { fazerCategoriaService } from '../../modules/categoria/categoria.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('CategoriaService', () => {
    let service: ReturnType<typeof fazerCategoriaService>;

    const mockRepo = {
        listar: jest.fn(),
        obterPorId: jest.fn(),
        obterPorNome: jest.fn(),
        criar: jest.fn(),
        atualizar: jest.fn(),
        deletar: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        service = fazerCategoriaService(mockRepo);
    });

    describe('listar', () => {
        it('deve retornar lista paginada', async () => {
            mockRepo.listar.mockResolvedValue({
                data: [{ id: 1, nome: 'Categoria A', idadeMaxima: 15, ativa: true }],
                total: 1
            });

            const result = await service.listar(1, 10);
            expect(result.data).toHaveLength(1);
            expect(result.data[0]!.nome).toBe('Categoria A');
        });

        it('deve retornar lista vazia quando não há dados', async () => {
            mockRepo.listar.mockResolvedValue({ data: [], total: 0 });
            const result = await service.listar(1, 10);
            expect(result.data).toHaveLength(0);
            expect(result.meta.total).toBe(0);
        });
    });

    describe('obterPorId', () => {
        it('deve retornar categoria quando encontrada', async () => {
            mockRepo.obterPorId.mockResolvedValue({ id: 1, nome: 'Categoria A', idadeMaxima: 15, ativa: true });
            const result = await service.obterPorId(1);
            expect(result!.id).toBe(1);
        });

        it('deve lançar erro quando não encontrada', async () => {
            mockRepo.obterPorId.mockResolvedValue(null);
            await expect(service.obterPorId(999)).rejects.toThrow('Categoria não encontrada');
        });
    });

    describe('obterPorNome', () => {
        it('deve retornar categoria quando encontrada', async () => {
            mockRepo.obterPorNome.mockResolvedValue({ id: 1, nome: 'Categoria A', idadeMaxima: 15, ativa: true });
            const result = await service.obterPorNome('Categoria A');
            expect(result.nome).toBe('Categoria A');
        });

        it('deve lançar erro quando não encontrada', async () => {
            mockRepo.obterPorNome.mockResolvedValue(null);
            await expect(service.obterPorNome('Inexistente')).rejects.toThrow('Categoria não encontrada');
        });
    });


    describe('criar', () => {
        it('deve criar categoria com sucesso', async () => {
            mockRepo.obterPorNome.mockResolvedValue(null);
            mockRepo.criar.mockResolvedValue({ id: 1, nome: 'Nova', idadeMaxima: 18, ativa: true });

            const data = { nome: 'Nova', idadeMaxima: 18, ativa: true };
            const result = await service.criar(data);
            expect(result.id).toBe(1);
            expect(result.nome).toBe('Nova');
        });

        it('deve lançar erro quando categoria já existe', async () => {
            mockRepo.obterPorNome.mockResolvedValue({ id: 1, nome: 'Existente', idadeMaxima: 15, ativa: true });
            const data = { nome: 'Existente', idadeMaxima: 18, ativa: true };
            await expect(service.criar(data)).rejects.toThrow('Categoria já cadastrada');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar categoria com sucesso', async () => {
            const categoriaExistente = { id: 1, nome: 'Categoria A', idadeMaxima: 15, ativa: true };
            const categoriaAtualizada = { ...categoriaExistente, nome: 'Atualizada' };

            // ✅ Configure o mock de obterPorId
            mockRepo.obterPorId.mockResolvedValue(categoriaExistente);
            mockRepo.atualizar.mockResolvedValue(categoriaAtualizada);

            // ✅ Adicione um spy para ver se está sendo chamado
            jest.spyOn(mockRepo, 'obterPorId');

            const result = await service.atualizar(1, { nome: 'Atualizada' });

            expect(mockRepo.obterPorId).toHaveBeenCalledWith(1);
            expect(result.nome).toBe('Atualizada');
        });

        it('deve lançar erro quando categoria não encontrada', async () => {
            mockRepo.obterPorId.mockResolvedValue(null);
            await expect(service.atualizar(999, { nome: 'Teste' })).rejects.toThrow('Categoria não encontrada');
        });
    });

    describe('deletar', () => {
        it('deve deletar categoria com sucesso', async () => {
            mockRepo.deletar.mockResolvedValue(true);
            const result = await service.deletar(1);
            expect(result).toBe(true);
        });

        it('deve lançar erro quando categoria não encontrada', async () => {
            mockRepo.deletar.mockResolvedValue(false);
            await expect(service.deletar(999)).rejects.toThrow('Categoria não encontrada');
        });
    });
});