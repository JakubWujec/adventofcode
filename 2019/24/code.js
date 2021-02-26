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

class Grid2{
    constructor(dataGrid, gridMap){
        this.gridMap = null;
        if(gridMap === null) {
            this.gridMap = this.initGridMap(dataGrid);
        } else {
            this.gridMap = gridMap;
        }
    }

    initGridMap(dataGrid){
        let gridMap = new Map();
        let level = 0;
        gridMap.set(level, new Map());
        for(let x = 0; x < dataGrid.length; x++){
            for(let y = 0; y < dataGrid[0].length; y++){
                if(dataGrid[x][y] === BUG){
                    if(!gridMap.get(level).has(x)){
                        gridMap.get(level).set(x, new Map());
                    }
                    gridMap.get(level).get(x).set(y, 1);
                }
            }
        }
        return gridMap;
    }

    bugsAt(map, level, x , y){
        if(!map.has(level)){
            return 0;
        }
        if(!map.get(level).has(x)){
            return 0;
        }
        return map.get(level).get(x).has(y) ? 1 : 0;
    }

    numberOfBugsInNeighbourhood(level, x, y){
        if(x === 2 && y === 2){
            return 0;
        }
        let bugs = 0;
        let neighbours = [
            [x-1,y],
            [x+1,y],
            [x,y-1],
            [x,y+1],
        ];
        for(let neighbour of neighbours){
            if(neighbour[0] === -1){
                bugs += this.bugsAt(this.gridMap, level + 1, 1 , 2)
            } else if(neighbour[0] === 5){
                bugs += this.bugsAt(this.gridMap,level + 1, 3, 2)
            } else if(neighbour[1] === -1){
                bugs += this.bugsAt(this.gridMap,level + 1, 2, 1);
            } else if(neighbour[1] === 5){
                bugs += this.bugsAt(this.gridMap,level + 1, 2 , 3);
            } else if((neighbour[0] === 2) && (neighbour[1] === 2)){
                if(x === 2 && y ===3){
                    bugs += [0,1,2,3,4].map(k => this.bugsAt(this.gridMap,level-1, k, 4)).reduce((a,b) => a+b,0);
                } else if(x === 3 && y === 2){
                    bugs += [0,1,2,3,4].map(k => this.bugsAt(this.gridMap,level-1, 4, k)).reduce((a,b) => a+b,0);
                } else if(x === 2 && y === 1){
                    bugs += [0,1,2,3,4].map(k => this.bugsAt(this.gridMap,level-1, k, 0)).reduce((a,b) => a+b,0);
                } else if(x === 1 && y === 2){
                    bugs += [0,1,2,3,4].map(k => this.bugsAt(this.gridMap,level-1, 0, k)).reduce((a,b) => a+b,0);
                } else {
                    throw 'error' + x + ',' + y;
                }
            } else {
                bugs += this.bugsAt(this.gridMap,level, ...neighbour);
            }
        }
        return bugs;
    }

    numberOfBugsFromLevel(level) {
        if(this.gridMap.has(level)){
            let bugs = 0;
            for(let key of this.gridMap.get(level).keys()){
                bugs += this.gridMap.get(level).get(key).size;
            }
            return bugs + this.numberOfBugsFromLevel(level-1);
        } else {
            return 0;
        }
    }

    countAllBugs(){
        let maxLevel = Math.max(...this.gridMap.keys());
        return this.numberOfBugsFromLevel(maxLevel);
    }

    lifecycle(){
        let maxLevel = Math.max(...this.gridMap.keys())+1;
        let minLevel = Math.min(...this.gridMap.keys())-1;
        let newGridMap = new Map();
        for(let level = minLevel; level <= maxLevel; level++){
            for(let x = 0; x < 5; x++){
                if(!newGridMap.has(level)){
                    newGridMap.set(level, new Map());
                }
                if(!newGridMap.get(level).has(x)){
                    newGridMap.get(level).set(x, new Map());
                }
                for(let y = 0; y < 5; y++){
                    let adjacentBugs = this.numberOfBugsInNeighbourhood(level, x ,y);
                    if (this.bugsAt(this.gridMap,level, x, y) === 1){
                        if(adjacentBugs === 1){
                            newGridMap.get(level).get(x).set(y, 1);
                        }
                    } else {
                        if((adjacentBugs === 1) || (adjacentBugs === 2)){
                            newGridMap.get(level).get(x).set(y, 1);
                        }
                    }
                }
            }
        }
        this.gridMap = newGridMap;
    }

    printGridMap(){
        for(let level of this.gridMap.keys()){
            console.log('level: ', level);
            for(let i = 0; i < 5; i++){
                let line = '';
                for(let j = 0; j < 5; j ++){
                    if(this.gridMap.get(level).get(i).has(j)){
                        line += '#'
                    } else {
                        line += '.';
                    }
                }
                console.log(line);
            }
        }
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

function z2(input){
    let g = new Grid2(input, null);
    for(let i = 0; i < 200; i++){
        g.lifecycle();
    }
    console.log(g.countAllBugs());
}
console.log(z1(input));
console.log(z2(input));