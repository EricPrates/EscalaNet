export function montarPaginacao(pagina: number, limite: number, total: number) {
    return {
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
    };
}