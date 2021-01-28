const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split('\n');
const path1 = dataSplit[0].split(',');
const path2 = dataSplit[1].split(',');


const DIRECTIONS = {
    'U': [0, 1],
    'R': [1, 0],
    'D': [0, -1],
    'L': [-1, 0],
};

const START = [0, 0];

class WireLine{
    constructor(startPoint, endPoint, direction) {
        this.direction = direction;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    isHorizontal(){
        return this.direction === 'R' || this.direction === 'L';
    }

    contains(x, y){
        if (this.startPoint[0] === x && this.endPoint[0] === x){
            return (Math.min(this.startPoint[1], this.endPoint[1]) <= y && y <= Math.max(this.startPoint[1], this.endPoint[1]))
        } else if(this.startPoint[1] === y && this.endPoint[1] === y){
            return (Math.min(this.startPoint[0], this.endPoint[0]) <= x && x <= Math.max(this.startPoint[0], this.endPoint[0]))
        } else{
            return false
        }

    }

    static intersection(line1, line2){
        if(line1.isHorizontal() && line2.isHorizontal()) {
            return null;
        } else {
            let x = 0;
            let y = 0;
            if(line1.isHorizontal()){
                x = line2.startPoint[0];
                y = line1.startPoint[1];
            } else {
                x = line1.startPoint[0];
                y = line2.startPoint[1];
            }
            if (line1.contains(x,y) && line2.contains(x,y)){
                return [x,y]
            }
        }
        return null;
    }

}

function calculateEndpoint(startPoint, direction, value){
    return [
        startPoint[0] + DIRECTIONS[direction][0] * value,
        startPoint[1] + DIRECTIONS[direction][1] * value,
    ]
}

function pathToLines(path){
    let lines = [];
    let startPoint = START.slice();
    for(let i = 0; i < path.length; i++){
        let pathElem = path[i];
        let direction = pathElem[0];
        let value = parseInt(pathElem.slice(1), 10);
        let endPoint = calculateEndpoint(startPoint, direction, value);
        let wireLine = new WireLine(startPoint, endPoint, direction);
        lines.push(wireLine);
        startPoint = endPoint;
    }
    return lines;
}

function findIntersections(lines1, lines2){
    let intersections = [];
    for(let i = 0; i < lines1.length; i++){
        for(let j = 0; j < lines2.length; j++){
            let intersection = WireLine.intersection(lines1[i], lines2[j]);
            if (intersection !== null){
                if(intersection[0] !== START[0] && intersection[1] !== START[1]) {
                    intersections.push(intersection);
                }
            }
        }
    }
    return intersections;
}

function manhattanDistance(p1, p2){
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

function countSteps(intersectionPoint, lines){
    let steps = 0;
    for (let i = 0; i < lines.length; i++){
        if (lines[i].contains(...intersectionPoint)){
            steps += manhattanDistance(lines[i].startPoint, intersectionPoint);
            return steps;
        } else {
            steps += manhattanDistance(lines[i].startPoint, lines[i].endPoint)
        }
    }
    return null;
}

function z1(path1, path2){
    let lines1 = pathToLines(path1);
    let lines2 = pathToLines(path2);
    let intersections = findIntersections(lines1, lines2);
    let distances = intersections.map(x => manhattanDistance(x, START));
    return Math.min(...distances);
}

function z2(path1, path2){
    let lines1 = pathToLines(path1);
    let lines2 = pathToLines(path2);
    let intersections = findIntersections(lines1, lines2);
    let distances = intersections.map(point => countSteps(point, lines1) + countSteps(point, lines2));
    return Math.min(...distances);
}

console.log(z1(path1, path2));
console.log(z2(path1, path2));