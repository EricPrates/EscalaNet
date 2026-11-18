import { FindOptionsWhere, ILike } from 'typeorm';

type FieldType = 'exact' | 'like' | 'relation' | 'relationLike';

interface FieldConfig {
    type: FieldType;
    /** Para `relation`: caminho no objeto where. Ex: 'time' ou 'time.nucleo' */
    path?: string;
    /** Para `relation`: chave dentro da relação. Default: 'id' */
    key?: string;
}

/**
 * Constrói um FindOptionsWhere a partir dos filtros validados.
 *
 * @example
 * buildWhere<Jogador>(filtros, {
 *   id: { type: 'exact' },
 *   nome: { type: 'like' },
 *   timeId: { type: 'relation', path: 'time' },
 *   nucleoId: { type: 'relation', path: 'time.nucleo' },
 *   categoriaId: { type: 'relation', path: 'time.categorias' },
 * });
 */
export function buildWhere<T>(
    filtros: Record<string, any>,
    config: Record<string, FieldConfig>,
): FindOptionsWhere<T> {
    const where: Record<string, any> = {};

    for (const [campo, cfg] of Object.entries(config)) {
        const valor = filtros[campo];
        if (valor === undefined || valor === null || valor === '') continue;

        switch (cfg.type) {
            case 'exact':
                where[campo] = valor;
                break;

            case 'like':
                where[campo] = ILike(`%${valor}%`);
                break;

            case 'relation': {
                const path = cfg.path ?? campo;
                const key = cfg.key ?? 'id';
                setNested(where, path, { [key]: valor });
                break;
            }

            case 'relationLike': {
                const path = cfg.path ?? campo;
                const key = cfg.key ?? 'nome';
                setNested(where, path, { [key]: ILike(`%${valor}%`) });
                break;
            }
        }
    }

    return where as FindOptionsWhere<T>;
}

/** Escreve where.a.b.c = value, criando os níveis intermediários. */
function setNested(obj: Record<string, any>, path: string, value: any) {
    const parts = path.split('.');
    let cursor = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        cursor[parts[i]!] ??= {};
        cursor = cursor[parts[i]!];
    }
    const last = parts[parts.length - 1];
    // Se já existe (ex: time.id e time.nucleo.id), mescla em vez de sobrescrever
    cursor[last!] = { ...(cursor[last!] ?? {}), ...value };
}