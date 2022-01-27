import readInput from "../readFile";

const myInput = readInput('input.txt').split("\n").map(line => parseInt(line, 10));
let exampleInput = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

function countIncreases(depths: number[], windowSize = 1): number{
  let inc = 0;
  for(let i = windowSize; i < depths.length; i++){
    if(depths[i] > depths[i - windowSize]){
      inc++;
    }
  }
  return inc
}

console.log('Example 1', countIncreases(exampleInput) === 7 ? 'Passed' : 'Failed');
console.log('Example 2', countIncreases(exampleInput, 3) === 5 ? 'Passed' : 'Failed');

console.log('Task1:', countIncreases(myInput));
console.log('Task2:', countIncreases(myInput, 3));
