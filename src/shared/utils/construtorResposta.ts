import { MontarResposta, MontarRespostaPaginada } from "./util.types";


export const montarRespostaErro = (status: number, message?: string, detalhes?: string): MontarResposta => {
    const response = {
        status,
        message,
    } as MontarResposta;

    if (detalhes !== undefined) {
        response.detalhes = detalhes;
    }
    return response;
};
export const montarRespostaSucesso = (message: string, data?: any, token?: string): MontarResposta => {
    const response = {
        message,
    } as MontarResposta;
    if (data !== undefined) {
        response.data = data;
    }
    if (token !== undefined) {
        response.token = token;
    }
    return response;
}

export const montarRespostaPaginada = <T>(
    message: string,
    data: T[],
    meta: { total: number; totalPaginas: number; pagina: number; limite: number }
): MontarRespostaPaginada<T> => {
    return {
        message,
        data,
        meta: {
            total: meta.total,
            totalPaginas: meta.totalPaginas,
            pagina: meta.pagina,
            limite: meta.limite,
        }
    };
};




