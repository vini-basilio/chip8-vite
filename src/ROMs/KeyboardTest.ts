// ROM simples que desenha o sprite do número 0 em loop
export const spriteTestRom: Uint8Array = new Uint8Array([
    0x00, 0xE0, // 0x200: Limpar tela
    0x61, 0x20, // 0x204: V1 = 32 (posição X)
    0x62, 0x10, // 0x206: V2 = 16 (posição Y)
    0xA0, 0x00, // 0x208: I = endereço do sprite do dígito em V0 (sprite do 0)
    0xD1, 0x25, // 0x20A: Desenhar sprite 5 bytes na posição (V1, V2)
    0x12, 0x0A  // 0x20C: Loop infinito (voltar para 0x20A - só redesenhar)
]);


export const testGetKey: Uint8Array = new Uint8Array([
    0xF0, 0x0A, // 0x204: V1 = 32 (posição X)
    0x00, 0xE0, // 0x200: Limpar tela
    0x61, 0x20, // 0x204: V1 = 32 (posição X)
    0x62, 0x10, // 0x206: V2 = 16 (posição Y)
    0xA0, 0x00, // 0x208: I = endereço do sprite do dígito em V0 (sprite do 0)
    0xD1, 0x25, // 0x20A: Desenhar sprite 5 bytes na posição (V1, V2)
    // 0x12, 0x0A,  // 0x20C: Loop infinito (voltar para 0x20A - só redesenhar)
]);


export const IF_KEY_PRESS: Uint8Array = new Uint8Array([
    0x60, 0x01,       // V0 = 1
    0xE0, 0xA1,       // IF NOT PRESSED V0
    0x12, 0x00,       // JP 0x200
    0xE0, 0x9E,       // IF PRESSED V0
    0x00, 0xE0,       // CLS
    0x61, 0x20,
    0x62, 0x10,
    0xA0, 0x00,
    0xD1, 0x25,
]);
