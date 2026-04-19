import { IUsuarioRepository, IUsuarioService } from "./usuario.interfaces";
import { AppError } from "../../shared/utils/AppError";
import bcrypt from 'bcrypt';
import { RespostaUsuarioDTO, CriarUsuarioDTO, SchemaUsuarioResumido, AtualizarUsuarioDTO } from './usuario.schemas';
import { SchemaRespostaPaginada } from "../../shared/utils/listas.schema";
import { getContext } from "../../shared/utils/authStorage";






export const fazerUsuarioService = (usuarioRepo: IUsuarioRepository): IUsuarioService => {

    return {
        async obterPorId(id: number): Promise<RespostaUsuarioDTO> {
            const usuario = await usuarioRepo.obterPorId(id);
            if (!usuario) {
                throw new AppError(404, 'Usuário não encontrado');
            }

            return SchemaUsuarioResumido.parse(usuario);
        },

        async criar(data: CriarUsuarioDTO): Promise<RespostaUsuarioDTO> {
            console.log('Criando usuário com dados:', data);
            if (data.permissao === 'coordenador' || data.permissao === 'professor' || data.permissao === 'auxiliar') {
                if (!data.nucleoVinculado) {
                    throw new AppError(400, `Usuários com permissão '${data.permissao}' devem estar vinculados a um núcleo`);
                }
            }
            
            const hashSenha = await bcrypt.hash(data.senha, 10);
            const emailExistente = await usuarioRepo.obterPorEmail(data.email);
            console.log(`Verificando email: ${data.email}, encontrado: ${emailExistente ? 'sim' : 'não'}`);
            if (emailExistente) throw new AppError(409, 'Email já cadastrado');
            const usuarioData: CriarUsuarioDTO = {
                nome: data.nome,
                email: data.email,
                senha: hashSenha,
                permissao: data.permissao,
                
            };
            const usuario = await usuarioRepo.criar(usuarioData);
            if (!usuario) throw new AppError(500, 'Erro ao criar usuário');
            return SchemaUsuarioResumido.parse(usuario);
        },
        //apenas admin pode listar todos os usuários, os outros só podem buscar os usuários do seu núcleo vinculado
        async listar(pagina: number, limite: number) {
            const { data, total } = await usuarioRepo.listar(pagina, limite);
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
        async listarPornucleoVinculado(pagina: number, limite: number) {
            const nucleoVinculadoId = getContext()?.nucleoVinculado?.id;
            if (!nucleoVinculadoId) {
                throw new AppError(400, 'Núcleo vinculado não encontrado');
            }
            const { data, total } = await usuarioRepo.listarPornucleoVinculado(pagina, limite, nucleoVinculadoId);
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
            // 1. Verifica se o usuário existe
            const usuarioExistente = await usuarioRepo.obterPorId(id);
            if (!usuarioExistente) {
                throw new AppError(404, 'Usuário não encontrado');
            }

            // 2. Verifica duplicidade de e-mail (se informado)
            if (data.email) {
                const existente = await usuarioRepo.obterPorEmail(data.email);
                if (existente && existente.id !== id) {
                    throw new AppError(409, 'Email já cadastrado por outro usuário');
                }
            }

            // 3. Hash da senha (se informada)
            if (data.senha) {
                data.senha = await bcrypt.hash(data.senha, 10);
            }

            // 4. Validação condicional do vínculo com núcleo
            const permissaoFinal = data.permissao ?? usuarioExistente.permissao;
            const nucleoFinal = 'nucleoVinculado' in data ? data.nucleoVinculado : usuarioExistente.nucleoVinculado;

            const exigeNucleo = ['coordenador', 'professor', 'auxiliar'].includes(permissaoFinal);
            if (exigeNucleo && !nucleoFinal?.id) {
                throw new AppError(400, `Usuários com permissão '${permissaoFinal}' devem estar vinculados a um núcleo`);
            }

            // 5. Prepara os dados para atualização (nenhum mapeamento necessário)
            const updateData: AtualizarUsuarioDTO = { ...data };

            // 6. Persiste a atualização
            const usuarioAtualizado = await usuarioRepo.atualizar(id, updateData);
            if (!usuarioAtualizado) {
                throw new AppError(500, 'Erro ao atualizar usuário');
            }

            // 7. Retorna o usuário atualizado (formato resumido)
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