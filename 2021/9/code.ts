import readInput from "../readFile";

const parseInput = (fileName: string): number[][] => {
  let numbers = readInput(fileName)
    .split("\r\n")
    .map((line) => line.split("").map((letter) => parseInt(letter)));

  return numbers;
};

let heights = parseInput("input.txt");
// let heights = parseInput('example.txt')

const neighbours4 = (
  heights: number[][],
  row: number,
  column: number
): number[][] => {
  let neighbours = [];
  if (row > 0) neighbours.push([row - 1, column]);
  if (row < heights.length - 1) neighbours.push([row + 1, column]);
  if (column > 0) neighbours.push([row, column - 1]);
  if (column < heights[0].length - 1) neighbours.push([row, column + 1]);
  return neighbours;
};

let getLowPoints = (heights: number[][]): number[][] => {
  let lowPoints = [];
  for (let row = 0; row < heights.length; row++) {
    for (let column = 0; column < heights[0].length; column++) {
      let val = heights[row][column];
      let neighbours = neighbours4(heights, row, column);
      if (
        neighbours.some(
          (neighbour) => heights[neighbour[0]][neighbour[1]] <= val
        )
      ) {
        continue;
      }
      lowPoints.push([row, column]);
    }
  }
  return lowPoints;
};

let task1 = (numbers: number[][]) => {
  let lowPoints = getLowPoints(numbers);
  console.log(
    `1. Risk level: ${lowPoints
      .map((lp) => numbers[lp[0]][lp[1]])
      .map((x) => x + 1)
      .reduce((a, b) => a + b, 0)}`
  );
};

let task2 = (numbers: number[][]) => {
  let lowPoints: number[][] = getLowPoints(numbers);
  let scores: any[] = []

  lowPoints.forEach((lp) => {
    let visited: number[][] = [];
    let queue: number[][] = [];
    queue.push(lp);

    while (queue.length > 0) {
      let position: number[] = queue.pop()!;
      visited.push(position);
      let neighbours = neighbours4(numbers, position[0], position[1]).filter(pos => heights[pos[0]][pos[1]] !== 9);

      for (let neighbour of neighbours) {
        if (!visited.some(([row, column]) => ((row === neighbour[0]) && (column === neighbour[1])))) {
          if (!queue.some(([row, column]) => ((row === neighbour[0]) && (column === neighbour[1])))){
            queue.push(neighbour);
          }
          
        }
      }
    }
    scores.push(visited.length)
  });
  scores.sort((a,b) => b - a)
  console.log(`2. Basins: ${scores[0] * scores[1] * scores[2]}`);
};

task1(heights);
task2(heights)
