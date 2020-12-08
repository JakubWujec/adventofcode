# Advent of code Year 2020 Day 8 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

instructions = input.split('\n')


class Program:
    def __init__(self, instruction_lines):
        self.operations = {
            'acc': self.acc,
            'nop': self.nop,
            'jmp': self.jmp,
        }
        self.index = 0
        self.accumulator = 0
        self.history_indexes = []
        # [operation, value]
        self.instructions = (self.init_instructions(instruction_lines))

    def jmp(self, argument):
        self.index += argument

    def acc(self, argument):
        self.accumulator += argument
        self.index += 1

    def nop(self, argument):
        self.index += 1

    def reset_state(self):
        self.history_indexes = []
        self.accumulator = 0
        self.index = 0

    def init_instructions(self, instructions_lines):
        return [[line.split(' ')[0], int(line.split(' ')[1])] for line in instructions_lines]

    def run1(self):
        self.reset_state()
        while self.index not in self.history_indexes:
            self.history_indexes.append(self.index)
            operation, argument = self.instructions[self.index]
            self.operations[operation](argument)
        return self.accumulator

    def run2(self):
        for index_to_change in range(len(instructions)):
            self.reset_state()
            while True:
                if self.index in self.history_indexes:
                    break
                self.history_indexes.append(self.index)
                operation, argument = self.instructions[self.index]
                if self.index == index_to_change:
                    if operation == 'nop':
                        self.operations['jmp'](argument)
                    elif operation == 'jmp':
                        self.operations['nop'](argument)
                    else:
                        break
                else:
                    self.operations[operation](argument)
                if self.index == (len(self.instructions) - 1):
                    return self.accumulator
        return None


prog = Program(instructions)

print("Part One : " + str(prog.run1()))

print("Part Two : " + str(prog.run2()))
