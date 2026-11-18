import { z } from 'zod';

/**
 * Campos de auditoria padrão do TypeORM.
 * Aplique em qualquer schema de resposta cuja entidade use
 * @CreateDateColumn / @UpdateDateColumn.
 */
export const SchemaAuditFields = {
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
};