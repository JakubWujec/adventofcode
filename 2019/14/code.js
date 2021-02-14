const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
let dataSplit = data.split("\r\n");
dataSplit = dataSplit.map(line => line.split(' => '));

function processData(data){
    function processIngredient(ingredientString){
        let ingr = ingredientString.split(' ');
        return [ingr[1], parseInt(ingr[0], 10)]
    }

    // output => [[[inputName1, inputAmount1],[inputName2, inputAmount2],...], [[outputName1, inputAmount1]]]
    let reactions = new Map();
    for(let i = 0; i < data.length; i++){
        let inputs = data[i][0];
        let output = data[i][1];

        output = processIngredient(output);
        inputs = inputs.split(', ');
        inputs = inputs.map(input => processIngredient(input));
        reactions.set(output[0], [inputs, output]);
    }
    return reactions;
}

class SupplyStorage{
    constructor(){
        // chemical => amount
        this.storage = new Map();
    }

    addToStorage(chemical, amount){
        if (this.contains(chemical, 1)){
            this.storage.set(chemical, this.storage.get(chemical) + amount);
        } else {
            this.storage.set(chemical, amount);
        }
    }

    removeFromStorage(chemical, amount){
        let rest = this.storage.get(chemical) - amount;
        if (rest <= 0){
            this.storage.delete(chemical);
        } else {
            this.storage.set(chemical, this.storage.get(chemical) - amount);
        }
    }

    possibleToResolve(reactions, chemical){
        if (this.storage.has(chemical) && reactions.has(chemical)){
            let reactionElements = reactions.get(chemical);
            let reactionResult = reactionElements[1];
            return this.contains(reactionResult[0], reactionResult[1]);
        }
        return false;
    }

    resolve(reactions, toResolve, strict=false){
        let reactionElements = reactions.get(toResolve);
        if (reactionElements){
            let reactionResult = reactionElements[1];
            let reactionIngredients = reactionElements[0];
            if (!strict || this.possibleToResolve(reactions, reactionResult[0])){
                for (let ingredient of reactionIngredients){
                    this.addToStorage(ingredient[0], ingredient[1]);
                }
                this.removeFromStorage(toResolve, reactionResult[1]);
            }
        }
    }

    resolveRecursivelyWhatPossible(reactions){
        while (true){
            let changed = false;
            for (let [chemical, amount] of this.storage) {
                if (this.possibleToResolve(reactions, chemical)) {
                    this.resolve(reactions, chemical, true);
                    changed = true;
                }
            }
            if(!changed){
                break;
            }
        }

    }

    contains(chemical, amount = 1){
        if (this.storage.has(chemical)){
            return this.storage.get(chemical) >= amount;
        }
        return false;
    }

    copy(){
        let newSupplyStorage = new SupplyStorage();
        for(let [key, value] of this.storage){
            newSupplyStorage.storage.set(key, value);
        }
        return newSupplyStorage;
    }

    numberOfOres(){
        if(this.storage.has('ORE')){
            return this.storage.get('ORE');
        }
        return 0;

    }

    equals(supplyStorage){
        if(supplyStorage.storage.size !== this.storage.size){
            return false;
        }
        for(let [key, value] of this.storage){
            if(supplyStorage.storage.has(key)){
                if(supplyStorage.storage.get(key) !== this.storage.get(key)){
                    return false;
                }
            } else{
                return false;
            }
        }
        return true;
    }

    isResolved(){
        return (this.storage.size === 1 && this.storage.has('ORE'));
    }
}

function minOres(supplyStorages){
    let m = supplyStorages[0];
    for (let i = 1; i < supplyStorages.length; i++){
        if (supplyStorages[i].storage.get('ORE') < m.storage.get('ORE')){
            m = supplyStorages[i];
        }
    }
    return m;
}

function greedy(reactions, supplyStorage){
    while(!supplyStorage.isResolved()){
        // first resolve what possible
        supplyStorage.resolveRecursivelyWhatPossible(reactions);
        // if nothing possible in strict try with borrowing
        if(!supplyStorage.isResolved())
        {
            let storages = [];
            for (let [chemical, amount] of supplyStorage.storage) {
                if (chemical !== 'ORE') {
                    let copy = supplyStorage.copy();
                    copy.resolve(reactions, chemical, false);
                    copy.resolveRecursivelyWhatPossible(reactions);
                    storages.push(copy);
                }
            }
            supplyStorage = minOres(storages);
        } else {
            return supplyStorage;
        }

    }
    return supplyStorage
}

function backtracking(reactions, supplyStorages, minSolution){
    while(true){
        let newSupplyStorages = [];
        for (let supplyStorage of supplyStorages){
            if(supplyStorage.numberOfOres() > minSolution.numberOfOres()){
                continue;
            }
            supplyStorage.resolveRecursivelyWhatPossible(reactions);
            if(supplyStorage.isResolved() === true){
                if(supplyStorage.storage.get('ORE') < minSolution.storage.get('ORE')){
                    minSolution = supplyStorage;
                }
            }
            else{
                for (let [chemical, amount] of supplyStorage.storage) {
                    if (chemical !== 'ORE') {
                        let copy = supplyStorage.copy();
                        copy.resolve(reactions, chemical, false);
                        if(!(supplyStorages.some(x => copy.equals(x)))){
                            newSupplyStorages.push(copy);
                        }

                    }
                }
            }
        }
        supplyStorages = newSupplyStorages;

        if(supplyStorages.length === 1 && supplyStorages[0].isResolved()){
            if(supplyStorages[0].storage.get('ORE') < minSolution.storage.get('ORE')){
                minSolution = supplyStorages[0];
            }
            return minSolution;
        } else if(supplyStorages.length === 0){
            return minSolution;
        }
        console.log(supplyStorages.length)
    }
}

function backtracking2(reactions, chemical, supplyStorage, minSolution){
    supplyStorage.resolve(reactions, chemical, false);
    supplyStorage.resolveRecursivelyWhatPossible(reactions);
    if(supplyStorage.isResolved() === true){
        if(supplyStorage.storage.get('ORE') < minSolution.storage.get('ORE')){
            minSolution = supplyStorage;
            console.log(minSolution);
        }
    } else {
        for(let [ch, amount] of supplyStorage.storage) {
            if (ch !== 'ORE') {
                let copy = supplyStorage.copy();
                backtracking2(reactions, ch, copy, minSolution);
            }
        }
    }
    return minSolution
}

function z1(){
    let reactions = processData(dataSplit);
    let greedySolution = new SupplyStorage();
    greedySolution.addToStorage('FUEL', 1);
    //greedySolution = greedy(reactions, greedySolution);
    greedySolution.resolveRecursivelyWhatPossible(reactions);
    console.log(greedySolution);
}
z1();


