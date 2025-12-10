import math
import heapq


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def process_data(input_data):
    lines = input_data.split("\n")
    return [[int(x) for x in line.split(",")] for line in lines]


def task1(input_data: str):
    data = process_data(input_data)
    n = len(data)

    max_area = 0
    for i in range(n):
        for j in range(0, i):
            rect_area = area(data[i], data[j])
            max_area = max(max_area, rect_area)

    # print(data)
    return max_area


def task2(input_data: str):
    answer = 0
    data = process_data(input_data)
    n = len(data)
    for i in range(3, n):
        p1, p2, p3, p4 = data[i - 3], data[i - 2], data[i - 1], data[i]
        print(p1)
        if p1[0] == p2[0]:
            if same_sign(p1[1] - p2[1], p4[1] - p3[1]):
                hor1 = abs(p1[1] - p2[1])
                hor2 = abs(p4[1] - p3[1])
                ver1 = abs(p3[0] - p2[0])
                ver2 = abs(p4[0] - p1[0])

                print((p1, p2, p3, p4))
                print((hor1, hor2, ver1, ver2))
                print("--------------")
                answer = max(answer, min(hor1, hor2) * min(ver1, ver2))
        elif p1[1] == p2[1]:
            if same_sign(p1[0] - p2[0], p4[0] - p3[0]):
                ver1 = abs(p1[0] - p2[0])
                ver2 = abs(p4[0] - p3[0])
                hor1 = abs(p3[1] - p2[1])
                hor2 = abs(p4[1] - p1[1])

                print(((p1, p2, p3, p4)))
                print((hor1, hor2, ver1, ver2))
                print("--------------")
                answer = max(answer, min(hor1, hor2) * min(ver1, ver2))

    return answer


def area(p1, p2):
    return abs(p2[0] - p1[0] + 1) * abs(p2[1] - p1[1] + 1)


def same_sign(n1, n2):
    return n1 * n2 > 0


if __name__ == "__main__":
    input_data = get_input_data()

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
