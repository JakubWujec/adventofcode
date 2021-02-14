const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const input = data.split("\r\n");

const DIRECTIONS = {
    UP: [-1, 0],
    DOWN: [1, 0],
    LEFT: [0, -1],
    RIGHT: [0, 1],
};

class Tunnel{
    constructor(tunnelPlan, keys, doors, entrance){
        this.ENTRANCE='@';
        this.OPEN_PASSAGE = '.';
        this.STONE_WALL = '#';
        this.tunnelPlan = tunnelPlan;

        if ((keys === undefined) || (doors === undefined) || (entrance === undefined)){
            this.keys = new Map();
            this.doors = new Map();
            this.entrance = null;
            this.locate();
        } else {
            this.keys = keys;
            this.doors = doors;
            this.entrance = entrance;
        }


    }

    copy(){
        let copyPlan = this.tunnelPlan.map(x => x.slice());
        let copyKeys = new Map();
        let copyDoors = new Map();
        let copyEntrance = [...this.entrance];
        for (let [key, value] of this.keys){
            copyKeys.set(key, [...value])
        }
        for (let [key, value] of this.doors){
            copyDoors.set(key, [...value])
        }
        return new Tunnel(copyPlan, copyKeys, copyDoors, copyEntrance);
    }

    locate(){
        function isADoors(char){
            return char <= 'Z' && char >= 'A';
        }
        for (let i = 0; i < this.tunnelPlan.length; i++){
            for (let j = 0; j < this.tunnelPlan[i].length; j++){
                let tile = this.tunnelPlan[i][j];
                if (this.isAKey(tile)){
                    this.keys.set(tile, [i, j])
                } else if(isADoors(tile)){
                    this.doors.set(tile, [i, j])
                } else if(tile === this.ENTRANCE){
                    this.entrance = [i,j];
                }
            }
        }
    }

    isAKey(char){
        return char <= 'z' && char >= 'a';
    }

    charAt(x, y){
        return this.tunnelPlan[x][y]
    }

    onKeyCollected(key){
        let keyPosition = this.keys.get(key);
        this.setTunnelTile(...keyPosition, this.OPEN_PASSAGE);
        this.keys.delete(key);
        this.unlockDoors(key);

    }

    unlockDoors(key){
        let doors = key.toUpperCase();
        if(this.doors.has(doors)){
            let doorsPosition = this.doors.get(doors);
            this.setTunnelTile(...doorsPosition, this.OPEN_PASSAGE);
            this.doors.delete(doors);
        }
    }

    setTunnelTile(x, y, value){
        this.tunnelPlan[x] = this.tunnelPlan[x].substr(0, y) + value + this.tunnelPlan[x].substr(y + 1);
    }

    manhattanDistancesFromKeysSum(position){
        let x = Array.from(this.keys.values()).map(pos => Math.abs(pos[0] - position[0]) + Math.abs(pos[1] + position[1]));
        return x.reduce((a, b) => a + b, 0);
    }


    farthestKeyManhattanDistanceValue(position){
        let x = Array.from(this.keys.values()).map(pos => Math.abs(pos[0] - position[0]) + Math.abs(pos[1] + position[1]));
        return x.length === 0 ? 0 : Math.max(...x);
    }

    accessibleNeighbours(x, y){
        let accessibles = [];
        for (let value of Object.values(DIRECTIONS)){
            let newPos = [x + value[0], y + value[1]];
            if(this.isAccessible(...newPos)){
                accessibles.push(newPos);
            }
        }
        return accessibles;
    }

    findAccessibleKeys(x, y){
        function isAlreadyVisited(visited, position){
            return visited.some(x => x[0] === position[0] && x[1] === position[1]);
        }
        let visited = [[x,y]];
        let positions = [[x,y]];
        let distance = 0;
        let accessibleKeys = new Map();
        while (positions.length !== 0){
            let newPositions = [];
            distance++;
            for (let position of positions){
                let neighbours = this.accessibleNeighbours(...position);
                for (let neighbour of neighbours){
                    if (!isAlreadyVisited(visited, neighbour) && (accessibleKeys.size < this.keys.size)){
                        if(this.isAKey(this.charAt(...neighbour))){
                            accessibleKeys.set(this.charAt(...neighbour), distance);
                        } else{
                            newPositions.push(neighbour);
                        }
                        visited.push(neighbour);
                    }
                }
            }
            positions = newPositions;
        }
        return accessibleKeys;
    }

    isAccessible(x, y){
        if(x < 0 || y < 0 || x >= this.tunnelPlan.length || y >= this.tunnelPlan[0].length){
            return false;
        }
        let tile = this.tunnelPlan[x][y];
        return tile === this.OPEN_PASSAGE || this.isAKey(tile) || tile === this.ENTRANCE;
    }


}



function z1(input){
    function backtracking(position, distanceMade, tunnel, solutions){
        if(tunnel.keys.size > 15){
            console.log(tunnel.keys.size);
        }
        if (tunnel.keys.size === 0){
            solutions.push(distanceMade);
            console.log(solutions);
        } else{
            if(distanceMade < Math.min(...solutions)){
                let accessibleKeys = tunnel.findAccessibleKeys(...position);
                for (let [key, distance] of accessibleKeys){
                    let newPosition = tunnel.keys.get(key);
                    let tunnelCopy = tunnel.copy();
                    let newDistance = distanceMade + distance;
                    let minSolution = Math.min(...solutions);
                    if(newDistance < minSolution){
                        tunnelCopy.onKeyCollected(key);
                        if(tunnelCopy.manhattanDistancesFromKeysSum(position) + newDistance < minSolution){
                            backtracking(newPosition, newDistance, tunnelCopy, solutions);
                        }
                    }
                }
            }

        }
    }
    let tunnel = new Tunnel(input);
    let solutions = [6000];
    backtracking(tunnel.entrance, 0, tunnel, solutions);
    console.log(solutions);
}



z1(input);

