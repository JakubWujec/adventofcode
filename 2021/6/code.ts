import readInput from "../readFile";

const parseInput = (fileName: string): number[] => {
  let numbers = readInput(fileName)
    .split(",")
    .map((x) => parseInt(x));

  return numbers;
};

let numbers = parseInput("input.txt");

class Cache {
  cache = new Map<string, number>();

  constructor() {}

  set(state: number, day: number, value: number): void {
    this.cache.set(`${state},${day}`, value);
  }

  get(state: number, day: number): number {
    let val = this.cache.get(`${state},${day}`);
    return val ? val : 0;
  }
}

const countLanterns2 = (state: number, days: number, cache: Cache): number => {
  let val = cache.get(state, days);

  if (val) return val;

  if (days === 0 || days <= state) {
    cache.set(state, days, 1);
    return 1;
  }

  if (state === 0) {
    val =
      countLanterns2(6, days - 1, cache) + countLanterns2(8, days - 1, cache);
    cache.set(state, days, val);
    return val;
  }

  if (days > state) {
    val = countLanterns2(0, days - state, cache);
    cache.set(state, days, val);
    return val;
  }

  return 0;
};

const cycle2 = (numbers: number[], days: number): number => {
  let cache = new Cache();
  let sum = 0;

  for (let state of numbers) {
    sum += countLanterns2(state, days, cache);
  }

  return sum;
};

console.log(cycle2(numbers, 18));
console.log(cycle2(numbers, 80));
console.log(cycle2(numbers, 256));
