import type {IO} from "../Utils/Interfaces";
import {INSTRUCTIONS_SET} from "../Utils/instructions";
import { AddressIO} from "../Utils/AddressaIO";

export class Cpu {
    private registers: Uint8Array

    private regPC: number;
    private regIndex: number;
    private regSP: number;

    private stack: Uint16Array;

    private TIMER_INTERVAL: number;
    private CPU_CYCLES_PER_FRAME: number;
    private lastTimerUpdate: number;

    private delayTimer: number;

    private running: boolean;
    private memoryMapper: IO
    constructor(memoryMapper: IO) {
        this.memoryMapper = memoryMapper;
        this.running = false;

        this.regPC = 0x200;
        this.regIndex = 0;


        this.regSP = 0;
        this.stack = new Uint16Array(16);

        this.registers = new Uint8Array(16)

        this.TIMER_INTERVAL = 1000 / 60
        this.CPU_CYCLES_PER_FRAME = 8
        this.lastTimerUpdate = performance.now()

        this.delayTimer = 0;
    }
    start(){
        this.running = true;
        this.loop();

    }
    pause(){
        this.running = false;
    }
    loadROM(buffer: Uint8Array){
        for (let i = 0; i < buffer.length; i++) {
            this.memoryMapper.write(0x200 + i,
                buffer[i]);
        }
        for(let i = AddressIO.display.start; i <= AddressIO.display.end; i++){
            this.memoryMapper.write(i, 0)
        }
        this.start()
    }
    private execute(opcode: {id: string, args: number[]}){
        const {id, args} = opcode;
        switch (id){
            case "JUMP":{
                this.regPC = args[0];
                break;
            }
            case "SET_INDEX":{
                this.regIndex = args[0];
                break;
            }
            case "SET_REG": {
                this.registers[args[0]] = args[1];
                break;
            }
            case "ADD_VALUE": {

                const current = this.registers[args[0]];
                const sum = current + args[1];
                this.registers[args[0]] = (sum & 0xFF);

                break;
            }
            case "CLEAR_SCREEN": {
                for(let i = AddressIO.display.start; i <= AddressIO.display.end; i++){
                    this.memoryMapper.write(i, 0)
                }
                break;
            }
            case "DRAW": {

                const registerValueX = this.registers[args[0]];
                const registerValueY = this.registers[args[1]];
                const rows = args[2]
                this.registers[this.registers.byteLength - 1] = 0

                for (let row = 0; row < rows; row++) {
                    const spriteByte = this.memoryMapper.read(this.regIndex + row)
                    for (let col = 0; col < 8; col++) {
                        const spritePixel = (spriteByte >> (7 - col)) & 1;

                        const xOffset = (registerValueX + col) % 64;
                        const yOffset = (registerValueY + row) % 32;

                        const index = yOffset * 64 + xOffset;

                        const currentPixel = this.memoryMapper.read(AddressIO.display.start + index);
                        const newPixel = spritePixel ^ currentPixel;

                       this.memoryMapper.write(AddressIO.display.start + index, newPixel)

                        if (currentPixel === 1 && newPixel === 0) {
                            this.registers[this.registers.byteLength - 1] = 1
                        }
                    }
                }
                break;
            }
            case "SUB_CALL":  {
                this.stack[this.regSP] = this.regPC;
                this.regSP++;
                this.regPC = args[0];
                break;
            }
            case "SUB_RET":  {
                this.regSP--;
                this.regPC = this.stack[this.regSP]
                break;
            }
            case "IF_VX_EQUALS_LIT":{
                if(this.registers[args[0]] == args[1]) this.fetch()
                break;
            }
            case "IF_VX_NOT_EQUALS_LIT":{
                if(this.registers[args[0]] !== args[1]) this.fetch()
                break;
            }
            case "IF_VX_EQUALS_VY":{
                if(this.registers[args[0]] == this.registers[args[1]]) this.fetch()
                break;
            }
            case "IF_VX_NOT_EQUALS_VY":{
                if(this.registers[args[0]] !== this.registers[args[1]]) this.fetch()
                break;
            }
            case "SET_VX_TO_VY": {
                this.registers[args[0]] = this.registers[args[1]]
                break;
            }
            case "BINARY_OR": {
                const x = this.registers[args[0]]
                const y =  this.registers[args[1]];
                this.registers[args[0]] = x | y;
                break;
            }
            case "BINARY_AND": {
                const x = this.registers[args[0]]
                const y =  this.registers[args[1]];
                this.registers[args[0]] = x & y;
                break;
            }
            case "BINARY_XOR": {
                const x = this.registers[args[0]]
                const y =  this.registers[args[1]];
                this.registers[args[0]] = x ^ y;
                break;
            }
            case "ADD_FLAG": {
                const x = this.registers[args[0]];
                const y = this.registers[args[1]];
                const value = x + y;
                this.registers[args[0]] = (value & 0xFF);
                this.registers[15] = value >  0xFF ?  1 : 0
                break;
            }
            case "SUB_VY_FROM_VX": {
                const x = this.registers[args[0]];
                const y = this.registers[args[1]];
                const value =  x - y;
                this.registers[args[0]] = (value & 0xFF);
                this.registers[15] = x >= y ? 1 : 0;
                break;
            }
            case "SUB_VX_FROM_VY": {
                const x = this.registers[args[0]];
                const y = this.registers[args[1]];
                const value =   y - x;
                this.registers[args[0]] = (value & 0xFF);
                this.registers[15] = y >= x ? 1 : 0;
                break;
            }
            case "SHIFT_LEFT": {
                const value = this.registers[args[0]];
                this.registers[args[0]] = (value << 1) & 0xFF;
                this.registers[15] = (value & 0x80) >> 7;
                break;
            }
            case "SHIFT_RIGHT": {
                const value = this.registers[args[0]];
                this.registers[args[0]] = value >> 1;
                this.registers[15] = value & 0x01;
                break;
            }
            case "JUMP_OFFSET": {
                this.regPC = args[0] + this.registers[0];
                break;
            }
            case "RANDOM": {
             const random =  Math.floor(Math.random() * 256);
             this.registers[args[0]] = random & args[1];
             break;
            }

            case "ADD_TO_INDEX": {
                this.regIndex += this.registers[args[0]];
                break;
            }
            case "GET_KEY": {
                const offsetKeyboard = AddressIO.keyboard.start;
                const keyPressed = this.findFirstPressedKey(offsetKeyboard)
                if (keyPressed == null) {
                    this.regPC -= 2; // repete a instrução
                } else {
                    this.registers[args[0]] = keyPressed + 1;
                }
                break;
            }
            case "JUMP_KEY_NOT_PRESS": {
                const offsetKeyboard = AddressIO.keyboard.start;
                const key = this.registers[args[0]];
                const result = this.memoryMapper.read(offsetKeyboard + key);
                if(result !== 1){
                    this.fetch()
                }
                break;
            }
            case "JUMP_KEY_PRESS": {
                const offsetKeyboard = AddressIO.keyboard.start;
                const key = this.registers[args[0]];
                const result = this.memoryMapper.read(offsetKeyboard + key);
                if(result == 1){
                    this.fetch()
                }
                break;
            }
            case "FX29": return
            case "FX33": return
            case "FX07": return
            case "FX15": return
            case "STORE_MEMO": {
                for(let i = 0; i <= args[0]; i++){
                     this.memoryMapper.write(this.regIndex + i, this.registers[i]);
                }
                break;
            }
            case "LOAD_FROM_MEMO": {
                for(let i = 0; i <= args[0]; i++){
                    this.registers[i] = this.memoryMapper.read(this.regIndex + i);
                }
                break;
            }
            case "BINARY_CODED": {
                const value = this.registers[args[0]]
                let index = this.regIndex;

                this.memoryMapper.write(index, Math.floor(value / 100))
                this.memoryMapper.write(index + 1, Math.floor((value % 100) / 10))
                this.memoryMapper.write(index + 2, value % 10)
                break;
            }
            default: {}
        }
    }

    private decode(opcode: number) {
        const decoded = INSTRUCTIONS_SET.find(instruction => (opcode & instruction.mask) == instruction.pattern)
        // if(decoded == undefined) throw new Error("OPCODE not founded")
        if(decoded == undefined) return {id: "", args:[]}
        let args = decoded.arguments.map(arg => (arg.mask & opcode) >> arg.shift )
        return {id: decoded.id, args}
    }
    private fetch(): number {
        const highByte = this.memoryMapper.read(this.regPC++);
        const lowByte = this.memoryMapper.read(this.regPC++);
        return (highByte << 8) | lowByte;
    }
    private tick(){
        const instruction = this.fetch();
        const decoded = this.decode(instruction)
        this.execute(decoded)
    }
    private delay() {
        if (this.delayTimer > 0) {
            this.delayTimer--;
        }
    }
    private loop = () => {
        if(!this.running) return;
        for (let i = 0; i < this.CPU_CYCLES_PER_FRAME; i++) {
            this.tick()
        }
        const now = performance.now()
        if (now - this.lastTimerUpdate >= this.TIMER_INTERVAL) {
            this.delay()
            this.lastTimerUpdate = now
        }
        requestAnimationFrame(this.loop);
    }

    private findFirstPressedKey = (offset: number): number | null => {

        for ( let i = 0; i < 16; i++) {
            const state = this.memoryMapper.read(offset + i)
            if ( state == 1) return i + 1;
        }
        return null;
    }

}
