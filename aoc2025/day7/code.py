from collections import Counter


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def task1(input_data: str):
    answer = 0
    data = input_data.split("\n")
    n = len(data[0])
    s_index = data[0].index("S")
    prev_row = ["."] * n
    prev_row[s_index] = "|"

    for row in data[1:]:
        curr_row = ["."] * n
        for i in range(n):
            if prev_row[i] == "|":
                if row[i] == "^":
                    answer += 1
                    if i - 1 >= 0:
                        curr_row[i - 1] = "|"
                    if i + 1 < n:
                        curr_row[i + 1] = "|"
                else:
                    curr_row[i] = "|"

        prev_row = curr_row

    return answer


def task2(input_data: str):
    data = input_data.split("\n")
    n = len(data[0])
    s_index = data[0].index("S")
    prev_counter = Counter()
    prev_counter[s_index] = 1

    for row in data[1:]:
        curr_counter = Counter()

        for i in range(n):
            if prev_counter[i] > 0:
                if row[i] == "^":
                    if i - 1 >= 0:
                        curr_counter[i - 1] += prev_counter[i]
                    if i + 1 < n:
                        curr_counter[i + 1] += prev_counter[i]
                else:
                    curr_counter[i] += prev_counter[i]

        prev_counter = curr_counter

    return sum(prev_counter.values())


if __name__ == "__main__":
    input_data = get_input_data()

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
