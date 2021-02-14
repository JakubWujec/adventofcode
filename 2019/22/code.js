const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
let commands = data.split("\r\n");

commands = commands.map(
    x => {
        if (x === 'deal into new stack'){
            return (index, numOfCards) => numOfCards - index - 1
        } else if(x.startsWith('cut')){
            let n = parseInt(x.substring(4), 10);
            return (index, numOfCards) => {
                if (n < 0){
                    n += numOfCards;
                }
                if(n > 0){
                    if (n > index){
                        return index + numOfCards - n;
                    } else {
                        return index - n;
                    }
                }
            }
        } else {
            let n = parseInt(x.substring('deal with increment'.length), 10);
            return (index, numOfCards) => (index * n) % numOfCards
        }
    }
);

function z1(commands){
    let numberOfCards = 10007;
    let indexOfCard = 2019;
    for (let command of commands){
        indexOfCard = command(indexOfCard, numberOfCards);
    }
    return indexOfCard
}

function z2(commands){
    let numberOfCards = 119315717514047;
    let indexOfCard = 2020;
    for (let i = 0; i < 10000000; i++) {
        for (let command of commands){
            indexOfCard = command(indexOfCard, numberOfCards);
        }
    }
    return indexOfCard;
}

console.log(z2(commands));

