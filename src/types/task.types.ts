export type CreateTaskDTO = {
    title: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
}

export type UpdateTaskDTO = {
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
}

export type TaskResponseDTO = {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
}