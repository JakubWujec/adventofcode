import readInput from "../readFile";

const parseInput = (fileName: string): number[][] => {
  let numbers = readInput(fileName)
    .split("\r\n")
    .map((line) => line.split("").map((n) => parseInt(n)));

  return numbers;
};

const increaseNeighbours = (board: number[][], row: number, column: number) => {
  for(let r = row - 1; r <= (row + 1); r++){
    for(let c = column - 1; c <= (column + 1); c++){
      if((r !== row) || (c !== column)){
        if((r >= 0) && (r < board.length) && (c >= 0) && (c < board[r].length)){
          board[r][c] = board[r][c] + 1
        }
      }
    }
  }
}



const task1 = (steps: number = 100) => {
  let board = parseInput('input.txt')
  let nextBoard = board.map(row => [...row])
  let counter = 0


  for(let step =0; step < steps; step++){

    nextBoard = nextBoard.map(row => row.map(octopus => octopus + 1));

    let flashed = true;
    while(flashed) {
      flashed = false;
      for(let row = 0; row < board.length; row++){
        for(let column = 0; column < board[row].length; column++){
          if(nextBoard[row][column] > 9){
            flashed = true
            counter++
            increaseNeighbours(nextBoard, row, column)
            nextBoard[row][column]= -99999999
          }
        }
      }
    }
  
    for(let row = 0; row < board.length; row++){
      for(let column = 0; column < board[row].length; column++){
        if(nextBoard[row][column] < 0){
          nextBoard[row][column]= 0
        }
      }
    }

  }

  console.log(counter);
}

task1(100)

const task2 = () => {
  let board = parseInput('example.txt')
  let nextBoard = board.map(row => [...row])
  let counter = 0
  let round = 0


  while(counter !== 100){
    round ++;
    counter = 0
    nextBoard = nextBoard.map(row => row.map(octopus => octopus + 1));

    let flashed = true;
    while(flashed) {
      flashed = false;
      for(let row = 0; row < board.length; row++){
        for(let column = 0; column < board[row].length; column++){
          if(nextBoard[row][column] > 9){
            flashed = true
            counter++
            increaseNeighbours(nextBoard, row, column)
            nextBoard[row][column]= -99999999
          }
        }
      }
    }
  
    for(let row = 0; row < board.length; row++){
      for(let column = 0; column < board[row].length; column++){
        if(nextBoard[row][column] < 0){
          nextBoard[row][column]= 0
        }
      }
    }

  }

  console.log(round);
}

task2()