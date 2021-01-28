const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split(',');
const input = dataSplit.map(line => parseInt(line, 10));


let opCodes = {
    1: (a,b) => a+b,
    2: (a,b) => a*b,
    99: 'HALT',
};


function runProgram(program){
    let currentPosition = 0;
    while (program[currentPosition] !== 99){
        let opCode= program[currentPosition];
        let param1Address = program[currentPosition + 1];
        let param2Address = program[currentPosition + 2];
        let resultAddress = program[currentPosition + 3];
        let val1 = program[param1Address];
        let val2 = program[param2Address];
        program[resultAddress] = opCodes[opCode](val1, val2);

        currentPosition += 4;
    }
    return program[0];
}

function z1(input){
    let inputCopy = input.slice();
    inputCopy[1] = 12;
    inputCopy[2] = 2;
    return runProgram(inputCopy);
}

function z2(input){
    for (let i = 0; i < 100; i++){
        for (let j = 0; j < 100; j++){
            let inputCopy = input.slice();
            inputCopy[1] = i;
            inputCopy[2] = j;
            if (runProgram(inputCopy) === 19690720){
                return 100 * i + j;
            }
        }
    }
    return null;
}

console.log(z1(input));
console.log(z2(input));