# CHIP-8 Core
A minha primeira versão deste projeto junto com sua história podem ser encontrada aqui: [CHIP-8-TS](https://github.com/vini-basilio/chip-8-TS). Lá também explico os motivos que me levaram a criar este segundo repositório.
O projeto está com uma versão beta em: https://chip8-vite.vercel.app/. Você pode se interessar também na minha CLI de [disassembler](https://github.com/vini-basilio/cli-chip-8-disassembler/)

## Meu objetivo
Quero criar um core flexível para que outras pessoas possam implementar suas soluções a partir desta. O projeto aplica conceitos que aprendi sobre o como trabalhar com o opcode do CHIP-8 e como criar um roteamento fácil de ser expandido.
- Como a desenvolvedora [Tania](https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/) resolveu o problema do OPCODE
- Como implementar um mapeador de [memória em JavaScript para VMs](https://www.youtube.com/watch?v=hLYGTpvoMgE&list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b&index=5)

## Resultado da suíte de testes Corax+
![image](https://github.com/user-attachments/assets/1fc3e3cd-f9ef-4f6a-81e7-df667b6c8595)

Todas as instruções foram testadas e aprovadas no teste da Corax+, a ROM esta disponível com outras no Github [Timendus](https://github.com/Timendus/chip8-test-suite/tree/main). Abaixo, usei a ROM Quirks para listar minhas configurações:

![image](https://github.com/user-attachments/assets/be09a043-2577-474e-be02-3d68cad80858)
![image](https://github.com/user-attachments/assets/b310ec81-4845-4a58-85bc-f501d2d82b23)

## Problemas conhecidos
- O teclado não apresenta a velocidade desejada.
- O beep ainda não foi implementado.

