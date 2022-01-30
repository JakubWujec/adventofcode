import readInput from "../readFile";

const parseInput = (fileName: string): [number[], number[][][]] => {
  let a = readInput(fileName).split("\r\n").filter(line => line !== '')
  let numbers = a.splice(0, 1)[0].split(',').map(x => parseInt(x))
  let boards = [];
  for (let i = 0; i * 5 + 5 <= a.length; i++) {
    boards.push(a.slice(i * 5, i * 5 + 5).map(row => row.split(' ').map(x => parseInt(x)).filter(x => !isNaN(x))))
  }
  return [numbers, boards]
}

class BingoBoard {
  board: number[][];
  bitBoard: Boolean[][];

  constructor(board: number[][]) {
    this.board = board;
    this.bitBoard = board.map(row => row.map(x => false));
  }

  markNumber(num: number) {
    for(let row = 0; row < this.board.length; row++){
      for(let column = 0; column < this.board[row].length; column++){
        if(this.board[row][column] === num){
          this.bitBoard[row][column] = true;
        }
      }
    }  
  }

  checkWin(){
    return this.checkRows() || this.checkColumns();
  }

  checkRows(){
    for(let row = 0; row < this.board.length; row++){
      let win = true;
      for(let column = 0; column < this.board[row].length; column++){
        if(this.bitBoard[row][column] === false){
          win= false;
        }
      }
      if(win){
        return win;
      }
    }  
    return false;
  }

  checkColumns(){
    for(let column = 0; column < this.board[0].length; column++){
      let win = true;
      for(let row = 0; row < this.board.length; row++){
        if(this.bitBoard[row][column]=== false){
          win = false;
        }
      }
      if(win){
        return win;
      }
    }  
    return false;
  }

  sumUnmarked(){
    let sum = 0;
    for(let row = 0; row < this.board.length; row++){
      for(let column = 0; column < this.board[row].length; column++){
        if(!this.bitBoard[row][column]){
          sum += this.board[row][column]
        }
      }
    }
    return sum;
  }
}

const play = (numbersData: number[], boardsData: number[][][]) => {
  let numbers = numbersData;
  let bingoBoards = boardsData.map(board => new BingoBoard(board));

  for(let turn = 0; turn < numbers.length; turn++){
    bingoBoards.forEach(board => board.markNumber(numbers[turn]))
    let winningBoard = bingoBoards.find(bingoBoard => bingoBoard.checkWin());

    if(winningBoard){
      return winningBoard.sumUnmarked() * numbers[turn]
    }

  }
}

const play2 = (numbersData: number[], boardsData: number[][][]) => {
  let numbers = numbersData;
  let bingoBoards = boardsData.map(board => new BingoBoard(board));

  for(let turn = 0; turn < numbers.length; turn++){
    bingoBoards.forEach(board => board.markNumber(numbers[turn]))
    let winners: BingoBoard[] = []
    let stillPlaying: BingoBoard[] = []
    bingoBoards.forEach(bb => {
      if(bb.checkWin()){
        winners.push(bb);
      } else {
        stillPlaying.push(bb);
      }
    })

    if(stillPlaying.length === 0){
      return winners[0].sumUnmarked() * numbers[turn]
    }

    bingoBoards = stillPlaying;
  }
}


let [ex1,ex2] = parseInput('example.txt')
console.log(play(ex1, ex2))
console.log(play2(ex1, ex2))

let [in1,in2] = parseInput('input.txt')
console.log(play(in1, in2))
console.log(play2(in1, in2))
