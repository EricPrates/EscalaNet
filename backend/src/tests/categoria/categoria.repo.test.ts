// src/tests/categoria/categoria.repo.integration.test.ts
import { AppDataSource } from '../../../data-source';
import { Like } from 'typeorm';
import {describe, it, expect, beforeAll, afterAll, beforeEach} from '@jest/globals';
import { fazerCategoriaRepo } from '../../modules/categoria/categoria.repo';


describe('CategoriaRepository (Integração)', () => {
    let repo: ReturnType<typeof fazerCategoriaRepo>;

    beforeAll(async () => {
        await AppDataSource.initialize(); // Conecta no banco de teste
        repo = fazerCategoriaRepo(AppDataSource);
    });

    afterAll(async () => {
        await AppDataSource.dropDatabase(); // Limpa tudo
        await AppDataSource.destroy();
    });

    beforeEach(async () => {
        // Desabilita verificações de chave estrangeira
        await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
        
        // Limpa as tabelas na ordem correta (filhas primeiro)
        await AppDataSource.getRepository('times').clear();    // filha
        await AppDataSource.getRepository('categorias').clear(); // pai
        
        // Reabilita as verificações
        await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
    });

    it('deve criar uma categoria no banco', async () => {
        const data = { nome: 'Integração', idadeMaxima: 10, ativa: true };
        
        
        const categoria = await repo.criar(data);
        
        
        expect(categoria.id).toBeDefined();
        expect(categoria.nome).toBe('Integração');

        
        const buscada = await repo.obterPorId(categoria.id);
        expect(buscada?.nome).toBe('Integração');
    });

    it('deve listar categorias com filtro LIKE', async () => {
        // Arrange: insere dados reais no banco
        await repo.criar({ nome: 'Sub-15', idadeMaxima: 15, ativa: true });
        await repo.criar({ nome: 'Sub-17', idadeMaxima: 17, ativa: true });

        // Act: chama o listar com filtro
        const where = { nome: Like('%Sub-1%') };
        const { data, total } = await repo.listar(1, 10, where);

        // Assert
        expect(total).toBe(2);
        expect(data[0]!.nome).toContain('Sub-1');
    });
});