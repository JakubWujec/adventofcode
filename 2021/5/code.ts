import readInput from "../readFile";

const parseInput = (fileName: string): number[][][] => {
  let lines = readInput(fileName)
    .split("\r\n")
    .map((line) =>
      line
        .split(" -> ")
        .map((vent) => vent.split(",").map((num) => parseInt(num)))
        .sort((end1, end2) =>
          end1[1] - end2[1] === 0 ? end1[0] - end2[0] : end1[1] - end2[1]
        )
    );
  return lines;
};

const isHorizontal = (end1: number[], end2: number[]): boolean => {
  return end1[1] === end2[1];
};

const isVertical = (end1: number[], end2: number[]): boolean => {
  return end1[0] === end2[0];
};

const isDiagonal = (end1: number[], end2: number[]): boolean => {
  return Math.abs(end1[0] - end2[0]) === Math.abs(end1[1] - end2[1]);
};

let lines: number[][][] = parseInput("input.txt");

let count = (lines: number[][][], withDiagonal = false): number => {
  let counter = new Map();
  const update = (map: Map<string, number>, key: string) => {
    if (map.has(key)) {
      map.set(key, map.get(key)! + 1);
    } else {
      map.set(key, 1);
    }
  };
  lines.forEach((line) => {
    let [end1, end2] = line;
    if (isHorizontal(end1, end2)) {
      for (let x = end1[0]; x <= end2[0]; x++) {
        let key = `${x},${end1[1]}`;
        update(counter, key);
      }
    } else if (isVertical(end1, end2)) {
      for (let y = end1[1]; y <= end2[1]; y++) {
        let key = `${end1[0]},${y}`;
        update(counter, key);
      }
    } else if (withDiagonal && isDiagonal(end1, end2)) {
      for (let i = 0; i <= Math.abs(end2[0] - end1[0]); i++) {
        let key = `${end1[0] + (end1[0] < end2[0] ? i : -i)},${end1[1] + i}`;
        update(counter, key);
      }
    }
  });
  return Array.from(counter.values()).filter((x) => x > 1).length;
};

const task1 = () => {
  console.log(count(lines));
};

const task2 = () => {
  console.log(count(lines, true));
};

task1();
task2();
