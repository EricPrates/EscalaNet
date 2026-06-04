export const TipoEvento = [
    'gol',
    'falta',
    'cartao_amarelo',
    'cartao_vermelho',
    'escanteio',
    'substituicao',
] as const;

export type TipoEventoType = typeof TipoEvento[number];
