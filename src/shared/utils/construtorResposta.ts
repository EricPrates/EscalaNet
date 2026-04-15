import { MontarResposta } from "./util.types";


export const montarRespostaErro = (status: number, message?: string, detalhes?: string ): MontarResposta =>  {
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
        response.token = token ;
    }
    return response;
}




