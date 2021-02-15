const fs = require("fs");
const comp = require("../computer");
const ShipComputer = comp.getShipComputer();
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));

class Droid{
    constructor(position) {
        this.position = position;
        this.map = new Map();
        this.map.set(position.toString(), '.');
        this.steps = [];
        this.finishPosition = null;
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
        let visualArray = new Array(size);
        for(let i = 0; i < size; i++){
            visualArray[i] = new Array(size).fill('?');
        }
        for(let [key, value] of this.map){
            let [x,y] = key.split(',').map(val => parseInt(val, 10));
            visualArray[x+middle][y+middle] = value;
        }
        visualArray[middle][middle] = 'S';
        visualArray[this.position[0] + middle][this.position[1]+middle] = 'X';

        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                process.stdout.write(visualArray[j][i]);
            }
            console.log();
        }
    }

    unvisitedDirection(){
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

function z1(input) {
    const prompt = require('prompt-sync')();
    let shipComputer = new ShipComputer(input);
    shipComputer.setQuietMode(true);
    let droid = new Droid([0, 0]);
    while (true) {
        let direction = droid.unvisitedDirection();
        while (direction === null) {
            // back
            direction = droid.back();
            shipComputer.addInputs([direction]);
            shipComputer.run(true);
            let statusCode = shipComputer.outputs[shipComputer.outputs.length - 1];
            droid.move(direction, statusCode);
            direction = droid.unvisitedDirection();
        }
        shipComputer.addInputs([direction]);
        shipComputer.run(true);
        let statusCode = shipComputer.outputs[shipComputer.outputs.length - 1];
        droid.move(direction, statusCode);
        if (statusCode > 0) {
            droid.steps.push(direction);
        }
        if (statusCode === 2) {
            droid.finishPosition = droid.position.slice();
            console.log(droid.display(44));
            console.log('z1:', droid.steps.length);
            break;
        }
    }
    return droid
}

function z2(droid){
    let fields = [];
    for (let [key, value] of droid.map) {
        if (value === '.'){
            fields.push(key);
        }
    }
    let queue = [droid.finishPosition];
    let counter = 0;
    while(fields.length > 0){
        counter++;
        let newQueue = [];
        for(let position of queue){
            let [x, y] = position;
            for(let pair of [[x+1,y], [x-1,y], [x,y+1], [x,y-1]]){
                if(fields.includes(pair.toString())){
                    fields.splice(fields.indexOf(pair.toString()), 1);
                    newQueue.push(pair);
                }
            }
        }
        queue = newQueue;
    }
    console.log('z2:', counter);
    return counter;
}

let droid = z1(input);
z2(droid);

