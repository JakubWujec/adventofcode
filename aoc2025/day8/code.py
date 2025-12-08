import math
import heapq


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def process_data(input_data):
    lines = input_data.split("\n")
    return [[int(x) for x in line.split(",")] for line in lines]


def task1(input_data: str, number_of_connections=1000):
    answer = 0
    points = process_data(input_data)

    heap = []
    for i in range(len(points)):
        for j in range(0, i):
            if i != j:
                heapq.heappush(heap, (distance(points[i], points[j]), i, j))

    uf = UnionFind(len(points))

    for i in range(number_of_connections):
        d, p1, p2 = heapq.heappop(heap)
        uf.union(p1, p2)

    answer = math.prod(find_three_max_values(uf.group_size))
    return answer


def task2(input_data: str):
    answer = 0
    points = process_data(input_data)

    heap = []
    for i in range(len(points)):
        for j in range(0, i):
            if i != j:
                heapq.heappush(heap, (distance(points[i], points[j]), i, j))

    uf = UnionFind(len(points))

    connected = 0

    while connected < (len(points) - 1):
        d, p1, p2 = heapq.heappop(heap)
        if uf.union(p1, p2):
            connected += 1
            answer = points[p1][0] * points[p2][0]

    return answer


def distance(p1, p2):
    return math.dist(p1, p2)


class UnionFind:
    def __init__(self, size):
        self.parent = list(range(size))
        self.group_size = [1] * size

    def find(self, p):
        if self.parent[p] != p:
            self.parent[p] = self.find(self.parent[p])
        return self.parent[p]

    def union(self, p, q):
        rootP = self.find(p)
        rootQ = self.find(q)

        if rootP == rootQ:
            return False

        if self.group_size[rootP] >= self.group_size[rootQ]:
            self.parent[rootQ] = rootP
            self.group_size[rootP] += self.group_size[rootQ]
            self.group_size[rootQ] = 0
        else:
            self.parent[rootP] = rootQ
            self.group_size[rootQ] += self.group_size[rootP]
            self.group_size[rootP] = 0
        return True


def find_three_max_values(nums):
    if len(nums) < 3:
        raise ValueError("List must contain at least three elements.")

    first_max = second_max = third_max = float("-inf")

    for num in nums:
        if num > first_max:
            third_max = second_max
            second_max = first_max
            first_max = num
        elif num > second_max:
            third_max = second_max
            second_max = num
        elif num > third_max:
            third_max = num

    return first_max, second_max, third_max


if __name__ == "__main__":
    input_data = get_input_data()

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
