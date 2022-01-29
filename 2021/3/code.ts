import readInput from "../readFile";

const myInput = readInput('input.txt').split("\n").map(line => line.split('').map(bit => parseInt(bit)).filter(x => !isNaN(x)));
let exampleInput = readInput('example.txt').split("\n").map(line => line.split('').map(bit => parseInt(bit)).filter(x => !isNaN(x)))

const sum = (v1: number[]): number => {
  return v1.reduce((a, b) => a + b, 0)
}

const filledMatrix = (rows: number, columns: number, fill: number) => {
  let copy = new Array(rows);
  for (let i = 0; i < rows; i++) {
    copy[i] = new Array(columns).fill(fill);
  }
  return copy;
}

export const mostCommonBit = (bits: number[], onEqual = 1): number => {
  let rowSum = sum(bits);
  if (rowSum === (bits.length / 2)) return onEqual
  return (rowSum > (bits.length / 2)) ? 1 : 0
}

export const leastCommonBit = (bits: number[], onEqual = 0): number => {
  let rowSum = sum(bits);
  if (rowSum === (bits.length / 2)) return onEqual
  return (rowSum > (bits.length / 2)) ? 0 : 1
}

export const transpose = (matrix: number[][]): number[][] => {
  let transposed = filledMatrix(matrix[0].length, matrix.length, 0);
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      transposed[c][r] = matrix[r][c]
    }
  }
  return transposed
}

const calculateGamma = (binaries: number[][]): number => {
  return parseInt(transpose(binaries).map(x => mostCommonBit(x)).join(''), 2)
}

const calculateEpsilon = (gamma: number, bits: number): number => {
  return Math.pow(2, bits) - 1 - gamma
}

const calculateOxRating = (binaries: number[][]) => {
  let transposed = transpose(binaries);
  let binariesCopy = binaries.map(row => [...row])
  for (let i = 0; i < binaries[0].length; i++) {
    binariesCopy = binariesCopy.filter(row => row[i] === mostCommonBit(transposed[i], 1))
    transposed = transpose(binariesCopy)
    if (binariesCopy.length === 1) {
      return parseInt(binariesCopy[0].join(''), 2)
    }
  }
  return 0;
}

const calculateCO2Rating = (binaries: number[][]) => {
  let transposed = transpose(binaries);
  let binariesCopy = binaries.map(row => [...row])
  for (let i = 0; i < binaries[0].length; i++) {
    binariesCopy = binariesCopy.filter(row => row[i] === leastCommonBit(transposed[i], 0))
    transposed = transpose(binariesCopy)
    if (binariesCopy.length === 1) {
      return parseInt(binariesCopy[0].join(''), 2)
    }
  }
  return 0;
}

const example1 = () => {
  let gamma = calculateGamma(exampleInput)
  let epsilon = calculateEpsilon(gamma, exampleInput[0].length);
  let result = gamma * epsilon;
  console.log("Test1 passed: ", result === 198, `result: ${result}`);
  return result === 198
}

const task1 = () => {
  let gamma = calculateGamma(myInput);
  let epsilon = calculateEpsilon(gamma, myInput[0].length);
  let result = gamma * epsilon;
  console.log("Task1: ", result);
  return result;
}

const example2 = () => {
  let ox = calculateOxRating(exampleInput);
  let co2 = calculateCO2Rating(exampleInput);
  let result = ox * co2;
  console.log(`Test2 passed: ${result === 230}, result: ${result}`)
  return result === 230;
}

const task2 = () => {
  let ox = calculateOxRating(myInput);
  let co2 = calculateCO2Rating(myInput);
  let result = ox * co2;
  console.log("Task2: ", result);
  return result;
}

example1();
task1()
example2();
task2();