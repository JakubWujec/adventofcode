const fs = require("fs");
const comp = require("../computer");
const ShipComputer = comp.getShipComputer();
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));


class PaintingRobot{
    // 0 BLACK, LEFT
    // 1 WHITE, RIGHT
    constructor(){
        this.position = [0,0];
        this.direction = [0, 1];
        this.panels = new Map();
    }

    currentPanelColor(){
        return this.panels.has(this.position.toString()) ? this.panels.get(this.position.toString()) : 0;
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

    display(size){
        let middle = Math.floor(size / 2);
        let array2d = new Array(size);
        for(let i =0; i < size; i++){
            array2d[i] = new Array(size).fill('.');
        }
        for(let [key, value] of this.panels){
            let [x, y] = key.split(',').map(k => parseInt(k, 10));
            console.log(x, y, value);
            array2d[y + middle][x + middle] = value ? '#' : '.';
        }
        for(let arr of array2d.reverse()){
            console.log(arr.join(''));
        }
    }
}

function z1(input) {
    let paintingRobot = new PaintingRobot();
    let ship = new ShipComputer(input);
    ship.setQuietMode(true);
    while(!ship.isFinished()){
        ship.addInputs([paintingRobot.currentPanelColor()]);
        ship.run(true);
        let instructionPair = ship.outputs.slice(ship.outputs.length - 2);
        paintingRobot.launch(instructionPair);

    }
    return paintingRobot.panels.size;
}

function z2(input){
    let paintingRobot = new PaintingRobot();
    let ship = new ShipComputer(input);
    paintingRobot.panels.set([0,0].toString(), 1);
    while(!ship.isFinished()){
        ship.addInputs([paintingRobot.currentPanelColor()]);
        ship.run(true);
        let instructionPair = ship.outputs.slice(ship.outputs.length - 2);
        paintingRobot.launch(instructionPair);
    }
    paintingRobot.display(100);
}

//console.log(z1(input));
z2(input);