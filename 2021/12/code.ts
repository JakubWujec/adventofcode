import { arrayBuffer } from "stream/consumers";
import readInput from "../readFile";

const parseInput = (fileName: string): string[][] => {
  let edges = readInput(fileName)
    .split("\r\n")
    .map((line) => line.split("-"));

  return edges;
};

class Graph {
  nodes: string[]
  edges: Map<string, string[]>
  startNode: string
  endNode: string

  constructor(data: string[][]) {
    this.nodes = [];
    this.edges = new Map();
    this.initialize(data)
    this.startNode = 'start'
    this.endNode = 'end'
  }

  initialize(data: string[][]) {
    for (let line of data) {
      if (!this.edges.has(line[0])) {
        this.edges.set(line[0], [line[1]])
      } else {
        this.edges.set(line[0], [...this.edges.get(line[0])!, line[1]])
      }
      if (!this.edges.has(line[1])) {
        this.edges.set(line[1], [line[0]])
      } else {
        this.edges.set(line[1], [...this.edges.get(line[1])!, line[0]])
      }
      if (!this.nodes.includes(line[0])) this.nodes.push(line[0])
      if (!this.nodes.includes(line[1])) this.nodes.push(line[1])
    }
  }

  isSmallNode(node: string): boolean {
    return node === node.toLowerCase();
  }
}

const findPaths = (graph: Graph) => {
  let finishedPaths: string[][] = []
  let currentPaths: string[][] = [[graph.startNode]];

  while (currentPaths.length > 0) {
    let currentPath: string[] = currentPaths.pop()!;
    let lastNode: string = currentPath[currentPath.length - 1];
    let nextNodes: string[] = graph.edges.get(lastNode)!;
    if (nextNodes) {
      for (let node of nextNodes) {
        if (graph.isSmallNode(node) && (currentPath.includes(node))) {
          continue;
        }
        else {
          if (node === graph.endNode) {
            finishedPaths.push([...currentPath, node]);
          } else {
            currentPaths.push([...currentPath, node]);
          }
        }

      }
    }

  }
  return finishedPaths;
}


const task1 = () => {
  let data = parseInput('input.txt');
  let graph = new Graph(data)
  let finishedPaths = findPaths(graph)
  console.log(finishedPaths.length);
}

const hasDuplicates = (arr: any[]) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if ((arr[i] === arr[j]) && (i !== j)) {
        return true;
      }
    }
  }
  return false;
}

const findPaths2 = (graph: Graph) => {
  let finishedPaths: string[][] = []
  let currentPaths: string[][] = [[graph.startNode]];

  while (currentPaths.length > 0) {
    let currentPath: string[] = currentPaths.pop()!;
    let twicey = hasDuplicates(currentPath.filter(node => graph.isSmallNode(node)));
    let lastNode: string = currentPath[currentPath.length - 1];
    let nextNodes: string[] = graph.edges.get(lastNode)!;
    if (nextNodes) {
      for (let node of nextNodes) {
        if (node === graph.startNode) {
          continue;
        }
        if (graph.isSmallNode(node) && (currentPath.includes(node) && twicey)) {
          continue;
        }
        else {
          if (node === graph.endNode) {
            finishedPaths.push([...currentPath, node]);
          } else {
            currentPaths.push([...currentPath, node]);
          }
        }

      }
    }

  }
  return finishedPaths;
}

const task2 = () => {
  let data = parseInput('input.txt');
  let graph = new Graph(data)
  let finishedPaths = findPaths2(graph)
  console.log(finishedPaths.length);
}


task1()
task2();