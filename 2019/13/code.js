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

class GameScreen{
    /*
    0-empty
    1-wall
    2-block
    3-paddle
    4-ball
     */

    constructor() {
        this.tiles = new Map();
    }

    applyOutputs(outputs){
        for(let i = 0; i < outputs.length; i+=3){
            let x = outputs[i];
            let y = outputs[i+1];
            let tileId = outputs[i+2];
            this.tiles.set([x,y].toString(), tileId);
        }
    }

    getBallPosition(){
        return [...this.tiles.entries()].find(([key, val]) => val === 4)[0].split(',').map(x => parseInt(x, 10));
    }

    getPaddlePosition(){
        return [...this.tiles.entries()].find(([key, val]) => val === 3)[0].split(',').map(x => parseInt(x, 10));
    }

    getNumberOfBlocksLeft(){
        return Array.from(this.tiles.values()).filter(x => x===2).length
    }

    currentScore(){
        return this.tiles.has([-1,0].toString()) ? this.tiles.get([-1, 0].toString()) : 0
    }

    display(xs,ys){
        for(let i = 0; i <= ys; i++){
            for(let j = 0; j <= xs; j++){
                process.stdout.write(this.tiles.get([j,i].toString()).toString());
            }
            console.log();
        }
    }

}

class BotPlayer{
    constructor(){
        this.paddleHor = 0;
        this.paddleVer = 0;
        this.ballHor = 0;
        this.ballVer = 0;
        this.balldx = 0;
    }

    update(paddleHor, paddleVer, newBallHor, newBallVer){
        this.balldx = newBallHor - this.ballHor;
        this.ballVer = newBallVer;
        this.ballHor = newBallHor;
        this.paddleVer = paddleVer;
        this.paddleHor = paddleHor;
    }

    nextMove(){
        if(this.ballHor === this.paddleHor){
            return 0;
        }
        else if(this.ballHor < this.paddleHor){
            return -1
        }
        else if(this.ballHor > this.paddleHor){
            return 1
        }
    }
}

function z1(input){
    let shipComputer = new ShipComputer(input);
    let gameScreen = new GameScreen();
    shipComputer.run();
    gameScreen.applyOutputs(shipComputer.outputs);
    gameScreen.display(36,25);
    return gameScreen.getNumberOfBlocksLeft()
}

function z2(input){
    let shipComputer = new ShipComputer(input);
    let gameScreen = new GameScreen();
    let botPlayer = new BotPlayer();
    shipComputer.setQuietMode(true);
    shipComputer.memory.set(0, 2);

    while(!shipComputer.isFinished()){
        shipComputer.run(true);
        gameScreen.applyOutputs(shipComputer.outputs);
        shipComputer.outputs = [];
        botPlayer.update(...gameScreen.getPaddlePosition(), ...gameScreen.getBallPosition());
        shipComputer.addInputs([botPlayer.nextMove()]);
    }
    console.log('Score: ' + gameScreen.currentScore() + ' Blocks Left: ' + gameScreen.getNumberOfBlocksLeft());
}
z2(input);