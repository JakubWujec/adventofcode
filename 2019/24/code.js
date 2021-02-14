const fs = require("fs");
let data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
let dataSplit = data.split("\r\n");
let input = dataSplit.map(line => line.split(''));
input = input.map(line => line.map(x => (x === '#') ? 1 : 0));


const BUG = 1;
const EMPTY = 0;


class Grid{
    constructor(dataGrid){
        this.tiles = dataGrid;
    }

    dim(){
        return this.tiles.length;
    }

    lifecycle(before){
        let after = this.copy(before);
        for(let i = 0; i < this.dim(); i++){
            for(let j = 0; j < this.tiles[i].length; j++){
                let neighs = this.neighbours(before, i, j);
                let adjacentBugs = neighs.filter(x => x === BUG).length;
                if (before[i][j] === BUG){
                    after[i][j] = (adjacentBugs === 1) ? BUG : EMPTY;
                } else {
                    after[i][j] = ((adjacentBugs === 1) || (adjacentBugs === 2)) ? BUG : EMPTY;
                }
            }
        }
        return after;
    }

    neighbours(tiles, x, y){
        return [[1,0], [0,1], [-1,0], [0,-1]].map((direction) => {
            let r = tiles[x + direction[0]] || EMPTY;
            if(r === EMPTY){
                return EMPTY;
            } else {
                return r[y + direction[1]] || EMPTY;
            }
        });
    }

    copy(toCopy){
        let copy = [];
        for(let i = 0; i < toCopy.length; i++){
            copy.push(toCopy[i].slice());
        }
        return copy;
    }

    toNumber(tiles){
        let flat = [].concat.apply([], tiles);
        flat.reverse();
        return parseInt(flat.join(''),2);
    }
}



function z1(input){
    let g = new Grid(input);
    let history = [g.toNumber(g.tiles)];
    while (true){
        g.tiles = g.lifecycle(g.tiles);
        let number = g.toNumber(g.tiles);
        if (history.includes(number)){
            return number;
        }
        history.push(number);
    }
}

console.log(z1(input));