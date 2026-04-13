import { BuildResponse } from '../types/util.types';


export const buildResponse = (status: number, message: string, data?:any ): BuildResponse =>  {
    const response = {
        status,
        message,
    } as BuildResponse;

    if (data !== undefined) {
        response.data = data;
    }
    return response; 
};



