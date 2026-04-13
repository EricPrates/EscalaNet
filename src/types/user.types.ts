export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;  
    role?: 'user' | 'admin';
}


export type UserResponseDTO = {
    id?: number;
    name: string;
    email: string;
    role: 'user' | 'admin';   
}