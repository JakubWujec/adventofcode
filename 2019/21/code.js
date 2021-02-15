const comp = require('../computer');
const ShipComputer = comp.getShipComputer();
const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));

function z1(input){
    const shipComputer = new ShipComputer(input);
    shipComputer.setQuietMode(true);
    shipComputer.run(true);
    shipComputer.printOutputsFromAscii();
    shipComputer.addInputsAsASCII([
        'NOT T T',
        'AND A T',
        'AND B T',
        'AND C T',
        'NOT T T',
        'OR D J',
        'AND T J',
        'WALK']);
    shipComputer.run();
    console.log(shipComputer.outputs[shipComputer.outputs.length - 1]);
    shipComputer.printOutputsFromAscii();
}

function z2(input){
    const shipComputer = new ShipComputer(input);
    shipComputer.setQuietMode(true);
    shipComputer.run(true);
    shipComputer.printOutputsFromAscii();
    shipComputer.addInputsAsASCII([
        'OR D J',
        'NOT E T',
        'NOT T T',
        'OR H T',
        'AND T J',
        'OR D T',
        'AND C T',
        'AND B T',
        'AND A T',
        'NOT T T',
        'AND T J',
        'RUN']);
    shipComputer.run();
    console.log(shipComputer.outputs[shipComputer.outputs.length - 1]);
    shipComputer.printOutputsFromAscii();
}

//z1(input);
z2(input);
