import heapq


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def calculate_bank_joltage(bank: str, batteries: int):
    n = len(bank)
    left_boundary = 0
    batteries_left = batteries
    heap = []

    for idx, value in enumerate(bank[: n - batteries + 1]):
        heap.append((-int(value), idx))

    heapq.heapify(heap)
    answer = []

    while batteries_left > 0:
        value, idx = heapq.heappop(heap)
        value = -value

        if idx < left_boundary:
            continue

        answer.append(value)
        batteries_left -= 1
        if batteries_left:
            heapq.heappush(heap, (-int(bank[-batteries_left]), n - batteries_left))

        left_boundary = idx + 1
    return int("".join([str(num) for num in answer]))


def task1(input_data: str):
    banks = input_data.split("\n")
    banks = [b for b in banks if len(b) > 0]
    return sum(calculate_bank_joltage(bank, 2) for bank in banks)


def task2(input_data: str):
    banks = input_data.split("\n")
    banks = [b for b in banks if len(b) > 0]
    return sum(calculate_bank_joltage(bank, 12) for bank in banks)


if __name__ == "__main__":
    input_data = get_input_data()
    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
