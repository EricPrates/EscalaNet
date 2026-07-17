
import express from 'express';
import request from 'supertest';
import { fazerCategoriaController } from '../../modules/categoria/categoria.controller';
import { describe, beforeAll, test, expect, jest, beforeEach } from '@jest/globals';
import { CategoriaFactory } from '../schemaFactory';
import { AppError } from '../../shared/utils/AppError';
import { ICategoriaService } from '../../modules/categoria/categoria.interfaces';
import { ZodError } from 'zod';

describe('CategoriaController', () => {
    let app: express.Express;
    const mockService = {
        listar: jest.fn(),
        obterPorId: jest.fn(),
        criar: jest.fn(),
        atualizar: jest.fn(),
        deletar: jest.fn(),
        obterPorNome: jest.fn(),
    } as jest.Mocked<ICategoriaService>;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        const controller = fazerCategoriaController(mockService);

        app.get('/categorias', controller.listarCategorias);
        app.get('/categorias/:id', controller.obterCategoriaPorId);
        app.post('/categorias', controller.criarCategoria);
        app.put('/categorias/:id', controller.atualizarCategoria);
        app.delete('/categorias/:id', controller.deletarCategoria);

        app.use((err: any, req: any, res: any, next: any) => {
            if (err instanceof AppError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            if (err instanceof ZodError) {
                return res.status(400).json({ message: 'Dados de entrada inválidos', errors: err.issues });
            }
            if (err instanceof AppError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            return res.status(500).json({ message: 'Erro interno' });

        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /categorias', () => {
        test('deve retornar lista paginada de categorias', async () => {

            const categorias = CategoriaFactory.createList(2);
            mockService.listar.mockResolvedValue({
                data: categorias,
                meta: { total: 2, totalPaginas: 1, pagina: 1, limite: 10 },
            });


            const res = await request(app).get('/categorias?pagina=1&limite=10');

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Categorias listadas com sucesso');
            expect(res.body.data).toHaveLength(2);
            expect(res.body.data[0].nome).toBe('Categoria A');
            expect(mockService.listar).toHaveBeenCalledWith(1, 10, {}, {});
        });

        test('deve retornar lista com filtros', async () => {
            const categorias = CategoriaFactory.createList(5);
        
            mockService.listar.mockResolvedValue({
                data: categorias,
                meta: { total: 1, totalPaginas: 1, pagina: 1, limite: 10 },
            });

            const res = await request(app).get('/categorias?nome=Categoria B');
            console.log('Resposta do GET /categorias com filtro:', res.body);
            expect(res.status).toBe(200);
            expect(res.body.data[1].nome).toBe('Categoria B');


        });
    });

    describe('GET /categorias/:id', () => {
        test('deve retornar categoria por ID', async () => {
            const categoria = CategoriaFactory.create({ id: 5, nome: 'Especial' });
            mockService.obterPorId.mockResolvedValue(categoria);

            const res = await request(app).get('/categorias/5');

            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(5);
            expect(res.body.data.nome).toBe('Especial');
            expect(mockService.obterPorId).toHaveBeenCalledWith(5, {});
        });

        test('deve retornar 404 se categoria não encontrada', async () => {
            mockService.obterPorId.mockRejectedValue(new AppError(404, 'Categoria não encontrada'));

            const res = await request(app).get('/categorias/999');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Categoria não encontrada');
        });
    });

    describe('POST /categorias', () => {
        test('deve criar categoria e retornar 201', async () => {
            const payload = { nome: 'Nova', idadeMaxima: 18, ativa: true };
            const novaCategoria = CategoriaFactory.create({ id: 2, ...payload });
            mockService.criar.mockResolvedValue(novaCategoria);

            const res = await request(app).post('/categorias').send(payload);

            expect(res.status).toBe(201);
            expect(res.body.data.id).toBe(2);
            expect(res.body.data.nome).toBe('Nova');
            expect(mockService.criar).toHaveBeenCalledWith(payload);
        });

        test('deve retornar 400 se dados inválidos', async () => {
            const payload = { nome: '' }; // nome vazio
            // O controller não deve passar adiante, ele faz o parse do schema e lança erro.
            // Como o controller usa `SchemaCriarCategoria.parse`, que lança ZodError, o middleware de erro captura.
            // Vamos simular que o controller lança um erro (não precisamos mockar o service).
            // Mas para isso, precisamos que o controller realmente execute o parse.
            // Como é um teste de integração, vamos enviar dados inválidos e verificar o erro.

            const res = await request(app).post('/categorias').send(payload);

            // O erro será tratado pelo middleware de erro (ZodError)
            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Dados de entrada inválidos'); // depende do seu errorHandler
        });
    });

    describe('PUT /categorias/:id', () => {
        test('deve atualizar categoria e retornar 200', async () => {
            const payload = { ativa: true, nome: 'Atualizada'};
            const categoriaAtualizada = CategoriaFactory.create({ id: 1, nome: 'Atualizada' });
            mockService.atualizar.mockResolvedValue(categoriaAtualizada);

            const res = await request(app).put('/categorias/1').send(payload);
            console.log('Resposta do PUT /categorias/1:', res.body);
            expect(res.status).toBe(200);
            expect(res.body.data.ativa).toBe(true);
            expect(mockService.atualizar).toHaveBeenCalledWith(1, payload);
            
        });

        test('deve retornar 404 se categoria não encontrada', async () => {
            mockService.atualizar.mockRejectedValue(new AppError(404, 'Categoria não encontrada'));

            const res = await request(app).put('/categorias/999').send({ nome: 'Teste' });

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Categoria não encontrada');
        });
    });

    describe('DELETE /categorias/:id', () => {
        test('deve deletar categoria e retornar 204', async () => {
            mockService.deletar.mockResolvedValue(true);

            const res = await request(app).delete('/categorias/1');

            expect(res.status).toBe(204);
            expect(mockService.deletar).toHaveBeenCalledWith(1);
        });

        test('deve retornar 404 se categoria não encontrada', async () => {
            mockService.deletar.mockRejectedValue(new AppError(404, 'Categoria não encontrada'));

            const res = await request(app).delete('/categorias/999');
            
            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Categoria não encontrada');
        });
    });
});