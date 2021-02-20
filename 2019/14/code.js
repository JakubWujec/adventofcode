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
                let times = strict ? Math.floor(this.storage.get(reactionResult[0]) / reactionResult[1]) : 1;
                for (let ingredient of reactionIngredients){
                    this.addToStorage(ingredient[0], times * ingredient[1]);
                }
                this.removeFromStorage(toResolve, times * reactionResult[1]);
            }
        }
    }

    reduceReactions(reactions){
        function copyReaction(reaction){
            let [products, result] = reaction;
            let copyProducts = [];
            let copyResult = [...result];
            for(let product of products){
                copyProducts.push([...product]);
            }
            return [copyProducts, copyResult];
        }

        let newReactions = new Map();
        let reactionsIngredientChemicals = this.allIngredientsNames(reactions);

        for(let [reactionProduct, reaction] of reactions){
            if (this.contains(reactionProduct) || reactionsIngredientChemicals.includes(reactionProduct)){
                newReactions.set(reactionProduct, copyReaction(reaction));
            }
        }
        return newReactions;
    }

    resolveOnlyIfItsOnlyOption(reactions){
        // if its no other way to get chemical,
        // you should resolve it
        let allReactionsIngredients = this.allIngredientsNames(reactions);
        while (true){
            let changed = false;
            for (let [chemical, amount] of this.storage) {
                if (allReactionsIngredients.filter(x => x === chemical).length === 0){
                    this.resolve(reactions, chemical, false);
                    changed = true;
                }
            }
            if(!changed){
                break;
            }
        }
    }

    allIngredientsNames(reactions){
        let list = [];
        for(let [key, value] of reactions){
            for(let ingredientReaction of value[0]){
                list.push(ingredientReaction[0])
            }
        }
        return list;
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

    isResolved(){
        return (this.storage.size === 1 && this.storage.has('ORE'));
    }
}

function z1(){
    function mid(lo, hi){
        return Math.floor((hi - lo)/2) + lo;
    }
    let reactions = processData(dataSplit);
    let supplyStorage1 = new SupplyStorage();
    supplyStorage1.addToStorage('FUEL', 1);

    while(!supplyStorage1.isResolved()){
        supplyStorage1.resolveRecursivelyWhatPossible(reactions);
        reactions = supplyStorage1.reduceReactions(reactions);
        supplyStorage1.resolveOnlyIfItsOnlyOption(reactions);
    }

    let orePerFuel = supplyStorage1.storage.get('ORE');
    let maxFuelProducedLo = Math.floor((1000000000000 / orePerFuel));
    let maxFuelProducedHi = Math.floor((1000000000000 / orePerFuel)) * 2;
    let maxFuelProducedMid = mid(maxFuelProducedLo, maxFuelProducedHi);

    while(maxFuelProducedHi > maxFuelProducedMid && maxFuelProducedLo < maxFuelProducedMid) {
        let supplyStorage2 = new SupplyStorage();
        supplyStorage2.addToStorage('FUEL', maxFuelProducedMid);
        let reactions = processData(dataSplit);
        while (!supplyStorage2.isResolved()) {
            supplyStorage2.resolveRecursivelyWhatPossible(reactions);
            reactions = supplyStorage2.reduceReactions(reactions);
            supplyStorage2.resolveOnlyIfItsOnlyOption(reactions);
        }

        let ores = supplyStorage2.storage.get('ORE');
        if (ores > 1000000000000) {
            maxFuelProducedHi = maxFuelProducedMid;
            maxFuelProducedMid = mid(maxFuelProducedLo, maxFuelProducedHi);
        } else {
            maxFuelProducedLo = maxFuelProducedMid;
            maxFuelProducedMid = mid(maxFuelProducedLo, maxFuelProducedHi);
        }

    }
    console.log('z1:', supplyStorage1);
    console.log('z2:', maxFuelProducedMid);
}

z1();


