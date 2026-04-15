import { Usuario } from "./Usuario.model";
import { RespostaUsuarioDTO } from "./usuario.schemas";

export function gerarRespostaUsuario(usuario: Usuario): RespostaUsuarioDTO {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        permissao: usuario.permissao,
    } as RespostaUsuarioDTO;
}

export function gerarRespostaUsuarios(usuarios: Usuario[]): RespostaUsuarioDTO[] {
    return usuarios.map((usuario) => gerarRespostaUsuario(usuario));
}