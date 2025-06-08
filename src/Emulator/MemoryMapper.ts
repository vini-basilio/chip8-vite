import type {IO} from "../Utils/Interfaces";

export class MemoryMapper implements IO{

    private regions: Array<{
        device: IO;
        start: number;
        end: number;
        remap :boolean
    }>

    constructor(){
        this.regions = new Array()
    }

    map(device: IO, start: number, end: number, remap = true){
        const region = {
            device,
            start,
            end,
            remap
        };
        this.regions.unshift(region);

        return () => this.regions.filter(x => x !== region);

    }

    private findRegion(address: number){
        const region = this.regions.find(r => address >= r.start && address <= r.end);
        if(!region){
            throw new Error(`No memory region found for address ${address}`);
        }
        return region;
    }

    read(address: number){
        const region = this.findRegion(address);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.read(finalAddress);
    }
    write(address: number, value: number){
        const region = this.findRegion(address);
        const finalAddress = region.remap ? address - region.start : address;
        return region.device.write(finalAddress, value);
    }
}
