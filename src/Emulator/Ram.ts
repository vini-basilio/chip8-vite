import type {IO} from "../Utils/Interfaces";
import {CHIP_8_FONT} from "../ROMs/chip-8-letters.ts";

export class Ram implements IO {
    private memory: Uint8Array;
    constructor() {
        this.memory = new Uint8Array(4096)
        for(let i = 0; i < CHIP_8_FONT.length; i++){
            this.memory[i] = CHIP_8_FONT[i];
        }

        console.log(this.memory)
    }

    read(address: number): number {
        return this.memory[address];
    }

    write(address: number, value: number): void {
        this.memory[address] = value
    }
}
