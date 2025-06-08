// ROM de teste de teclado para CHIP-8
// Carregue este array na RAM a partir do endereço 0x200

export const keyboardTestRom: number[] = [
    // Limpar tela
    0x00, 0xE0,

    // Definir V0 = 0 (contador de tecla atual)
    0x60, 0x00,

    // LOOP principal - endereço 0x204
    // Aguardar tecla pressionada e armazenar em V0
    0xF0, 0x0A,

    // Definir posição X = 10 (V1)
    0x61, 0x0A,

    // Definir posição Y = 10 (V2)
    0x62, 0x0A,

    // Carregar sprite do dígito (V0 contém o valor da tecla)
    0xF0, 0x29,

    // Desenhar sprite na posição (V1, V2)
    0xD1, 0x25,

    // Aguardar um pouco (loop de delay)
    0x63, 0xFF, // V3 = 255

    // DELAY_LOOP - endereço 0x212
    0x83, 0x35, // V3 = V3 - 1
    0x43, 0x00, // Se V3 != 0
    0x12, 0x12, // Pular para DELAY_LOOP

    // Limpar tela novamente
    0x00, 0xE0,

    // Voltar ao loop principal
    0x12, 0x04
];

// Versão mais avançada que mostra múltiplas teclas
export const advancedKeyboardTestRom: number[] = [
    // Limpar tela
    0x00, 0xE0,

    // Inicializar registradores
    0x60, 0x00, // V0 = posição X inicial
    0x61, 0x00, // V1 = posição Y inicial
    0x62, 0x00, // V2 = tecla atual testada

    // MAIN_LOOP - endereço 0x208
    // Verificar se tecla V2 está pressionada
    0xE2, 0x9E, // Se tecla em V2 está pressionada, pular próxima instrução
    0x12, 0x1A, // Pular para próxima tecla

    // Tecla está pressionada - desenhar sprite
    0xF2, 0x29, // Carregar sprite do dígito V2
    0xD0, 0x15, // Desenhar na posição (V0, V1)

    // Incrementar posição X
    0x70, 0x06,

    // Se X >= 64, resetar X e incrementar Y
    0x40, 0x40, // Se V0 == 64
    0x12, 0x28, // Pular ajuste de linha
    0x12, 0x1A, // Continuar para próxima tecla

    // AJUSTE_LINHA - endereço 0x228
    0x60, 0x00, // V0 = 0 (resetar X)
    0x71, 0x06, // V1 += 6 (próxima linha)

    // PROXIMA_TECLA - endereço 0x21A
    0x72, 0x01, // V2 += 1 (próxima tecla)

    // Se V2 > 15, resetar para 0
    0x42, 0x10, // Se V2 == 16
    0x62, 0x00, // V2 = 0

    // Pequeno delay
    0x63, 0x02, // V3 = 2
    // MINI_DELAY
    0x83, 0x35, // V3--
    0x43, 0x00, // Se V3 != 0
    0x12, 0x32, // Loop delay

    // Voltar ao loop principal
    0x12, 0x08
];

// ROM simples que apenas aguarda qualquer tecla e exibe seu valor
export const simpleKeyTestRom: number[] = [
    0x00, 0xE0, // Limpar tela
    0xF0, 0x0A, // Aguardar tecla em V0
    0x61, 0x20, // V1 = 32 (posição X)
    0x62, 0x10, // V2 = 16 (posição Y)
    0xF0, 0x29, // Carregar sprite do dígito
    0xD1, 0x25, // Desenhar sprite
    0x12, 0x02  // Loop infinito (voltar para aguardar tecla)
];

// Como usar:
// 1. Escolha uma das ROMs acima
// 2. Carregue na RAM do seu emulador a partir do endereço 0x200
// 3. Defina PC = 0x200
// 4. Execute!

// Exemplo de uso no seu emulador:
/*
const memory = new Uint8Array(4096);
const rom = simpleKeyTestRom;

// Carregar ROM na memória
for (let i = 0; i < rom.length; i++) {
    memory[0x200 + i] = rom[i];
}

// Definir PC inicial
let pc = 0x200;
*/