import { IUsuarioRepository, IUsuarioService } from "./usuario.interfaces";
import { AppError } from "../../shared/utils/AppError";
import bcrypt from 'bcrypt';
import { RespostaUsuarioDTO, CriarUsuarioDTO, SchemaUsuarioResposta, } from './usuario.schemas';
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";




export const fazerUsuarioService = (usuarioRepo: IUsuarioRepository): IUsuarioService => {

    return {
         async obterPorId(id: number): Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterPorId(id);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            
            return SchemaUsuarioResposta.parse(usuario);
        },

        async criar(data: CriarUsuarioDTO): Promise<RespostaUsuarioDTO> {
            data.senha = await bcrypt.hash(data.senha, 10);
            const verificarEmailNBanco = await usuarioRepo.obterPorEmail(data.email);
            if (verificarEmailNBanco) {
                throw new AppError(409, 'Email já cadastrado');
            }
            const usuario = await usuarioRepo.criar(data);
            if (!usuario) {
                throw new AppError(500, 'Erro ao criar usuário');
            }
            return SchemaUsuarioResposta.parse(usuario);
        },

        async listar(pagina: number, limite: number) {
            const { data, total } = await usuarioRepo.listar(pagina, limite);
            if (data.length === 0) {
                throw new AppError(404, 'Nenhum usuário encontrado');
            }
            
            const dataValidada = SchemaUsuarioResposta.array().parse(data);
            const totalPaginas = Math.ceil(total / limite);

            return SchemaRespostaPaginada(SchemaUsuarioResposta).parse({
                data: dataValidada,
                meta: {
                    pagina: pagina,
                    limite: limite,
                    total: total,
                    totalPaginas: totalPaginas
                }
            });
        },


        async obterPorEmail(email: string): Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterPorEmail(email);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            const respostaDTO: RespostaUsuarioDTO = SchemaUsuarioResposta.parse(usuario);
            return respostaDTO;
        },

        async criarUsuarioSemRetorno(data: CriarUsuarioDTO): Promise<void> {
            const verificarEmailNBanco = await usuarioRepo.obterPorEmail(data.email);
            if (verificarEmailNBanco) {
                throw new AppError(409, 'Email já cadastrado');
            }
            data.senha = await bcrypt.hash(data.senha, 10);
            await usuarioRepo.criarUsuarioSemRetorno(data);
        },

        async atualizar(id: number, data: CriarUsuarioDTO): Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.atualizar(id, data);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            const respostaDTO: RespostaUsuarioDTO = SchemaUsuarioResposta.parse(usuario);
            return respostaDTO;
        },

        async deletar(id: number): Promise<boolean> {
            const deletado = await usuarioRepo.deletar(id);
            if (!deletado) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            return deletado;
        },

        async obterUsuarioParaLogin(email: string, senha: string): Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterPorEmail(email);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                throw new AppError(401, 'Credenciais inválidas');
            }

            const respostaDTO: RespostaUsuarioDTO = SchemaUsuarioResposta.parse(usuario);
            return respostaDTO;
        }
    }
}