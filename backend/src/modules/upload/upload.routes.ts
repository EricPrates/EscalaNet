import express, { Request, Response, NextFunction } from 'express';
import { uploadImagem, uploadDocumento, uploadVideo } from '../../shared/Middlewares/upload.middleware';
import { uploadParaCloudinary } from '../../shared/servicosExternos/uploadCloudinary.service';
import { montarRespostaSucesso } from '../../shared/utils/construtorResposta';
import { AppError } from '../../shared/utils/AppError';
import { verificarPermissao } from '../../shared/Middlewares/verificarPermissao';

const router = express.Router();

/**
 * POST /upload/imagem
 * Campo do form: "imagem"
 * Retorna: { url, publicId, formato, tamanhoBytes }
 */
router.post('/imagem', verificarPermissao('admin'), (req: Request, res: Response, next: NextFunction) => {
    uploadImagem(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file) return next(new AppError(400, 'Nenhuma imagem enviada'));

        const resultado = await uploadParaCloudinary(
            req.file.buffer,
            req.file.mimetype,
            'imagens'
        );

        return res.status(201).json(montarRespostaSucesso('Imagem enviada com sucesso', resultado));
    });
});

/**
 * POST /upload/documento
 * Campo do form: "documento"
 * Aceita: PDF, Word — max 10MB
 */
router.post('/documento',  (req: Request, res: Response, next: NextFunction) => {
    uploadDocumento(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file) return next(new AppError(400, 'Nenhum documento enviado'));

        const resultado = await uploadParaCloudinary(
            req.file.buffer,
            req.file.mimetype,
            'documentos'
        );

        return res.status(201).json(montarRespostaSucesso('Documento enviado com sucesso', resultado));
    });
});

/**
 * POST /upload/video
 * Campo do form: "video"
 * Aceita: MP4, MOV, AVI, WebM — max 100MB
 */
router.post('/video', (req: Request, res: Response, next: NextFunction) => {
    uploadVideo(req, res, async (err) => {
        if (err) return next(err);
        if (!req.file) return next(new AppError(400, 'Nenhum vídeo enviado'));

        const resultado = await uploadParaCloudinary(
            req.file.buffer,
            req.file.mimetype,
            'videos'
        );

        return res.status(201).json(montarRespostaSucesso('Vídeo enviado com sucesso', resultado));
    });
});

export default (app: express.Application) => {
    app.use('/upload', router);
};
