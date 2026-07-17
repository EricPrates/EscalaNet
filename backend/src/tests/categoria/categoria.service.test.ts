
import { fazerCategoriaService } from '../../modules/categoria/categoria.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ICategoriaRepository } from '../../modules/categoria/categoria.interfaces';
import {CategoriaEntityFactory, TimeEntityFactory} from "../entidadeFactory";

describe('CategoriaService', () => {
    let service: ReturnType<typeof fazerCategoriaService>;

    const mockRepo = {
    listar: jest.fn(),
    obterPorId: jest.fn(),
    obterPorNome: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
} as jest.Mocked<ICategoriaRepository>;

    beforeEach(() => {
        jest.clearAllMocks();
        service = fazerCategoriaService(mockRepo);
    });

    describe('listar', () => {
        it('deve retornar lista paginada', async () => {
       
            const categoriaComTimes = CategoriaEntityFactory.create({
                times: TimeEntityFactory.createList(2)
            });

            mockRepo.listar.mockResolvedValue({
                data: [categoriaComTimes],
                total: 1
            });

            const result = await service.listar(1, 10);
            expect(result.data).toHaveLength(1);
            expect(result.data[0]!.nome).toBe('Categoria A');
            expect(result.data[0]!.times).toHaveLength(2);
            expect(result.meta.total).toBe(1);
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
            const categoria = CategoriaEntityFactory.create({ id: 1 });
            mockRepo.obterPorId.mockResolvedValue(categoria);

            const result = await service.obterPorId(1);
            expect(result!.id).toBe(1);
            expect(result!.nome).toBe('Categoria A');
        });

        it('deve lançar erro quando não encontrada', async () => {
            mockRepo.obterPorId.mockResolvedValue(null);
            await expect(service.obterPorId(999)).rejects.toThrow('Categoria não encontrada');
        });
    });

    describe('obterPorNome', () => {
        it('deve retornar categoria quando encontrada', async () => {
            const categoria = CategoriaEntityFactory.create({ nome: 'Categoria A' });
            mockRepo.obterPorNome.mockResolvedValue(categoria);

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
            const novaCategoria = CategoriaEntityFactory.create({ id: 1, nome: 'Nova', idadeMaxima: 18 });

            mockRepo.obterPorNome.mockResolvedValue(null);
            mockRepo.criar.mockResolvedValue(novaCategoria);

            const data = { nome: 'Nova', idadeMaxima: 18, ativa: true };
            const result = await service.criar(data);
            expect(result.id).toBe(1);
            expect(result.nome).toBe('Nova');
            expect(mockRepo.criar).toHaveBeenCalledWith(data);
        });

        it('deve lançar erro quando categoria já existe', async () => {
            const categoriaExistente = CategoriaEntityFactory.create({ nome: 'Existente' });
            mockRepo.obterPorNome.mockResolvedValue(categoriaExistente);

            const data = { nome: 'Existente', idadeMaxima: 18, ativa: true };
            await expect(service.criar(data)).rejects.toThrow('Categoria já cadastrada');
        });
    });

    describe('atualizar', () => {
        it('deve atualizar categoria com sucesso', async () => {
            const categoriaExistente = CategoriaEntityFactory.create({ id: 1, nome: 'Categoria A' });
            const categoriaAtualizada = CategoriaEntityFactory.create({ id: 1, nome: 'Atualizada' });

            mockRepo.obterPorId.mockResolvedValue(categoriaExistente);
            mockRepo.atualizar.mockResolvedValue(categoriaAtualizada);

            const result = await service.atualizar(1, { nome: 'Atualizada' });

            expect(mockRepo.obterPorId).toHaveBeenCalledWith(1);
            expect(mockRepo.atualizar).toHaveBeenCalledWith(1, { nome: 'Atualizada' });
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