import { CreateUserDTO, UserResponseDTO } from './user.types';
import { CreateTaskDTO, UpdateTaskDTO, TaskResponseDTO } from './task.types';
import { LoginDTO } from './register.types';
import { User } from '../Models/User';
import { Task } from '../Models/Task';

export interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    createUser(data: CreateUserDTO): Promise<User>;
}

export interface ITaskRepository {
    findTasksByUserId(userId: number): Promise<Task[]>;
    createTask(data: CreateTaskDTO & { userId: number }): Promise<Task>;
    updateTask(id: number, userId: number, data: UpdateTaskDTO): Promise<Task | null>;
}


export interface IUserService {
    register(data: CreateUserDTO): Promise<UserResponseDTO>;
    login(data: LoginDTO): Promise<{ token: string; user: UserResponseDTO }>;
}

export interface ITaskService {
    getTasksByUserId(userId: number): Promise<TaskResponseDTO[]>;
    createTask(data: CreateTaskDTO, userId: number): Promise<TaskResponseDTO>;
    updateTask(id: number, userId: number, data: UpdateTaskDTO): Promise<TaskResponseDTO | null>;
}