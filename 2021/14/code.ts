import { runInThisContext } from "vm";
import readInput from "../readFile";

const parseInput = (fileName: string): [string[], Map<string, string>] => {
  let data = readInput(fileName).split("\r\n");
  let emptyIndex = data.indexOf('');
  let template = data.slice(0, emptyIndex)[0].split('')
  let instructionsList = data.slice(emptyIndex + 1).map(line => line.split(' -> '));
  let instructions = new Map<string, string>()
  instructionsList.forEach(line => {
    instructions.set(line[0], line[1])
  })

  return [template, instructions]
};

class Counter<T>{
  counter: Map<T, number>;
  constructor(){
    this.counter = new Map<T, number>();
  }

  add(elem: T, amount = 1){
    if(this.counter.has(elem)){
      this.counter.set(elem, this.counter.get(elem)! + amount);
    } else {
      this.counter.set(elem, amount);
    }
  }

  remove(elem: T, amount = 1){
    if(this.counter.has(elem)){
      let val = this.counter.get(elem);
      if(val && val > amount){
        this.counter.set(elem, val - amount);
      } else {
        this.counter.delete(elem);
      }
    }
  }

  delete(elem: T){
    this.counter.delete(elem);
  }

  merge(counter: Counter<T>){
    for(let [key,value] of counter.counter.entries()){
      this.add(key, value);
    }
  }

  clear(){
    this.counter.clear();
  }
}

let tasks = (steps = 10) => {
  let [template, instructions] = parseInput('input.txt')
  let letterCounter = new Counter<string>();
  let pairCounter = new Counter<string>();

  for(let i = 0; i < template.length; i++){
    letterCounter.add(template[i]);
    if((i + 1) < template.length){
      pairCounter.add(template[i] + template[i + 1])
    }
  }

  for(let step = 0; step < steps; step++){
    let toMergeCounter = new Counter<string>()
    let toDelete: string[] = []
    for(let [pair, amount] of pairCounter.counter.entries()){
      if(instructions.has(pair)){
        let product = instructions.get(pair)!
        toDelete.push(pair)
        toMergeCounter.add(pair[0] + product, amount);
        toMergeCounter.add(product + pair[1], amount);
        letterCounter.add(product, amount);
      }
    }
    toDelete.forEach(pair => pairCounter.delete(pair));
    pairCounter.merge(toMergeCounter);
  }

  let lc = Array.from(letterCounter.counter.values())
  console.log(Math.max(...lc) - Math.min(...lc))
}


tasks(10);
tasks(40);