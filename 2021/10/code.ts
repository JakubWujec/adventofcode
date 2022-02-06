import readInput from "../readFile";

const parseInput = (fileName: string): string[] => {
  let lines = readInput(fileName)
    .split("\r\n")
  return lines;
};

const CLOSING_BRACKET = new Map([
  ['<', '>'],
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
])

const ERROR_SCORE = new Map([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
])

const COMPLETION_SCORE = new Map([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4],
])

const FULL_BRACKETS = ['<>', '[]', '{}', '()'];


const checkLine = (line: string): string => {
  let stack = []

  for(let i = 0; i < line.length; i++){
    if(CLOSING_BRACKET.has(line[i])){
      stack.push(line[i])
    }
    if(Array.from(CLOSING_BRACKET.values()).includes(line[i])){
      let b = stack.pop();
      if(b){
        if(CLOSING_BRACKET.get(b) !== line[i]){
          return line[i];
        }
      }
    }
  }

  return ''
}


const task1 = () => {
  // let lines = parseInput('example.txt')
  let lines = parseInput('input.txt')
  let bs = []
  let sum = 0;
  for(let line of lines){
    let b = checkLine(line)
    bs.push(b)
    if(Array.from(CLOSING_BRACKET.values()).includes(b)){
      sum += ERROR_SCORE.get(b) || 0
    }
  }
  console.log(sum);
}


const reduceLine = (line: string): string => {
  let size = line.length
  let reducedLine = line.slice();
  while(true){
    for(let fullBracket of FULL_BRACKETS){
      reducedLine = reducedLine.replace(fullBracket, '')
    }
    if(reducedLine.length === size){
      return reducedLine;
    }
    size = reducedLine.length
  }
}


const task2 = () => {
  // let lines = parseInput('example.txt')
  let lines = parseInput('input.txt')
  lines = lines.filter(line => 
    checkLine(line) === ''
  )
  lines = lines.map(line => reduceLine(line))
  let lines2 = lines.map(line => line.split('').reverse())
  let sums = []
  let sum = 0;

  for(let l of lines2){
    sum = 0
    for(let b of l){
      let score = COMPLETION_SCORE.get(CLOSING_BRACKET.get(b) || '') || 0
      sum = sum * 5 + score
    }
    sums.push(sum)
  }
  sums.sort((a,b) => a - b)
  console.log(sums[(sums.length - 1) / 2]);
}

task1();
task2();