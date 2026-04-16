import { Usuario } from "./Usuario.model";
import { RespostaUsuarioDTO } from "./usuario.schemas";

export function gerarRespostaUsuario(usuario: Usuario): RespostaUsuarioDTO {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        permissao: usuario.permissao,
        relacionamentos: {
            nucleosAdministrados: usuario.nucleosAdministrados?.map(n => ({ id: n.id, nome: n.nome })) || [],
            treinos: usuario.treinos?.map(t => ({ id: t.id })) || [],
            nucleoCoordenado: usuario.nucleoCoordenado ? { id: usuario.nucleoCoordenado.id, nome: usuario.nucleoCoordenado.nome } : null,
            nucleoOndeProfessor: usuario.nucleoOndeProfessor ? { id: usuario.nucleoOndeProfessor.id, nome: usuario.nucleoOndeProfessor.nome } : null,
            jogosArbitrados: usuario.jogos?.map(j => ({ id: j.id, nome: j.nome })) || []
        }
    } as RespostaUsuarioDTO;
}


export function gerarRespostaUsuarios(usuarios: Usuario[]): RespostaUsuarioDTO[] {
    return usuarios.map((usuario) => gerarRespostaUsuario(usuario));
}