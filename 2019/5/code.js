const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));


class ShipComputer{
    constructor(program){
        this.instructionPointer = 0;
        this.program = program;
    }

    readInput(param1){
        let address = this.getValueFrom(param1, 1);
        const prompt = require('prompt-sync')();
        const input = prompt('Input: ');
        this.storeValueAt(address, parseInt(input, 10));
        this.instructionPointer += 2;
    }

    output(param, mode){
        let val1 = this.getValueFrom(param, mode);
        console.log('Output: ' + val1);
        this.instructionPointer += 2;
    }

    storeValueAt(address, value){
        this.program[address] = value;
    }

    getValueFrom(address, parameterMode=0){
        if (parameterMode === 0){
            return this.program[this.program[address]];
        } else if (parameterMode === 1){
            return this.program[address];
        }
    }

    getCurrentOperation(){
        return this.getValueFrom(this.instructionPointer, 1);
    }

    add(params, modes, addressParam){
        params = params.map((param, i) => this.getValueFrom(param, modes[i]));
        let resultAddress = this.getValueFrom(addressParam, 1);
        this.storeValueAt(resultAddress, params[0] + params[1]);
        this.instructionPointer += 4;
    }

    mul(params, modes, addressParam){
        params = params.map((param, i) => this.getValueFrom(param, modes[i]));
        let resultAddress = this.getValueFrom(addressParam, 1);
        this.storeValueAt(resultAddress, params[0] * params[1]);
        this.instructionPointer += 4;
    }

    run(){
        function fillModes(modes, wantedLength){
            while (modes.length < wantedLength){
                modes.push(0);
            }
            return modes;
        }

        let currentOperation = this.getCurrentOperation();
        let opCode = currentOperation % 100;
        while(opCode !== 99){
            let modes = currentOperation.toString().slice(0, currentOperation.toString().length - 2).split('');
            modes.reverse();
            modes = modes.map(x => parseInt(x, 10));
            switch(opCode){
                case 1: {
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2];
                    modes = fillModes(modes, params.length);
                    this.add(params, modes, this.instructionPointer + 3);
                    break;
                }
                case 2: {
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2];
                    modes = fillModes(modes, params.length);
                    this.mul(params, modes, this.instructionPointer + 3);
                    break;
                }
                case 3: {
                    this.readInput(this.instructionPointer + 1);
                    break;
                }
                case 4: {
                    let mode = fillModes(modes, 1)[0];
                    this.output(this.instructionPointer + 1, mode);
                    break;
                }
                case 5: {
                    //Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2];
                    modes = fillModes(modes, params.length);
                    if(this.getValueFrom(params[0], modes[0]) !== 0){
                        this.instructionPointer = this.getValueFrom(params[1], modes[1])
                    } else {
                        this.instructionPointer += 3;
                    }
                    break;
                }
                case 6: {
                    // jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2];
                    modes = fillModes(modes, params.length);
                    if(this.getValueFrom(params[0], modes[0]) === 0){
                        this.instructionPointer = this.getValueFrom(params[1], modes[1])
                    } else {
                        this.instructionPointer += 3;
                    }
                    break;
                }
                case 7: {
                    // Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2, this.instructionPointer + 3];
                    modes = fillModes(modes, params.length);
                    let resultAddress = this.getValueFrom(params[2], 1);
                    if(this.getValueFrom(params[0], modes[0]) < this.getValueFrom(params[1], modes[1])){
                        this.storeValueAt(resultAddress, 1);
                    } else {
                        this.storeValueAt(resultAddress, 0);
                    }
                    this.instructionPointer += 4;
                    break;
                }
                case 8: {
                    // Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2, this.instructionPointer + 3];
                    modes = fillModes(modes, params.length);
                    let resultAddress = this.getValueFrom(params[2], 1);
                    if(this.getValueFrom(params[0], modes[0]) === this.getValueFrom(params[1], modes[1])){
                        this.storeValueAt(resultAddress, 1);
                    } else {
                        this.storeValueAt(resultAddress, 0);
                    }
                    this.instructionPointer += 4;
                    break;
                }
                default:
                    console.log('hola hola');
                    break;
            }
            currentOperation = this.getCurrentOperation();
            opCode = currentOperation % 100;
        }

    }
}


let computer = new ShipComputer(input);
computer.run();
//console.log(computer.program);