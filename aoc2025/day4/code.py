from typing import List


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def task1(input_data: str):
    grid = input_data.split("\n")
    while grid[-1] == "":
        grid.pop()
    answer = 0

    for r in range(len(grid)):
        for c in range(len(grid[r])):
            if grid[r][c] == "@":
                adj = get_8_adjacement(grid, r, c)
                if adj.count("@") < 4:
                    answer += 1
    return answer


def get_8_adjacement(grid: List[str], row: int, column: int):
    rows = len(grid)
    columns = len(grid[0])

    result = []

    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            n_row = row + dx
            n_col = column + dy

            if n_row != row or n_col != column:
                if n_row >= 0 and n_col >= 0 and n_row < rows and n_col < columns:
                    result.append(grid[n_row][n_col])
    return result


def task2(input_data: str):
    return 0


if __name__ == "__main__":
    input_data = get_input_data()
    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
