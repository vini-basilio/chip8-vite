export const INSTRUCTIONS_SET: instruction[] = [
    // Operacoes basicas. Com ela ja podemos rodar um debug da tela
    {
        id: "JUMP",
        mask: 0xF000,
        pattern: 0x1000,
        arguments: [
            { mask: 0x0FFF, shift: 0 },
        ],
    },
    {
        id: "SET_REG",
        mask: 0xF000,
        pattern: 0x6000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00FF, shift: 0 },
        ],
    },
    {
        id: "ADD_VALUE",
        mask: 0xF000,
        pattern: 0x7000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00FF, shift: 0 },
        ],
    },
    {
        id: "CLEAR_SCREEN",
        mask: 0xFFFF,
        pattern: 0x00E0,
        arguments: [],
    },

    {
        id: "DRAW",
        mask: 0xF000,
        pattern: 0xD000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
            { mask: 0x000F, shift: 0 },
        ],
    },
    {
        id: "SUB_CALL",
        mask: 0xF000,
        pattern: 0x2000,
        arguments: [
            { mask: 0x0FFF, shift: 0 },
        ],
    },
    {
        id: "SUB_RET",
        mask: 0xFFFF,
        pattern: 0x00EE,
        arguments: [],
    },
    // IF statements
    {
        id: "IF_VX_EQUALS_LIT",
        mask: 0xF000,
        pattern: 0x3000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00FF, shift: 0 },
        ],
    },
    {
        id: "IF_VX_NOT_EQUALS_LIT",
        mask: 0xF000,
        pattern: 0x4000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00FF, shift: 0 },
        ],
    },
    {
        id: "IF_VX_EQUALS_VY",
        mask: 0xF00F,
        pattern: 0x5000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "IF_VX_NOT_EQUALS_VY",
        mask: 0xF00F,
        pattern: 0x9000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "SET_VX_TO_VY",
        mask: 0xF00F,
        pattern: 0x8000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "BINARY_OR",
        mask: 0xF00F,
        pattern: 0x8001,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "BINARY_AND",
        mask: 0xF00F,
        pattern: 0x8002,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "BINARY_XOR",
        mask: 0xF00F,
        pattern: 0x8003,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "ADD_FLAG",
        mask: 0xF00F,
        pattern: 0x8004,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "SUB_VY_FROM_VX",
        mask: 0xF00F,
        pattern: 0x8005,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "SUB_VX_FROM_VY",
        mask: 0xF00F,
        pattern: 0x8007,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "SHIFT_RIGHT",
        mask: 0xF00F,
        pattern: 0x8006,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "SHIFT_LEFT",
        mask: 0xF00F,
        pattern: 0x800E,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00F0, shift: 4 },
        ],
    },
    {
        id: "SET_INDEX",
        mask: 0xF000,
        pattern: 0xA000,
        arguments: [
            { mask: 0x0FFF, shift: 0 },
        ],
    },
    {
        id: "JUMP_OFFSET",
        mask: 0xF000,
        pattern: 0xB000,
        arguments: [
            { mask: 0x0FFF, shift: 0 },
        ],
    },
    {
        id: "RANDOM",
        mask: 0xF000,
        pattern: 0xC000,
        arguments: [
            { mask: 0x0F00, shift: 8 },
            { mask: 0x00FF, shift: 0 },
        ],
    },
    {
        id: "JUMP_KEY_PRESS",
        mask: 0xF0FF,
        pattern: 0xE09E,
        arguments: [
            { mask: 0x0F00, shift: 8 },
        ],
    },
    {
        id: "JUMP_KEY_NOT_PRESS",
        mask: 0xF0FF,
        pattern: 0xE0A1,
        arguments: [
            { mask: 0x0F00, shift: 8 },
        ],
    },
    {
        id: "ADD_TO_INDEX",
        mask: 0xF0FF,
        pattern: 0xF01E,
        arguments: [
            { mask: 0x0F00, shift: 8 },
        ],
    },
    {
        id: "LOAD_FROM_MEMO",
        mask: 0xF0FF,
        pattern: 0xF065,
        arguments: [
            { mask: 0x0F00, shift: 8 },
        ],
    },
    {
        id: "STORE_MEMO",
        mask: 0xF0FF,
        pattern: 0xF055,
        arguments: [
            { mask: 0x0F00, shift: 8 },
        ],
    },
    {
        id: "BINARY_CODED",
        mask: 0xF0FF,
        pattern: 0xF033,
        arguments: [
            { mask: 0x0F00, shift: 8 },
        ],
    },
    {
        id: "GET_KEY",
        mask: 0xF0FF,
        pattern: 0xF00A,
        arguments: [
            { mask: 0x0F00, shift: 8 },
        ],
    }
]

export type instruction ={
    id: string
    mask: number
    pattern: number
    arguments: argument[]
}

type argument =  { mask: number, shift: number }