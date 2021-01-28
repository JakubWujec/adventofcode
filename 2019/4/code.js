const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split('-');
const input = dataSplit.map(line => parseInt(line, 10));

function validateLength(password, length){
    return password.toString().length === length;
}

function validateNeverDecrease(password){
    let pString = password.toString();
    let prevDigit = parseInt(pString[0], 10);
    for (let i = 1; i < pString.length; i++){
        let digit = parseInt(pString[i], 10);
        if (digit < prevDigit){
            return false
        }
        prevDigit = digit;
    }
    return true;

}

function validateHasAdjacentDigits(password){
    let pString = password.toString();
    for (let i = 0; i < pString.length - 1; i++){
        if (pString[i] === pString[i+1]){
            return true
        }
    }
    return false;
}

function validateHas2AdjacentDigits(password){
    let pString = password.toString();

    for (let i = 0; i < pString.length - 1; i++){
        if (pString[i] === pString[i+1]){
            // end
            if(i === pString.length - 2){
                if (pString[i-1] !== pString[i]){
                    return true
                }
            } else if (i === 0){ // beginning
                if (pString[2] !== pString[1]){
                    return true
                }
            } else{
                if (pString[i-1] !== pString[i] && pString[i+2] !==pString[i]){
                    return true
                }
            }
        }
    }
    return false;
}

function z1(minRange, maxRange){
    function validatePassword(password){
        return validateHasAdjacentDigits(password) &&
            validateLength(password, 6) &&
            validateNeverDecrease(password)
    }
    let passed = 0;
    for (let password = minRange; password < maxRange + 1; password++){
        if (validatePassword(password)){
            passed += 1;
        }
    }
    return passed;
}


function z2(minRange, maxRange){
    function validatePassword(password){
        return validateHas2AdjacentDigits(password) &&
            validateLength(password, 6) &&
            validateNeverDecrease(password)
    }
    let passed = 0;
    for (let password = minRange; password < maxRange + 1; password++){
        if (validatePassword(password)){
            passed += 1;
        }
    }
    return passed;
}

console.log(z1(input[0], input[1]));
console.log(z2(input[0], input[1]));

