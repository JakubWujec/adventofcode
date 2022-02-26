import readInput from "../readFile";

const parseInput = (fileName: string): number[] => {
  let numbers = readInput(fileName)
    .split(",")
    .map((x) => parseInt(x));

  return numbers;
};

let positions = parseInput("input.txt");

const task1 = (positions: number[]): number => {
  positions.sort((a,b) => a-b);
  let sum = positions.reduce((a, b) => a + b, 0)
  let minimum = positions[0];
  let maximum = positions[positions.length - 1]
  
  let leftSum = positions[0];
  let rightSum = sum - leftSum;
  let leftSize = 1;
  let allSize = positions.length;
  let minFuel = rightSum - leftSum + positions[0] * (2 * leftSize - allSize)

  for(let val = minimum; val <= maximum; val++ ){
    while(val > positions[leftSize] || ((val === positions[leftSize - 1]) && (positions[leftSize-1] === positions[leftSize]))){
      leftSum += positions[leftSize]
      rightSum -= positions[leftSize]
      leftSize++
    }

    let fuel = rightSum - leftSum + val * (2 * leftSize - allSize)
    if(fuel < minFuel){
      minFuel = fuel;
    }
  }
  return minFuel;
}

const task2 = (positions: number[]): number => {
  let calculateStepsCost = (steps: number) => Math.round(steps * (steps + 1) * 0.5) 
  let calculateTotalCost = (positions: number[], target: number) => positions.map(position => Math.abs(position - target)).map(steps => calculateStepsCost(steps)).reduce((a,b) => a + b, 0);
  positions.sort((a,b) => a-b);
  let minimum = positions[0];
  let maximum = positions[positions.length - 1]

  let best = calculateTotalCost(positions, maximum);
  for(let target = minimum; target < maximum; target++){
    let cost = calculateTotalCost(positions, target);
    best = cost < best ? cost : best;
  }
  return best;
}

console.log("T1: ", task1(positions));
console.log("T2: ", task2(positions));