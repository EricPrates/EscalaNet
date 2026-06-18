import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { AppError } from '../utils/AppError';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type TipoUpload = 'imagem' | 'documento' | 'video';

interface ResultadoUpload {
  url: string;
  publicId: string;
  tipo: TipoUpload;
  formato: string;
  tamanhoBytes: number;
}

/**
 * Faz upload de um arquivo para o Cloudinary.
 * Suporta imagens, documentos (PDF/Word) e vídeos.
 *
 * @param fileBuffer - Buffer do arquivo recebido pelo multer
 * @param mimeType   - MIME type do arquivo (ex: 'image/jpeg', 'video/mp4')
 * @param folder     - Subpasta dentro de escalanet/ (ex: 'postagens', 'materiais')
 */
export const uploadParaCloudinary = async (
  fileBuffer: Buffer,
  mimeType: string,
  folder: string
): Promise<ResultadoUpload> => {
  try {
    const base64 = fileBuffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64}`;

    let uploadOptions: UploadApiOptions = {
      folder: `escalanet/${folder}`,
    };

    let tipo: TipoUpload;

    if (mimeType.startsWith('image/')) {
      tipo = 'imagem';
      uploadOptions = {
        ...uploadOptions,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      };
    } else if (mimeType === 'video/mp4' || mimeType.startsWith('video/')) {
      tipo = 'video';
      uploadOptions = {
        ...uploadOptions,
        resource_type: 'video',
        chunk_size: 6000000, // upload em chunks para arquivos grandes
      };
    } else {
      // PDF, Word, etc.
      tipo = 'documento';
      uploadOptions = {
        ...uploadOptions,
        resource_type: 'raw',
      };
    }

    const resultado: UploadApiResponse = await cloudinary.uploader.upload(dataUri, uploadOptions);

    return {
      url: resultado.secure_url,
      publicId: resultado.public_id,
      tipo,
      formato: resultado.format,
      tamanhoBytes: resultado.bytes,
    };
  } catch (error) {
    console.error('Erro no upload para o Cloudinary:', error);
    throw new AppError(500, 'Falha ao fazer upload do arquivo');
  }
};

/**
 * Remove um arquivo do Cloudinary pelo seu public_id.
 * Útil ao deletar uma postagem ou material.
 */
export const deletarDoCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ success: boolean; message?: string }> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result === 'ok') {
      return { success: true };
    }
    return { success: false, message: `Falha ao deletar: ${result.result}` };
  } catch (error) {
    console.error('Erro ao deletar do Cloudinary:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};
// Mantém compatibilidade com o código antigo
export const uploadImageToCloudinary = async (fileBuffer: Buffer, folder: string): Promise<string> => {
  const resultado = await uploadParaCloudinary(fileBuffer, 'image/jpeg', folder);
  return resultado.url;
};
