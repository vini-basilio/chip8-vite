export interface IO {
    read(address: number): number;
    write(address: number, value: number): void
}
