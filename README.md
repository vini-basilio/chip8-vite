# CHIP-8 Core
A minha primeira versão deste projeto junto com sua história podem ser encontrada aqui: [CHIP-8-TS](https://github.com/vini-basilio/chip-8-TS). Lá também explico os motivos que me levaram a criar este segundo repositório.
O projeto está com uma versão beta em: https://chip8-vite.vercel.app/

## Meu objetivo
Quero criar um core flexível para que outras pessoas possam implementar suas soluções a partir desta. O projeto aplica conceitos que aprendi sobre o como trabalhar com o opcode do CHIP-8 e como criar um roteamento fácil de ser expandido.
- Como a desenvolvedora [Tania](https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/) resolveu o problema do OPCODE
- Como implementar um mapeador de [memória em JavaScript para VMs](https://www.youtube.com/watch?v=hLYGTpvoMgE&list=PLP29wDx6QmW5DdwpdwHCRJsEubS5NrQ9b&index=5)

## Resultado da suíte de testes Corax+
![image](https://github.com/user-attachments/assets/4e626084-82a7-43e0-bc37-2fc96482bbb1)

Todas as instruções foram testadas e aprovadas no teste da Corax+, a ROM esta disponível com outras no Github [Timendus](https://github.com/Timendus/chip8-test-suite/tree/main). Abaixo, usei a ROM Quirks para listar minhas configurações:

![image](https://github.com/user-attachments/assets/6b8d3895-fd87-4086-ab54-5ab9e530230b)


## Problemas conhecidos
- O teclado não apresenta a velocidade desejada.
- O beep ainda não foi implementado.

