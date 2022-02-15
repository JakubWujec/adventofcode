import readInput from "../readFile";

const parseInput = (fileName: string): string[][][] => {
  let data = readInput(fileName)
    .split("\r\n")
    .map((line) => line.split(" | ").map((x) => x.split(" ").map(word => sortString(word))));

  return data;
};

const sortString = (str: string): string => {
  return str.split('').sort().join('');
} 

const countOccurences = <T>(arr: T[], elem: T): number => {
  let counter = 0;
  for (let x of arr) {
    if (x === elem) {
      counter++;
    }
  }
  return counter;
};

function intersection<T>(setA: Set<T>, setB: Set<T>) {
  let _intersection = new Set()
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

function difference<T>(setA: Set<T>, setB: Set<T>) {
  let _difference = new Set(setA)
  for (let elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}

function isSuperset<T>(set: Set<T>, subset: Set<T>) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}

const task1 = () => {
  let data = parseInput("input.txt");
  let counter = 0;
  for (let display of data) {
    let [patterns, outputValue] = display;
    let patternForOne = patterns.find((pattern) => pattern.length === 2);
    let patternForFour = patterns.find((pattern) => pattern.length === 4);
    let patternForSeven = patterns.find((pattern) => pattern.length === 3);
    let patternForEight = patterns.find((pattern) => pattern.length === 7);
    counter = counter +
      countOccurences<string>(outputValue, patternForOne!) +
      countOccurences<string>(outputValue, patternForFour!) +
      countOccurences<string>(outputValue, patternForSeven!) +
      countOccurences<string>(outputValue, patternForEight!);
  }
  console.log(counter);
};

const task2 = () => {
  const outputValueToNumber = (outputValue: string[], patternToDigit: Map<string, number> ): number => {
    return parseInt(outputValue.map(ov => patternToDigit.get(ov)).join(''))
  }

  let data = parseInput("input.txt");
  let counter = 0;

  for (let display of data) {
    let patternToDigit = new Map<string, number>();
    let [patterns, outputValue] = display;
    let patternForOne = patterns.find((pattern) => pattern.length === 2);
    let patternForFour = patterns.find((pattern) => pattern.length === 4);
    let patternForSeven = patterns.find((pattern) => pattern.length === 3);
    let patternForEight = patterns.find((pattern) => pattern.length === 7);
    patternToDigit.set(patternForOne!, 1);
    patternToDigit.set(patternForFour!, 4);
    patternToDigit.set(patternForSeven!, 7);
    patternToDigit.set(patternForEight!, 8);

    let aSegment = Array.from(difference(new Set(patternForSeven), new Set(patternForOne)))[0]

    let patternForNine = patterns
      .filter(pattern => !patternToDigit.has(pattern))
      .find(pattern => isSuperset(new Set(pattern), new Set(sortString(patternForFour + aSegment))));
    patternToDigit.set(patternForNine!, 9);

    let patternForSix = patterns
      .filter(pattern => !patternToDigit.has(pattern))
      .find(pattern => isSuperset(new Set(pattern), difference(new Set(patternForEight), new Set(patternForOne))));
    patternToDigit.set(patternForSix!, 6);
    
    let patternForZero = patterns
      .filter(pattern => !patternToDigit.has(pattern))
      .find(pattern => pattern.length === 6);
    patternToDigit.set(patternForZero!, 0);

    // 2,3,5 left
    let patternForThree = patterns
      .filter(pattern => !patternToDigit.has(pattern))
      .find(pattern => isSuperset(new Set(pattern), new Set(patternForOne)));
    patternToDigit.set(patternForThree!, 3);

    let patternForFive = patterns
    .filter(pattern => !patternToDigit.has(pattern))
    .find(pattern => isSuperset(new Set(patternForSix), new Set(pattern)));
    patternToDigit.set(patternForFive!, 5);

    let patternForTwo = patterns.find(pattern => !patternToDigit.has(pattern));
    patternToDigit.set(patternForTwo!, 2);

    counter += outputValueToNumber(outputValue, patternToDigit);
  }

  console.log(counter);

};


task2();
