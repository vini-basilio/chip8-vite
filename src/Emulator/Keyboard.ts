import type {IO} from "../Utils/Interfaces.ts";

export class KeyboardController implements IO{
    private keysMap: Map<string, number>
    private buffer: number[]

    constructor( ) {
        this.buffer = new Array(16).fill(0);

        this.keysMap = new Map();
        this.keysMap.set("1", 0)
        this.keysMap.set("2", 1)
        this.keysMap.set("3", 2)
        this.keysMap.set("4", 3)
        this.keysMap.set("q", 4)
        this.keysMap.set("w", 5)
        this.keysMap.set("e", 6)
        this.keysMap.set("r", 7)
        this.keysMap.set("a", 8)
        this.keysMap.set("s", 9)
        this.keysMap.set("d", 10)
        this.keysMap.set("f", 11)
        this.keysMap.set("z", 12)
        this.keysMap.set("x", 13)
        this.keysMap.set("c", 14)
        this.keysMap.set("v", 15)


        window.addEventListener("keydown", ev => {
            console.log("Rodei")
            ev.preventDefault();
            const keyIndex: undefined | number =  this.keysMap.get(ev.key)
            if (keyIndex !== undefined) {
                this.buffer[keyIndex] = 1;
            }

        })
        window.addEventListener("keyup", ev => {
            ev.preventDefault();
            const keyIndex: undefined | number =  this.keysMap.get(ev.key)
            if (keyIndex !== undefined) {
                this.buffer[keyIndex] = 0;
            }
        })
    }

    read(address: number): number {
        console.log("Rodei")
        return this.buffer[address];
    }

    write(address: number, value: number): void {
        this.buffer[address] = value;
    }
}