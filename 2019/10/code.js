const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const stripData = data.split('\r\n');


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

console.log(z1(stripData));