const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split("\n");
const input = dataSplit.map(line => parseInt(line, 10));


function countRequiredFuel(mass){
    return Math.max(0, Math.floor(mass / 3) - 2);
}

function countExtraFuel(baseFuelMass){
    let sum = 0;
    let extraFuel = countRequiredFuel(baseFuelMass);
    while (extraFuel !== 0){
        sum += extraFuel;
        extraFuel = countRequiredFuel(extraFuel);
    }
    return sum;
}

function z1(input){
    return input
        .map(mass => countRequiredFuel(mass))
        .reduce((a, b) => a + b, 0)
}

function z2(input){
    return input
        .map((mass) => {
            const baseFuel = countRequiredFuel(mass);
            return baseFuel + countExtraFuel(baseFuel);})
        .reduce((a, b) => a + b, 0)
}

console.log(z1(input));
console.log(z2(input));