
export function verificarComArrayVinculado<T extends { id: number }>(array: T[], id: number): boolean {
    return array.every(item => item.id === id);
}