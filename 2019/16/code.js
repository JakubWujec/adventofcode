const fs = require("fs");
let data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
data = data.split('').map(x => parseInt(x,10));


function applyPattern(data, pattern){
    let result = [];
    for(let i = 0; i < data.length; i++){
        let x = 0;
        for(let j = 0; j < data.length; j++){
            x += data[j] * getMultiplier(pattern, i, j)
        }
        result.push(Math.abs(x) % 10);
    }
    return result;
}

function getMultiplier(pattern, digitPosition, patternPosition){
    // shift
    //patternPosition = patternPosition + 1;
    // how many times number is repeated in pattern
    //let repeats = digitPosition + 1;
    return pattern[Math.floor((patternPosition + 1) / (digitPosition+1)) % pattern.length]
}


function z1(data, phases){
    let basePattern = [0, 1, 0, -1];
    let newData = data.slice();
    for(let i = 0; i < phases; i++){
        newData = applyPattern(newData, basePattern);
    }
    return newData;
}


function applyPattern2(data, pattern, offset){
    console.log(data, pattern, offset);
    let result = [];
    for(let digitPosition = 0; digitPosition < (data.length * 10000); digitPosition++){
        let x = 0;
        for(let patternPosition = 0; patternPosition < (data.length * 10000); patternPosition++){
            x += data[patternPosition] * getMultiplier(pattern, digitPosition, patternPosition)
        }
        result.push(Math.abs(x) % 10);
    }
    return result;
}

function z2(data){
    let basePattern = [0, 1, 0, -1];
    let offset = parseInt(data.slice(0,7).join(''),10);
    offset = offset % data.length;
    let number = data.slice(offset, offset + 8);
    if(number.length < 8){
        number.concat(number.slice(0, 8 - number.length))
    }
    console.log(number);
    let res = applyPattern2(number, basePattern, offset+1);
    console.log(res);
}
// console.log(z1(data, 100).slice(0, 8));
z2(data);
