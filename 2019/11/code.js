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
        console.log(`Output ${this.outputs.length - 1}: ` + val1);

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

class PaintingRobot{
    // 0 BLACK, LEFT
    // 1 WHITE, RIGHT
    constructor(){
        this.position = [0,0];
        this.direction = [0, 1];
        this.panels = new Map();
    }

    currentPanelColor(){
        return this.panels.has(this.direction.toString()) ? this.panels.get(this.direction.toString()) : 0;
    }

    launch(instructionPair){
        let color = instructionPair[0];
        let turnDirection = instructionPair[1];
        this.paint(color);
        this.turn(turnDirection);
        this.moveForward();
    }


    paint(color){
        this.panels.set(this.position.toString(), color)
    }

    turn(turnRight){
        this.direction = turnRight ? [this.direction[1], this.direction[0] * (-1)] : [this.direction[1] * (-1), this.direction[0]]
    }

    moveForward(){
        this.position = [this.position[0] + this.direction[0], this.position[1] + this.direction[1]]
    }
}

function z1(input) {
    let paintingRobot = new PaintingRobot();
    let ship = new ShipComputer(input);
    while(!ship.isFinished()){
        ship.addInputs([paintingRobot.currentPanelColor()]);
        ship.run(true);
        let instructionPair = ship.outputs.slice(ship.outputs.length - 2);
        paintingRobot.launch(instructionPair);
    }
}

z1(input);