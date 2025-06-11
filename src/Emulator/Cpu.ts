import type {IO} from "../Utils/Interfaces";
import {INSTRUCTIONS_SET} from "../Utils/instructions";
import { AddressIO} from "../Utils/AddressaIO";

export class Cpu {
    private readonly registers: Uint8Array

    private regPC: number;
    private regIndex: number;
    private regSP: number;

    private readonly stack: Uint16Array;

    private delayTimer: number;

    private running: boolean;
    private memoryMapper: IO

    private getKey: number | null;
    private readonly CPU_HZ: number;
    private readonly FRAMES_PER_SECOND: number;
    private timerInterval: number | undefined;


    constructor(memoryMapper: IO) {
        this.FRAMES_PER_SECOND = 1000 / 60 // ~=16 mili
        this.timerInterval = undefined;

        this.CPU_HZ = 8;

        this.memoryMapper = memoryMapper;
        this.running = false;

        this.regPC = 0x200;
        this.regIndex = 0;

        this.regSP = 0;
        this.stack = new Uint16Array(16);

        this.registers = new Uint8Array(16)

        this.delayTimer = 0;

        this.getKey = null;
    }
    start(){
        this.running = true;

        this.timerInterval = setInterval(() => {
            if (this.running) {
                this.delay();
                for(let i =0 ; i < this.CPU_HZ; i++)  this.tick();
            }
        }, this.FRAMES_PER_SECOND);

    }
    pause(){
        this.running = false;
        clearInterval(this.timerInterval)
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

                const registerValueX = this.registers[args[0]] % 64;
                const registerValueY = this.registers[args[1]] % 32;

                const rows = args[2]

                this.registers[15] = 0
                for (let row = 0; row < rows; row++) {
                    const spriteByte = this.memoryMapper.read(this.regIndex + row)
                    for (let col = 0; col < 8; col++) {
                        const spritePixel = (spriteByte >> (7 - col)) & 1;

                        // Só processa se o sprite pixel estiver ligado
                        if (spritePixel === 0) continue;

                        const xOffset = (registerValueX + col);
                        const yOffset = (registerValueY + row);

                        if (xOffset >= 64 || yOffset >= 32) continue;

                        const index = yOffset * 64 + xOffset;

                        const currentPixel = this.memoryMapper.read(AddressIO.display.start + index);

                        if(currentPixel === 1){
                            this.registers[15] = 1
                        }
                        const newPixel =   currentPixel ^ 1;
                        this.memoryMapper.write(AddressIO.display.start + index, newPixel)
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
                this.registers[15] = 0;
                break;
            }
            case "BINARY_AND": {
                const x = this.registers[args[0]]
                const y =  this.registers[args[1]];
                this.registers[args[0]] = x & y;
                this.registers[15] = 0;
                break;
            }
            case "BINARY_XOR": {
                const x = this.registers[args[0]]
                const y =  this.registers[args[1]];
                this.registers[args[0]] = x ^ y;
                this.registers[15] = 0;
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
                const value = this.registers[args[1]];
                this.registers[args[0]] = (value << 1) & 0xFF;
                this.registers[15] = (value & 0x80) >> 7;
                break;
            }
            case "SHIFT_RIGHT": {
                const value = this.registers[args[1]];
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
                if(this.getKey == null){
                    const keyPressed = this.findFirstPressedKey(offsetKeyboard)
                    if (keyPressed !== null) {
                        this.getKey = keyPressed
                    }
                    this.regPC -= 2;
                } else {
                    const current = this.memoryMapper.read(offsetKeyboard + this.getKey)
                    if(current == 0){
                        this.registers[args[0]] = this.getKey;
                        this.getKey = null;
                        return;
                    } else {
                        this.regPC -= 2;
                    }
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
            case "SET_DELAY_REG": {
                this.registers[args[0]] = this.delayTimer;
                break;
            }
            case "SET_REG_DELAY": {
                this.delayTimer = this.registers[args[0]];
                break;
            }
            case "FX18": return
            case "STORE_MEMO": {
                for(let i = 0; i <= args[0]; i++){
                     this.memoryMapper.write(this.regIndex++, this.registers[i]);
                }
                break;
            }
            case "LOAD_FROM_MEMO": {
                for(let i = 0; i <= args[0]; i++){
                    this.registers[i] = this.memoryMapper.read(this.regIndex++);
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
    private findFirstPressedKey = (offset: number): number | null => {

        for ( let i = 0; i < 16; i++) {
            const state = this.memoryMapper.read(offset + i)
            if ( state == 1) return i;
        }
        return null;
    }

}
