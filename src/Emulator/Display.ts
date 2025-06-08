import type {IO} from "../Utils/Interfaces";

export default class Display implements IO {
    private readonly columns: number;
    private readonly rows: number;
    private readonly vram: Uint8Array;
    private readonly ctx: CanvasRenderingContext2D;
    private animationFrameId: null | number;

    constructor(canvas: HTMLCanvasElement) {

        this.columns = 64;
        this.rows = 32;
        this.vram = new Uint8Array((this.columns * this.rows) / 8).fill(0)

        if(canvas.getContext("2d") == null) throw  new Error("Canvas not loading")
        this.ctx = canvas.getContext("2d")!;
        this.animationFrameId = null;
    }

    read(address: number): number {
        const byteIndex = address >> 3
        const bitIndex = address % 8
        return (this.vram[byteIndex] >> (7 - bitIndex)) & 1;
    }
    write(address: number, value: number): void {
        const byteIndex = address >> 3
        const bitIndex = address % 8
        const mask = 1 << (7 - bitIndex)

        if(value){
            this.vram[byteIndex] |= mask;
        } else {
            this.vram[byteIndex] &= ~mask;
        }
    }
    private drawScreen =() => {
        this.ctx.clearRect(0, 0, 640, 320);
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                const index = y * this.columns + x;
                const byteIndex = index >> 3;
                const bitIndex = index % 8;
                const pixel = (this.vram[byteIndex] >> (7 - bitIndex)) & 1;

                if(pixel){
                    this.ctx.fillStyle = "white";
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }
        }
    }

    startDisplay = () => {
        this.drawScreen();
        this.animationFrameId = requestAnimationFrame(this.startDisplay);
    }

    stopDisplay = () => {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}