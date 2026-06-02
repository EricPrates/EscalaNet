
import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/AppError';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Faz o upload de uma imagem para o Cloudinary.
 * @param fileBuffer - O buffer do arquivo recebido pelo multer.
 * @param folder - A pasta dentro do Cloudinary para organizar (ex: 'usuarios', 'produtos').
 * @returns A URL segura (HTTPS) da imagem enviada.
 */
export const uploadImageToCloudinary = async (fileBuffer: Buffer, folder: string): Promise<string> => {
  try {
    // Converte o buffer para uma string base64, que o Cloudinary aceita diretamente
    const base64String = fileBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64String}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: `escalanet/${folder}`, // Organiza em pastas
      transformation: [
        { width: 500, height: 500, crop: 'limit' }, // Redimensiona se necessário
        { quality: 'auto' }, // Otimiza a qualidade automaticamente
        { fetch_format: 'auto' } // Entrega no formato mais moderno (WebP, AVIF)
      ]
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Erro no upload para o Cloudinary:', error);
    throw new AppError(500, 'Falha ao fazer upload da imagem');
  }
};