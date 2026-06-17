import { IUsuarioRepository, IUsuarioService } from "./usuario.interfaces";
import { AppError } from "../../shared/utils/AppError";
import bcrypt from 'bcrypt';
import { RespostaUsuarioDTO, CriarUsuarioDTO, AtualizarUsuarioDTO, SchemaUsuarioResumido } from './usuario.schemas';
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { authStorage, getContext } from "../../shared/utils/authStorage";
import { FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { Usuario } from "./Usuario.model";








export const fazerUsuarioService = (usuarioRepo: IUsuarioRepository): IUsuarioService => {

    return {

        async listar(pagina: number, limite: number, where: FindOptionsWhere<Usuario>, relations?: FindOptionsRelations<Usuario>) {
               const usuario = authStorage.getStore();
            let finalWhere = where ? { ...where } : {};
            if (usuario?.permissao === "professor") {
                if (!usuario.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                finalWhere = {
                    ...finalWhere,
                    nucleoVinculado: { id: usuario.nucleoVinculadoId }
                };
            }
            const { data, total } = await usuarioRepo.listar(pagina, limite, finalWhere, relations);
            const totalPaginas = Math.ceil(total / limite);
            return SchemaRespostaPaginada(SchemaUsuarioResumido).parse({
                data: data,
                meta: { pagina, limite, total, totalPaginas },
            });
        },


        async obterPorId(id: number): Promise<RespostaUsuarioDTO> {
            const usuarioCtx = authStorage.getStore();
            const usuario = await usuarioRepo.obterPorId(id);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            if (usuarioCtx?.permissao === "professor") {
                if (!usuarioCtx.nucleoVinculadoId) throw new AppError(403, 'Professor sem núcleo');
                if (usuarioCtx.nucleoVinculadoId !== usuario.nucleoVinculado?.id) {
                    throw new AppError(403, 'Acesso negado a usuário fora do núcleo vinculado');
                }
            }
            return SchemaUsuarioResumido.parse(usuario);
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
            if (data.nucleoVinculado) {
                usuarioData.nucleoVinculado = { id: data.nucleoVinculado.id };
            }
            const usuario = await usuarioRepo.criar(usuarioData);
            if (!usuario) throw new AppError(500, 'Erro ao criar usuário');
            return SchemaUsuarioResumido.parse(usuario);
        },
        async listarPornucleoVinculado(pagina: number, limite: number, relations?: FindOptionsRelations<Usuario>) {
            const nucleoVinculadoId = getContext()?.nucleoVinculadoId;
            if (!nucleoVinculadoId) {
                throw new AppError(400, 'Núcleo vinculado não encontrado');
            }
            const { data, total } = await usuarioRepo.listarPornucleoVinculado(pagina, limite, nucleoVinculadoId, relations);
            const dataValidada = SchemaUsuarioResumido.array().parse(data);
            const totalPaginas = Math.ceil(total / limite);

            return SchemaRespostaPaginada(SchemaUsuarioResumido).parse({
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
            const respostaDTO: RespostaUsuarioDTO = SchemaUsuarioResumido.parse(usuario);
            return respostaDTO;
        },

        async atualizar(id: number, data: AtualizarUsuarioDTO): Promise<RespostaUsuarioDTO> {
            const usuarioExistente = await usuarioRepo.obterPorId(id);
            if (!usuarioExistente) {
                throw new AppError(404, 'Usuário não encontrado');
            }
            if (data.email) {
                const existente = await usuarioRepo.obterPorEmail(data.email);
                if (existente && existente.id !== id) {
                    throw new AppError(409, 'Email já cadastrado por outro usuário');
                }
            }

            if (data.senha) {
                data.senha = await bcrypt.hash(data.senha, 10);
            }


            const permissaoFinal = data.permissao ?? usuarioExistente.permissao;
            const nucleoFinal = 'nucleoVinculado' in data ? data.nucleoVinculado : usuarioExistente.nucleoVinculado;

            const exigeNucleo = ['professor', 'auxiliar'].includes(permissaoFinal);
            if (exigeNucleo && !nucleoFinal?.id) {
                throw new AppError(400, `Usuários com permissão '${permissaoFinal}' devem estar vinculados a um núcleo`);
            }

            const updateData: AtualizarUsuarioDTO = { ...data };

            const usuarioAtualizado = await usuarioRepo.atualizar(id, updateData);
            if (!usuarioAtualizado) {
                throw new AppError(500, 'Erro ao atualizar usuário');
            }


            return SchemaUsuarioResumido.parse(usuarioAtualizado);
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

            const respostaDTO: RespostaUsuarioDTO = SchemaUsuarioResumido.parse(usuario);
            return respostaDTO;
        }
    }
}