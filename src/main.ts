import './style.css'

import {EmulatorFactory} from "./Emulator/EmulatorFactory";
import {MemoryMapper} from "./Emulator/MemoryMapper";
import Display from "./Emulator/Display";
import {Ram} from "./Emulator/Ram";
import {AddressIO} from "./Utils/AddressaIO";
import {KeyboardController} from "./Emulator/Keyboard.ts";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement
const romLoader = document.querySelector("#romLoader") as HTMLInputElement


if(canvas != null){
    const MM = new MemoryMapper()
    const display = new Display(canvas)
    const ram = new Ram()
    MM.map(new KeyboardController(), AddressIO.keyboard.start,  AddressIO.keyboard.end)
    MM.map(ram, AddressIO.ram.start,  AddressIO.ram.end)
    MM.map(display, AddressIO.display.start,  AddressIO.display.end)

    new EmulatorFactory(MM)
    let cpu = EmulatorFactory.create()

    romLoader.addEventListener('change', function (e: Event) {
        display.stopDisplay();
        cpu.pause();

        const input = e.target as HTMLInputElement;
        if (!input?.files?.[0]) {
            display.startDisplay();
            cpu.start();
            return;
        }

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const rom = new Uint8Array(event.target!.result as ArrayBuffer);

            cpu = EmulatorFactory.create();
            cpu.loadROM(rom);
            display.startDisplay();
        };

        reader.readAsArrayBuffer(file);
    });

}

