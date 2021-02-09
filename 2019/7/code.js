const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));


class ShipComputer{
    constructor(program){
        this.instructionPointer = 0;
        this.program = program;
        this.inputs = [];
        this.outputs = [];
    }

    addInputs(inputs){
        this.inputs = this.inputs.concat(...inputs);
    }

    readInput(param1){
        let address = this.getValueFrom(param1, 1);
        const prompt = require('prompt-sync')();
        const input = this.inputs.length > 0 ? this.inputs.splice(0, 1)[0] : parseInt(prompt('Input: '), 10);
        this.storeValueAt(address, input);
        this.instructionPointer += 2;
    }

    output(param, mode){
        let val1 = this.getValueFrom(param, mode);
        console.log('Output: ' + val1);
        this.outputs.push(val1);
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

    run(stopAfterOutput=false){
        function fillModes(modes, wantedLength){
            while (modes.length < wantedLength){
                modes.push(0);
            }
            return modes;
        }
        let stop = false;
        let currentOperation = this.getCurrentOperation();
        let opCode = currentOperation % 100;
        while((opCode !== 99) && (stop === false)){
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
                    if(stopAfterOutput){
                        stop=true;
                    }
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

class Amplifier{
    constructor(program, phase){
        this.program = program;
        this.phase = phase;
        this.computer = new ShipComputer(this.program);
        this.computer.addInputs([phase]);
    }

    addInput(input){
        this.computer.addInputs([input])
    }

    getOutput(){
        console.log('Computer inputs ' + this.computer.inputs);
        this.computer.run();
        return this.computer.outputs[this.computer.outputs.length - 1];
    }

    getOutputAndStop(){
        this.computer.run(true);
        return this.computer.outputs[this.computer.outputs.length - 1];
    }
}

function permutationsOf(list){
    if(list.length === 1){
        return [list]
    }
    let results = [];
    for(let i = 0; i < list.length; i++){
        let lcopy = list.slice();
        let elem = lcopy.splice(i,1)[0];
        let sub = permutationsOf(lcopy);
        for(let x of sub){
            let p = x.slice();
            p.unshift(elem);
            results.push(p)
        }
    }
    return results
}

function z1(program){
    let allPerms = permutationsOf([0,1,2,3,4]);
    let maxOutputSignal = 0;
    for(let i = 0; i < allPerms.length; i++){
        let sequence = allPerms[i];
        let signal = 0;
        for(let phase of sequence){
            let amplifier = new Amplifier(program, phase);
            amplifier.addInput(signal);
            signal = amplifier.getOutput();
        }
        if(signal > maxOutputSignal){
            maxOutputSignal = signal;
        }
    }
    return maxOutputSignal;
}

function z2(program){
    let allPerms = permutationsOf([5,6,7,8,9]);
    let maxOutputSignal = 0;
    for(let i = 0; i < allPerms.length; i++){
        let sequence = allPerms[i];
        let amplifiers = sequence.map(phase => new Amplifier(program, phase));
        let signal = 0;
        while (true){
            for(let j = 0; j < amplifiers.length; j++){
                amplifiers[j].addInput(signal);
                signal = amplifiers[j].getOutputAndStop();
            }
            if(amplifiers[amplifiers.length-1].computer.getCurrentOperation() === 99){
                break;
            }
        }
        if(signal > maxOutputSignal){
            maxOutputSignal = signal;
        }
    }
    return maxOutputSignal;
}
console.log(z1(input));
console.log(z2(input));

