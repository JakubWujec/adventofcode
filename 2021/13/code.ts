import readInput from "../readFile";

const parseInput = (fileName: string): [number[][], [string, number][]] => {
  let data = readInput(fileName).split("\r\n");
  let emptyIndex = data.indexOf('');
  let dots = data.slice(0, emptyIndex).map(line => line.split(',').map(x => parseInt(x)));
  let instructions: [string, number][] = data.slice(emptyIndex + 1).map(line => line.replace('fold along ', '').split('=')).map(instr => [instr[0], parseInt(instr[1])])

  return [dots, instructions]
};

const filledMatrix = (rows: number, columns: number, fill: any) => {
  let copy = new Array(rows);
  for (let i = 0; i < rows; i++) {
    copy[i] = new Array(columns).fill(fill);
  }
  return copy;
}

const transpose = (matrix: any[][]): any[][] => {
  let transposed = filledMatrix(matrix[0].length, matrix.length, 0);
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      transposed[c][r] = matrix[r][c]
    }
  }
  return transposed
}

const makePaper = (dots: number[][]) => {
  let xMax = Math.max(...dots.map(dot => dot[0]))
  let yMax = Math.max(...dots.map(dot => dot[1]))
  let arr: string[][] = [];
  for(let i = 0; i < xMax + 1; i++){
    let row = []
    for(let j = 0; j < yMax + 1; j++){
      row.push('.')
    }
    arr.push(row);
  }
  for(let dot of dots){
    arr[dot[0]][dot[1]] = '#'
  }
  arr = transpose(arr)
 
  return arr;

}

let tasks = () => {
  let [dots, folds] = parseInput('input.txt');
  let paper = makePaper(dots)
  for(let fold of folds){
    let newDots: number[][] = []
    for(let dot of dots){
      if(fold[0] === 'x'){
        if(dot[0] > fold[1]){
          newDots.push([2 * fold[1] - dot[0], dot[1]])
        } else {
          newDots.push(dot)
        }
      } else if(fold[0] === 'y'){
        if(dot[1] > fold[1]){
          newDots.push([dot[0], 2 * fold[1] - dot[1]]);
        } else {
          newDots.push(dot);
        }
      } 
    }
    dots = newDots;
    paper = makePaper(dots)
    console.log(paper.flat().filter(elem => elem === '#').length);
  }
  for(let row of paper){
    console.log(row.join(''))
  }

  
}



tasks();