import type {IO} from "../Utils/Interfaces.ts";

export class KeyboardController implements IO{
    private keysMap: Map<string, number>
    private readonly keyState: number[]

    constructor( ) {
        this.keyState = new Array(16).fill(0);
        this.keysMap = new Map();

        this.keysMap.set("1", 0x1); // CHIP-8 1
        this.keysMap.set("2", 0x2); // CHIP-8 2
        this.keysMap.set("3", 0x3); // CHIP-8 3
        this.keysMap.set("4", 0xC); // CHIP-8 C (no QWERTY '4')
        this.keysMap.set("q", 0x4); // CHIP-8 4 (no QWERTY 'Q')
        this.keysMap.set("w", 0x5); // CHIP-8 5 (no QWERTY 'W')
        this.keysMap.set("e", 0x6); // CHIP-8 6 (no QWERTY 'E')
        this.keysMap.set("r", 0xD); // CHIP-8 D (no QWERTY 'R')
        this.keysMap.set("a", 0x7); // CHIP-8 7 (no QWERTY 'A')
        this.keysMap.set("s", 0x8); // CHIP-8 8 (no QWERTY 'S')
        this.keysMap.set("d", 0x9); // CHIP-8 9 (no QWERTY 'D')
        this.keysMap.set("f", 0xE); // CHIP-8 E (no QWERTY 'F')
        this.keysMap.set("z", 0xA); // CHIP-8 A (no QWERTY 'Z')
        this.keysMap.set("x", 0x0); // CHIP-8 0 (no QWERTY 'X')
        this.keysMap.set("c", 0xB); // CHIP-8 B (no QWERTY 'C')
        this.keysMap.set("v", 0xF); // CHIP-8 F (no QWERTY 'V')


        window.addEventListener("keydown", ev => {
            ev.preventDefault();
            const keyIndex: undefined | number =  this.keysMap.get(ev.key.toLowerCase())
            if (keyIndex !== undefined) {
                this.keyState[keyIndex] = 1;
            }

        })
        window.addEventListener("keyup", ev => {
            ev.preventDefault();

            const keyIndex: undefined | number =  this.keysMap.get(ev.key.toLowerCase())
            if (keyIndex !== undefined) {
                this.keyState[keyIndex] = 0;
            }
        })
    }

    read(address: number): number {

        return this.keyState[address]
    }

    write(address: number, value: number): void {
        this.keyState[address] = value;
    }
}