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

    addInputs(newInputs){
        this.inputs = this.inputs.concat(...newInputs);
    }

    adjustRelativeBase(delta){
        this.relativeBase += delta;
    }

    readInput(param1, mode){
        const prompt = require('prompt-sync')();
        const input = this.inputs.length > 0 ? this.inputs.splice(0, 1)[0] : parseInt(prompt('Input: '), 10);
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

class ScaffoldImage{
    constructor(data){
        this.image = this.processData(data);
    }

    processData(data){
        let image = [];
        image.push([]);
        let row = 0;
        for(let cell of data){
            if(cell === 10) {
                image.push([]);
                row +=1;
            } else {
                image[row].push(String.fromCharCode(cell));
            }

        }
        return image;
    }

    cellAt(position){
        if((position[0] < this.image.length) && (position[0] >= 0)){
            if((position[1] < this.image[0].length) && (position[1] >= 0)){
                return this.image[position[0]][position[1]];
            }
        }
        return '.';
    }


    display(){
        for(let i = 0; i < this.image.length; i++){
            console.log(this.image[i].join(''))
        }
    }

    neighbours(position){
        // D U R L
        return [
            this.image[position[0]+1][position[1]],
            this.image[position[0]-1][position[1]],
            this.image[position[0]][position[1]+1],
            this.image[position[0]][position[1]-1],
        ]
    }

    getStartPosition(){
        for(let i = 1; i < this.image.length - 1; i++){
            for(let j = 1; j < this.image[i].length - 1; j++){
                if(this.image[i][j] === '^'){
                    return [i, j];
                }
            }
        }
    }

    getIntersectionsPositions(){
        let intersections = [];
        // assuming that intersection is impossible at edges
        for(let i = 1; i < this.image.length - 1; i++){
            for(let j = 1; j < this.image[i].length - 1; j++){
                if(this.neighbours([i,j]).filter(elem => elem === '#').length === 4){
                    intersections.push([i,j]);
                }
            }
        }
        return intersections;
    }

    getSteps(start){
        function moveForward(oldPosition, direction){
            return [oldPosition[0] + direction[0], oldPosition[1] + direction[1]]
        }

        function getRightDirection(direction){
            return [direction[1], -direction[0]]
        }

        function getLeftDirection(direction){
            return [-direction[1], direction[0]]
        }
        let position = start;
        let steps = [];
        let counter = 0;
        let direction = [-1, 0]; // ^


        while (true){
            // full ahead
            let nextPosition = moveForward(position, direction);
            while(this.cellAt(nextPosition) === '#'){
                position = nextPosition;
                nextPosition = moveForward(position, direction);
                counter ++;
            }
            steps.push(counter);
            counter = 0;

            // check turns
            let leftDirection = getLeftDirection(direction);
            let leftSide = moveForward(position, leftDirection);
            let rightDirection = getRightDirection(direction);
            let rightSide = moveForward(position, rightDirection);
            if(this.cellAt(leftSide) === '#'){
                direction = leftDirection;
                steps.push('L');
            } else if(this.cellAt(rightSide) === '#'){
                direction = rightDirection;
                steps.push('R');
            } else {
                break;
            }
        }
        return steps.filter(elem => elem !== 0);
    }

    divideSteps(steps){
        function search(sublist, list){
            for(let i = 0; i < list.length; i++){
                if(list.slice(i, i + sublist.length).toString() === sublist.toString()){
                    return i;
                }
            }
            return -1;
        }

        function removeOccurrences(sublist, list){
            if(sublist.length === 0){
                return list;
            }
            let listCopy = list.slice();
            let s = search(sublist, listCopy);
            while(s !== -1){
                listCopy.splice(s, sublist.length);
                s = search(sublist, listCopy);
            }
            return listCopy
        }

        let listOfSteps = steps.slice();
        let n = Math.ceil(listOfSteps.length / 2);
        for(let i =0; i < n; i++){
            for(let j = 0; j < (n -i); j++){
                for(let k = 0; k < (n - i - j); k++){
                    listOfSteps = steps.slice();
                    let f1 = listOfSteps.slice(0,i);
                    listOfSteps = removeOccurrences(f1, listOfSteps);
                    let f2 = listOfSteps.slice(0, j);
                    listOfSteps = removeOccurrences(f2, listOfSteps);
                    let f3 = listOfSteps.slice(0, k);
                    listOfSteps = removeOccurrences(f3, listOfSteps);

                    let f1String = f1.join(',');
                    let f2String = f2.join(',');
                    let f3String = f3.join(',');
                    let main = [];
                    if (listOfSteps.length === 0 && f1String.length < 20 && f2String.length < 20 && f3String.length < 20){
                        let index = 0;
                        while(true){
                            if(steps.slice(index, index + f1.length).toString() === f1.toString()){
                                main.push('A');
                                index += f1.length;
                            }
                            else if(steps.slice(index, index + f2.length).toString() === f2.toString()){
                                main.push('B');
                                index += f2.length;
                            }
                            else if(steps.slice(index, index + f3.length).toString() === f3.toString()){
                                main.push('C');
                                index += f2.length;
                            }
                            else{
                                break;
                            }
                        }
                        let mainString = main.join(',');
                        if(mainString.length < 20 && index === steps.length){
                            return [main,f1,f2,f3]
                        }

                    }
                }
            }
        }
        return null
    }
}

function countHashtags(x, y, side){
    let result = 0;
    for(let i = 0; i < side; i ++){
        for(let j = 0; j < side; j ++){
            let sc = new ShipComputer(input);
            sc.setQuietMode(true);
            sc.addInputs([x+i]);
            sc.addInputs([y+j]);
            sc.run();
            result += sc.outputs[sc.outputs.length - 1];
        }
    }
    return result;
}

function countSquareHashtags(x, y, side){
    let side1 = 0;
    let side2 = 0;
    for(let i = 0; i < side; i ++){
        let sc = new ShipComputer(input);
        sc.setQuietMode(true);
        sc.addInputs([x]);
        sc.addInputs([y+i]);
        sc.run();
        let output = sc.outputs[sc.outputs.length - 1];
        side1 += output;
        if(output === 0){
            break;
        }
    }
    for(let i = 0; i < side; i ++){
        let sc = new ShipComputer(input);
        sc.setQuietMode(true);
        sc.addInputs([x+i]);
        sc.addInputs([y]);
        sc.run();
        let output = sc.outputs[sc.outputs.length - 1];
        side2 += output;
        if(output === 0){
            break;
        }
    }
    return side1 * side2;
}

function z1(input){
    return countHashtags(0,0,50);
}

function z2(input){
    let x = 0;
    let y = 0;
    let count = 1;
    while(count !== (100 * 100)){
        let onTheRight = countSquareHashtags(x+1, y, 100);
        let below = countSquareHashtags(x, y+1, 100);
        let diag = countSquareHashtags(x+1, y+1, 100);
        let max = Math.max(onTheRight, below, diag);

        if(max === diag){
            x++;
            y++;
        }
        else if(max === below){
            y++;
        }
        else if(onTheRight === max){
            x++;
        }
        count = max;
    }
    return x * 10000 + y
}

console.log(z1(input));
console.log(z2(input));
