const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));


class ShipComputer{
    constructor(program){
        this.instructionPointer = 0;
        this.program = program;
        this.memory = new Map();
        for(let i = 0; i < this.program.length; i++){
            this.memory.set(i, program[i]);
        }
        this.relativeBase = 0;
        this.inputs = [];
        this.outputs = [];
        this.quietMode = false;
    }

    setQuietMode(quiet=true){
        this.quietMode = quiet;
    }


    isFinished(){
        return this.getCurrentOperation() === 99;
    }

    addInputs(inputs){
        this.inputs = this.inputs.concat(...inputs);
    }

    adjustRelativeBase(delta){
        this.relativeBase += delta;
    }

    readInput(param1, mode){
        const prompt = require('prompt-sync')();
        const input = this.inputs.length > 0 ? this.inputs.splice(this.inputs.length-1, 1)[0] : parseInt(prompt('Input: '), 10);
        this.storeValueAt(param1, input, mode);
    }

    output(param, mode){
        let val1 = this.getValueFrom(param, mode);
        this.outputs.push(val1);
        if(this.quietMode === false){
            console.log(`Output ${this.outputs.length - 1}: ` + val1);
        }


    }

    getFromMemory(address){
        return this.memory.has(address) ? this.memory.get(address) : 0;
    }

    storeValueAt(instructionPointer, value, mode=0){
        if(mode === 0){
            this.memory.set(this.memory.get(instructionPointer), value);
        } else if(mode === 1){
            this.memory.set(instructionPointer, value);
        } else if(mode === 2){
            this.memory.set(this.memory.get(instructionPointer) + this.relativeBase, value);
        }
    }

    getValueFrom(instructionPointer, parameterMode=0){
        if (parameterMode === 0){
            return this.getFromMemory(this.getFromMemory(instructionPointer));
        } else if (parameterMode === 1){
            return this.getFromMemory(instructionPointer);
        } else if(parameterMode === 2){
            return this.getFromMemory(this.getFromMemory(instructionPointer) + this.relativeBase);
        }
    }

    getCurrentOperation(){
        return this.getValueFrom(this.instructionPointer, 1);
    }

    add(params, modes, resultPointer){
        params = params.map((param, i) => this.getValueFrom(param, modes[i]));
        this.storeValueAt(resultPointer, params[0] + params[1], modes[2]);
    }

    mul(params, modes, resultPointer){
        params = params.map((param, i) => this.getValueFrom(param, modes[i]));
        this.storeValueAt(resultPointer, params[0] * params[1], modes[2]);
    }

    run(stopWhenInputNeeded=false){
        function fillModes(modes, wantedLength){
            while (modes.length < wantedLength){
                modes.push(0);
            }
            return modes;
        }
        let stop = false;
        let currentOperation = this.getCurrentOperation();
        let opCode = currentOperation % 100;
        while((!this.isFinished()) && (stop === false)){
            let modes = currentOperation.toString().slice(0, currentOperation.toString().length - 2).split('');
            modes.reverse();
            modes = modes.map(x => parseInt(x, 10));
            switch(opCode){
                case 1: {
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2];
                    modes = fillModes(modes, params.length);
                    this.add(params, modes, this.instructionPointer + 3);
                    this.instructionPointer += 4;
                    break;
                }
                case 2: {
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2];
                    modes = fillModes(modes, params.length);
                    this.mul(params, modes, this.instructionPointer + 3);
                    this.instructionPointer += 4;
                    break;
                }
                case 3: {
                    if(stopWhenInputNeeded && (this.inputs.length === 0)){
                        stop=true;
                        break;
                    } else{
                        let params = [this.instructionPointer + 1];
                        let mode = fillModes(modes, params.length)[0];
                        this.readInput(this.instructionPointer + 1, mode);
                        this.instructionPointer += 2;
                        break;
                    }

                }
                case 4: {
                    let mode = fillModes(modes, 1)[0];
                    this.output(this.instructionPointer + 1, mode);
                    this.instructionPointer += 2;
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
                    if(this.getValueFrom(params[0], modes[0]) < this.getValueFrom(params[1], modes[1])){
                        this.storeValueAt(params[2], 1, modes[2]);
                    } else {
                        this.storeValueAt(params[2], 0, modes[2]);
                    }
                    this.instructionPointer += 4;
                    break;
                }
                case 8: {
                    // Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
                    let params = [this.instructionPointer + 1, this.instructionPointer + 2, this.instructionPointer + 3];
                    modes = fillModes(modes, params.length);
                    if(this.getValueFrom(params[0], modes[0]) === this.getValueFrom(params[1], modes[1])){
                        this.storeValueAt(params[2], 1, modes[2]);
                    } else {
                        this.storeValueAt(params[2], 0, modes[2]);
                    }
                    this.instructionPointer += 4;
                    break;
                }
                case 9: {
                    let params = [this.instructionPointer + 1];
                    modes = fillModes(modes, params.length);
                    let delta = this.getValueFrom(params[0], modes[0]);
                    this.adjustRelativeBase(delta);
                    this.instructionPointer += 2;
                    break;
                }
                default:
                    console.log('hola hola ' + this.instructionPointer);
                    break;
            }
            currentOperation = this.getCurrentOperation();
            opCode = currentOperation % 100;
        }
    }
}

class Droid{
    constructor(position) {
        this.position = position;
        this.map = new Map();
        this.map.set(position.toString(), '.');
        this.steps = [];
        this.directions = {
            1: [0, -1],
            2: [0, 1],
            3: [-1, 0],
            4: [1, 0]
        };
    }

    reverseDirection(index){
        if(index % 2 === 0){
            return index - 1
        }
        return index + 1
    }

    move(moveIndex, statusCode){
        let newPosition = [this.position[0] + this.directions[moveIndex][0], this.position[1] + this.directions[moveIndex][1]];
        if(statusCode === 0){
            this.map.set(newPosition.toString(), '#');
            return this.position.slice();
        } else if(statusCode === 1) {
            this.map.set(newPosition.toString(), '.');
            this.position = newPosition;
            return this.position.slice();
        } else{
            this.map.set(newPosition.toString(), '2');
            this.position = newPosition;
            return this.position.slice();
        }
    }

    back(){
        let lastStep = this.steps.pop();
        return this.reverseDirection(lastStep);
    }

    display(size) {
        let middle = Math.floor(size / 2);
        let visualMap = new Array(size);
        for(let i = 0; i < size; i++){
            visualMap[i] = new Array(size).fill('?');
        }
        for(let [key, value] of this.map){
            let [x,y] = key.split(',').map(val => parseInt(val, 10));
            visualMap[x+middle][y+middle] = value;
        }
        visualMap[this.position[0] + middle][this.position[1]+middle] = 'X';

        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                process.stdout.write(visualMap[j][i]);
            }
            console.log();
        }
    }

    unvisitedMove(){
        for(let i = 1; i <= 4; i++){
            let direction = this.directions[i];
            let newPosition = [this.position[0] + direction[0], this.position[1] + direction[1]];
            if(!this.map.has(newPosition.toString())){
                return i;
            }
        }
        return null
    }

}

function z1(input){
    const prompt = require('prompt-sync')();
    let shipComputer = new ShipComputer(input);
    let droid = new Droid([0,0]);
    while(true){
        let move = droid.unvisitedMove();
        if(move === null){
            move = droid.back();
            if(droid.position.toString() === [0,0].toString()){
                break;
            }
        }
        shipComputer.addInputs([move]);
        shipComputer.run(true);
        let statusCode = shipComputer.outputs[shipComputer.outputs.length-1];
        droid.move(move, statusCode);
        if(statusCode > 0){
            droid.steps.push(move);
        }
        //droid.display(70);
        console.log(droid.position);
        if(statusCode ===2){
            console.log(droid.steps);
            break;
        }

    }

}

z1(input);

