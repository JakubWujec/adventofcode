const fs = require("fs");
const data = fs.readFileSync("./input.txt", {encoding:'utf-8', flag:'r'});
const dataSplit = data.split("\r\n");

let input = dataSplit.map(x => x.slice(1, x.length - 1)).map(x => x.split(', ')).map(x => x.map(y => parseInt(y.slice(2), 10)));

class SpaceSystem{
    constructor(moons){
        this.moons = moons;
    }

    timeStep(){
        this.applyGravity(this.moons);
        for (let moon of this.moons){
            moon.updatePosition();
        }
    }

    applyGravity(moons){
        for (let i = 0; i < this.moons.length - 1; i++){
            for (let j = i + 1; j < this.moons.length; j++){
                for(let axis = 0; axis < 3; axis++){
                    if(this.moons[i].position[axis] < this.moons[j].position[axis]){
                        this.moons[i].updateVelocityAxis(axis, 1);
                        this.moons[j].updateVelocityAxis(axis, -1);
                    } else if (moons[i].position[axis] > moons[j].position[axis]){
                        this.moons[i].updateVelocityAxis(axis, -1);
                        this.moons[j].updateVelocityAxis(axis, 1);
                    }
                }
            }
        }
    }

    totalSystemEnergy(){
        return this.moons.map(moon => moon.totalEnergy()).reduce((a, b) => a + b, 0);
    }

    logMoons(){
        for (let moon of this.moons){
            console.log(moon);
        }
    }

    velocityVector(axis){
        return this.moons.map(moon => moon.velocity[axis]);
    }

    positionVector(axis){
        return this.moons.map(moon => moon.position[axis]);
    }

}

class Moon{
    constructor(position){
        this.position = position;
        this.velocity = [0, 0, 0];
    }

    updatePosition(){
        this.position = this.position.map((elem, index) => elem + this.velocity[index]);
    }

    updateVelocityAxis(axis, change){
        this.velocity[axis] += change;
    }

    kineticEnergy(){
        return this.velocity.map(x => Math.abs(x)).reduce((a, b) => a+b, 0);
    }

    potentialEnergy(){
        return this.position.map(x => Math.abs(x)).reduce((a, b) => a+b, 0);
    }

    totalEnergy(){
        return this.kineticEnergy() * this.potentialEnergy();
    }
}

function gcd(a, b){
    while(b){
        [a, b] = [b, a % b];
    }
    return a
}

function lcm(values){
    function lcmPair(a, b){
        let gcdResult = gcd(a, b);
        return (Math.min(a,b) / gcdResult) * Math.max(a, b);
    }
    return values.reduce((a,b) => lcmPair(a,b));

}

function z1(input){
    let moons = input.map(x => new Moon(x));
    let spaceSystem = new SpaceSystem(moons);
    for (let i = 0; i < 1000; i++){
        spaceSystem.timeStep();
    }
    return spaceSystem.totalSystemEnergy()
}

function z2(input){
    let moons = input.map(x => new Moon(x));
    let spaceSystem = new SpaceSystem(moons);
    let initialPositions = spaceSystem.moons.map(moon => moon.position).map(x => x.slice());
    let initialVelocities = spaceSystem.moons.map(moon => moon.velocity).map(x => x.slice());
    let counter = 0;
    let velocityPeriods = [0,0,0];
    let positionPeriods = [0,0,0];
    while(velocityPeriods.includes(0) || positionPeriods.includes(0)){
        spaceSystem.timeStep();
        counter++;
        for(let axis of [0,1,2]) {
            if ((spaceSystem.velocityVector(axis).toString() === initialVelocities.map(p => p[axis]).toString())
                && (spaceSystem.positionVector(axis).toString() === initialPositions.map(p => p[axis]).toString())) {
                if (velocityPeriods[axis] === 0 || positionPeriods[axis] === 0) {
                    velocityPeriods[axis] = counter;
                    positionPeriods[axis] = counter;
                }
            }
        }
    }
    return lcm([...positionPeriods]);

}

console.log(z1(input));
console.log(z2(input));