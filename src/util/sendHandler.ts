
import { HTTP_STATUS,STANDARD_MESSAGES } from './sendMessages';
import { buildResponse } from './buildResponse';
import { Response } from 'express';


const sendHandler = (res: Response, status: number, message: string, data?: any): Response => {
    const resp = buildResponse(status, message, data);
    return res.status(resp.status).json(resp);
};

export const Send = {
     send(res: Response, code: number, message: string, data?: any) {
        return sendHandler(res, code, message, data);
    },
    sendBadRequest(res: Response, message?: string) {
        return sendHandler(res, HTTP_STATUS.BAD_REQUEST, message || STANDARD_MESSAGES.BAD_REQUEST);
    },


    sendUnauthorized(res: Response, message?: string) {
        return sendHandler(res, HTTP_STATUS.UNAUTHORIZED, message || STANDARD_MESSAGES.UNAUTHORIZED);
    },
    sendForbidden(res: Response, message?: string) {
        return sendHandler(res, HTTP_STATUS.FORBIDDEN, message || STANDARD_MESSAGES.FORBIDDEN);
    },
    sendNotFound(res: Response, message?: string) {
        return sendHandler(res, HTTP_STATUS.NOT_FOUND, message || STANDARD_MESSAGES.NOT_FOUND);
    },
    sendInternalServerError(res: Response, message?: string) {
        return sendHandler(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message || STANDARD_MESSAGES.INTERNAL_SERVER_ERROR);
    },
    sendConflict(res: Response, message?: string) {
        return sendHandler(res, HTTP_STATUS.CONFLICT, message || STANDARD_MESSAGES.CONFLICT);
    },
    sendUnprocessableEntity(res: Response, message?: string) {
        return sendHandler(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, message || STANDARD_MESSAGES.UNPROCESSABLE_ENTITY);
    },
    sendSuccess(res: Response, message?: string, data?: any) {
        return sendHandler(res, HTTP_STATUS.OK, message || STANDARD_MESSAGES.SUCCESS, data);
    },
    sendCreated(res: Response, message?: string, data?: any) {
        return sendHandler(res, HTTP_STATUS.CREATED, message || STANDARD_MESSAGES.CREATED, data);
    },
    sendAccepted(res: Response, message?: string, data?: any) {
        return sendHandler(res, HTTP_STATUS.ACCEPTED, message || STANDARD_MESSAGES.ACCEPTED, data);
    },
    sendNoContent(res: Response, message?: string, data?: any) {
        return sendHandler(res, HTTP_STATUS.NO_CONTENT, message || STANDARD_MESSAGES.NO_CONTENT, data);
    },
    sendBadGateway(res: Response, message?: string, data?: any) {
        return sendHandler(res, HTTP_STATUS.BAD_GATEWAY, message || STANDARD_MESSAGES.BAD_GATEWAY, data);
    },
    sendServiceUnavailable(res: Response, message?: string, data?: any) {
        return sendHandler(res, HTTP_STATUS.SERVICE_UNAVAILABLE, message || STANDARD_MESSAGES.SERVICE_UNAVAILABLE, data);
    },
    sendServerError(res: Response, message?: string, data?: any) {
        return sendHandler(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message || STANDARD_MESSAGES.INTERNAL_SERVER_ERROR, data);
    }
   
}
