import {Cpu} from "./Cpu";
import type {IO} from "../Utils/Interfaces";

export class EmulatorFactory {
    private static MM: IO;
    constructor(MM: IO) {
        EmulatorFactory.MM = MM;
    }
    static create() {
        return new Cpu(this.MM);
    }
}