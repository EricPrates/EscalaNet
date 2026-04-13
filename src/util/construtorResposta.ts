import { MontarResposta } from "../Interfaces/util.types";


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
export const montarRespostaSucesso = (message?: string, data?: any): MontarResposta => {
    const response = {
        message,
    } as MontarResposta;
    if (data !== undefined) {
        response.data = data;
    }
    return response;
}




