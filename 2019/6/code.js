const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split('\r\n');
const inputPairs = dataSplit.map(line => line.split(')'));

function getSpaceObjectsMap(inputPairs){
    let spaceObjects = new Map();
    for (let i = 0; i < inputPairs.length; i++) {
        let pair = inputPairs[i];
        // child --orbits--> parent
        spaceObjects.set(pair[1], pair[0]);
    }
    return spaceObjects
}

function countOrbits(spaceObjectsMap, keyObject){
    let counter = 0;
    let tmp = keyObject;
    while(spaceObjectsMap.has(tmp)){
        counter += 1;
        tmp = spaceObjectsMap.get(tmp);
    }
    return counter;
}

function traceOrbits(spaceObjectsMap, keyObject){
    let visited = [];
    let tmp = keyObject;
    while(spaceObjectsMap.has(tmp)){
        tmp = spaceObjectsMap.get(tmp);
        visited.push(tmp);
    }
    return visited;
}

function z1(inputPairs) {
    let spaceObjects = getSpaceObjectsMap(inputPairs);
    let counter = 0;
    for (let [k, v] of spaceObjects){
        counter += countOrbits(spaceObjects, k);
    }
    return counter;
}

function z2(inputPairs){
    let spaceObjects = getSpaceObjectsMap(inputPairs);
    let yours = traceOrbits(spaceObjects, 'YOU');
    let saints = traceOrbits(spaceObjects, 'SAN');
    let intersect = yours.filter(value => saints.includes(value));
    // You - intersect + saints - intersect
    return yours.length + saints.length - 2 * intersect.length;

}

console.log(z1(inputPairs));
console.log(z2(inputPairs));
