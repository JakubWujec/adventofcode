from collections import Counter, defaultdict
import heapq
from typing import Dict, List

from sortedcontainers import SortedDict, SortedList


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def process_data(input_data) -> Dict[str, List[str]]:
    lines = input_data.split("\n")
    edges = {}
    for line in lines:
        [v1, v2] = line.split(": ")
        neighs = [neigh.strip() for neigh in v2.split(" ")]
        for neigh in neighs:
            if neigh not in edges:
                edges[neigh] = []
        edges[v1] = neighs
    return edges


def task1(
    input_data: str,
):
    edges = process_data(input_data)
    return calculate_ways(edges, "you", "out")
    # return answer


def calculate_ways(edges: Dict[str, List[str]], start: str, end: str):
    node_to_indegree = Counter()
    zero_degrees = []
    counter = Counter()

    for node, edge_list in edges.items():
        if node not in node_to_indegree:
            node_to_indegree[node] = 0

        for neighbor in edge_list:
            node_to_indegree[neighbor] += 1

    for node, indegree in node_to_indegree.items():
        if indegree == 0:
            zero_degrees.append(node)

    start_seen = False

    while zero_degrees:
        node = zero_degrees.pop()

        if node == start:
            start_seen = True
            for neighbor in edges[node]:
                counter[neighbor] += 1
        elif start_seen:
            for neighbor in edges[node]:
                counter[neighbor] += counter.get(node, 0)

        if node in edges:
            for neighbor in edges[node]:
                node_to_indegree[neighbor] -= 1
                if node_to_indegree[neighbor] == 0:
                    zero_degrees.append(neighbor)

        if node == end:
            break
    return counter[end]


def task2(input_data: str):
    edges = process_data(input_data)
    w1 = calculate_ways(edges, "svr", "fft")
    w2 = calculate_ways(edges, "fft", "dac")
    w3 = calculate_ways(edges, "dac", "out")

    w4 = calculate_ways(edges, "svr", "dac")
    w5 = calculate_ways(edges, "dac", "fft")
    w6 = calculate_ways(edges, "fft", "out")

    return w1 * w2 * w3 + w4 * w5 * w6


if __name__ == "__main__":
    input_data = get_input_data()
    input_data2 = get_input_data()

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data2)
    print(f"Answer2: {answer2}")
