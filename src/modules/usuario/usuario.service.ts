import { IUsuarioRepository, IUsuarioService } from "./usuario.interfaces";
import { AppError } from "../../shared/utils/AppError";
import bcrypt from 'bcrypt';
import { RespostaUsuarioDTO, CriarUsuarioDTO, SchemaUsuarioResposta, AtualizarUsuarioDTO } from './usuario.schemas';
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { getContext } from "../../shared/utils/authStorage";




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
            const hashSenha = await bcrypt.hash(data.senha, 10);
            const emailExistente = await usuarioRepo.obterPorEmail(data.email);
            if (emailExistente) throw new AppError(409, 'Email já cadastrado');
            const usuarioData: CriarUsuarioDTO = {
                nome: data.nome,
                email: data.email,
                senha: hashSenha,
                permissao: data.permissao,
            };
            data.nucleovinculadoId ? usuarioData.nucleovinculadoId = data.nucleovinculadoId : null;
            const usuario = await usuarioRepo.criar(usuarioData);
            if (!usuario) throw new AppError(500, 'Erro ao criar usuário');
            return SchemaUsuarioResposta.parse(usuario);
        },

        async listar(pagina: number, limite: number ) {
            const permissaoDoUsuarioLogado = getContext()?.permissao;
            let where = {};
            if (permissaoDoUsuarioLogado === 'coordenador' || permissaoDoUsuarioLogado === 'professor' || permissaoDoUsuarioLogado === 'auxiliar') {
                where = { nucleoVinculado: { id: getContext()?.nucleoVinculado  } }; 
            }
            else if (permissaoDoUsuarioLogado === 'admin') {
                where = {};
            }
            
            const { data, total } = await usuarioRepo.listar(pagina, limite, where);
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

        async atualizar(id: number, data: AtualizarUsuarioDTO): Promise<RespostaUsuarioDTO> {
            const usuarioExistente = await usuarioRepo.obterPorId(id);
            if (!usuarioExistente) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            if (data.email) {
                const verificarEmailNBanco = await usuarioRepo.obterPorEmail(data.email);
                if (verificarEmailNBanco) {
                    throw new AppError(409, 'Email já cadastrado');
                }
            }
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