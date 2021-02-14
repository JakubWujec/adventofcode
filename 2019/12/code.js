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


function z1(input){
    let moons = input.map(x => new Moon(x));
    let spaceSystem = new SpaceSystem(moons);
    for (let i = 0; i < 1000; i++){
        spaceSystem.timeStep();
    }
    return spaceSystem.totalSystemEnergy()
}



console.log(z1(input));