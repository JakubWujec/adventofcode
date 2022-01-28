import readInput from "../readFile";

const myInput = readInput('input.txt').split("\n");
let exampleInput = readInput('example.txt').split("\n");

enum Direction {
  Forward = "forward",
  Down = "down",
  Up = "up",
}

class Submarine {
  x = 0
  y = 0

  applyInstructions(instructions: any[]) {
    instructions.forEach(instruction => {
      let [instr, val] = instruction.split(' ');
      if (['forward', 'down', 'up'].includes(instr)) {
        this.move(instr, parseInt(val))
      }
    })
  }

  move(direction: Direction, units: number) {
    if (direction === Direction.Forward) { this.x += units }
    if (direction === Direction.Down) { this.y += units }
    if (direction === Direction.Up) { this.y -= units }
  }

  get position(): [number, number] {
    return [this.x, this.y]
  }

  get positionProduct(): number {
    return this.x * this.y;
  }
}

function example1() {
  let submarine1 = new Submarine();
  submarine1.applyInstructions(exampleInput)
  console.log("Test1 passed: ", submarine1.positionProduct === 150)
  return submarine1.positionProduct === 150
}

function task1() {
  let submarine1 = new Submarine();
  submarine1.applyInstructions(myInput)
  console.log("Task1: ", submarine1.positionProduct)
  return submarine1.positionProduct
}

example1()
task1()


/// PART 2 


class UpdatedSubmarine extends Submarine {
  aim = 0

  move(direction: Direction, units: number) {
    if (direction === Direction.Forward) { 
      this.x += units
      this.y += this.aim * units; 
    }
    if (direction === Direction.Down) { this.aim += units }
    if (direction === Direction.Up) { this.aim -= units }
  }
}

function example2() {
  let submarine = new UpdatedSubmarine();
  submarine.applyInstructions(exampleInput)
  console.log("Test2 passed: ", submarine.positionProduct === 900)
  return submarine.positionProduct === 900
}

function task2() {
  let submarine = new UpdatedSubmarine();
  submarine.applyInstructions(myInput)
  console.log("Task2: ", submarine.positionProduct)
  return submarine.positionProduct
}

example2()
task2()
