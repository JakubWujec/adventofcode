const fs = require("fs");
let data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
data = data.split('\r\n');


const ASTEREOID = '#';
const EMPTY = '.';

function locationsFromData(data){
    let locations = [];
    for(let row = 0; row < data.length; row++){
        for(let col = 0; col < data[row].length; col++){
            if (data[row][col] === ASTEREOID){
                locations.push([row, col])
            }
        }
    }
    return locations;
}

function ClassicAxisLocationsFromData(data){
    /*
            ^y
            |
            |      x
            0------>
     */
    let locations = [];
    for(let y = 0; y < data.length; y++){
        for(let x = 0; x < data[y].length; x++){
            if (data[y][x] === ASTEREOID){
                locations.push([x, data.length-1-y])
            }
        }
    }
    return locations;
}



function areOnTheSameRay(p1, p2, p3){
    // p1 is start of the ray (half-line)
    // p1!= p2 p2!=p3 p1!=p3
    // p1------p2-----p3---- or  p1----p3----p2-----

    function isPointBetween(middle, p1, p2){
        // all points must be collinear
        return (Math.abs(p2[1] - middle[1]) + Math.abs(middle[1] - p1[1]) === Math.abs(p2[1] - p1[1])) &&
            (Math.abs(p2[0] - middle[0]) + Math.abs(middle[0] - p1[0]) === Math.abs(p2[0] - p1[0]))
    }

    return ((p2[1]-p1[1]) * (p3[0]-p1[0]) === (p3[1] - p1[1]) * (p2[0]-p1[0])) && !isPointBetween(p1, p2, p3)
}


function sameRayTest(){
    console.log(areOnTheSameRay([1,1], [2,2], [3,3]));
    console.log(areOnTheSameRay([1,3], [2,5], [3,7]));
    console.log(!areOnTheSameRay([1,3], [2,5], [-2, -3]));
    console.log(!areOnTheSameRay([1,2], [2,5], [3,7]) );
}

function countRays(location, allLocations){
    let rays = 0;
    let al = allLocations.slice();
    while(al.length !== 0){
        let second = al[0];
        al = al.filter((guess) => !areOnTheSameRay(location, second, guess));
        rays += 1;
    }
    return rays;
}


function z1(data){
    let locations = locationsFromData(data);
    let maxRays = 0;
    for(let i = 0; i < locations.length; i++){
        let rays = countRays(locations[i], locations.slice(0,i).concat(locations.slice(i+1)));
        if (rays > maxRays){
            maxRays = rays;
        }
    }
    return maxRays;
}

function getAngle(x, y){
    let angle = Math.atan2(x, y);
    if (angle < 0){
        angle += 2 * Math.PI;
    }
    return angle;
}

function compareAngles(position1, position2, centrePoint){
    let fixed1 = [position1[0] - centrePoint[0], position1[1] - centrePoint[1]];
    let fixed2 = [position2[0] - centrePoint[0], position2[1] - centrePoint[1]];
    let angle1 = getAngle(fixed1[0], fixed1[1]);
    let angle2 = getAngle(fixed2[0], fixed2[1]);
    if (angle1 < angle2){
        return -1
    } else if(angle2 < angle1) {
        return 1
    } else {
        return 0;
    }
}

function comparePoints(position1, position2, centrePoint){
    function getDistanceBetween(p1, p2){
        return Math.sqrt(Math.pow((p1[0] - p2[0]),2) + Math.pow((p1[1] - p2[1]),2))
    }

    let distance1 = getDistanceBetween(position1, centrePoint);
    let distance2 = getDistanceBetween(position2, centrePoint);

    let ca = compareAngles(position1, position2, centrePoint);

    if (ca === 0){
        if(distance1 < distance2){
            return -1
        } else if(distance2 < distance1){
            return 1
        } else {
            return 0;
        }
    } else {
        return ca;
    }
}

function z2(data){
    let locations = ClassicAxisLocationsFromData(data);
    let maxRays = 0;
    let bestPosition = locations[0];
    for(let i = 0; i < locations.length; i++){
        let rays = countRays(locations[i], locations.slice(0,i).concat(locations.slice(i+1)));
        if (rays > maxRays){
            maxRays = rays;
            bestPosition = locations[i];
        }
    }

    locations = locations.filter(position => position.toString() !== bestPosition.toString());
    locations.sort(function(p1,p2){
        return comparePoints(p1,p2,bestPosition);
    });

    let removed = [];
    while(locations.length > 0){
        let survivors = [];
        let lastRemoved = null;
        for(let i = 0; i < locations.length; i++){
            if(lastRemoved === null){
                lastRemoved = locations[0];
                removed.push(locations[i]);
            } else{
                if(compareAngles(locations[i], lastRemoved, bestPosition) === 0){
                    survivors.push(locations[i]);
                } else{
                    removed.push(locations[i]);
                    lastRemoved = locations[i];
                }
            }
        }
        locations = survivors.slice();
    }
    // back to axis given in the task
    removed = removed.map(position => [position[0], data.length - 1 - position[1]]);
    return removed[199];
}
console.log('z1:', z1(data));
let res2 = z2(data);
console.log('z2:', res2[0] * 100 + res2[1]);
