import multer from 'multer';
import { AppError } from '../utils/AppError';

const TIPOS_IMAGEM = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TIPOS_DOCUMENTO = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const TIPOS_VIDEO = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

const TODOS_TIPOS = [...TIPOS_IMAGEM, ...TIPOS_DOCUMENTO, ...TIPOS_VIDEO];

// Armazena o arquivo em memória como buffer (sem salvar em disco)
const storage = multer.memoryStorage();

function criarFiltroMimeType(tiposPermitidos: string[]) {
    return (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError(400, 'Tipo de arquivo não permitido', `Permitidos: ${tiposPermitidos.join(', ')}`));
        }
    };
}

/** Upload de imagem única (campo "imagem") — max 5MB */
export const uploadImagem = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: criarFiltroMimeType(TIPOS_IMAGEM),
}).single('imagem');

/** Upload de documento único (campo "documento") — max 10MB */
export const uploadDocumento = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: criarFiltroMimeType(TIPOS_DOCUMENTO),
}).single('documento');

/** Upload de vídeo único (campo "video") — max 100MB */
export const uploadVideo = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: criarFiltroMimeType(TIPOS_VIDEO),
}).single('video');

/** Upload genérico (qualquer tipo suportado) — max 100MB */
export const uploadArquivo = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: criarFiltroMimeType(TODOS_TIPOS),
}).single('arquivo');
