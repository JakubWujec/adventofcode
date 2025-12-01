def get_input(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        commands = input.split("\n")
        return commands


def task1(commands):
    answer = 0
    MOD = 100
    position = 50
    sign = 1
    for command in commands:
        sign = -1 if command[0] == "L" else 1
        rotations = int(command[1:])
        position = (position + rotations * sign) % MOD
        if position == 0:
            answer += 1

    return answer


def task2(commands):
    MOD = 100
    answer = 0
    position = 50
    for command in commands:
        sign = -1 if command[0] == "L" else 1
        rotations = int(command[1:])
        for i in range(rotations):
            position = (position + sign) % MOD
            if position == 0:
                answer += 1

    return answer


if __name__ == "__main__":
    commands = get_input()
    print(f"Task1: {task1(commands)}")
    print(f"Task2: {task2(commands)}")
