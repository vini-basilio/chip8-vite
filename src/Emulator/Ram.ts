import type {IO} from "../Utils/Interfaces";

export class Ram implements IO {
    private memory: Uint8Array;
    constructor() {
        this.memory = new Uint8Array(4096)
    }

    read(address: number): number {
        return this.memory[address];
    }

    write(address: number, value: number): void {
        this.memory[address] = value
    }
}
