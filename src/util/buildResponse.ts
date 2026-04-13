import { BuildResponse } from '../types/util.types';


export const contrutorDeResposta = (status: number, message?: string, data?:any, detalhes?: string ): BuildResponse =>  {
    const response = {
        status,
        message,
    } as BuildResponse;

    if (data !== undefined) {
        response.data = data;
    }
    if (detalhes !== undefined) {
        response.detalhes = detalhes;
    }
    return response; 
};



