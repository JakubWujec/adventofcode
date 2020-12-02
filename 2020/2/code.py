# Advent of code Year 2020 Day 2 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

input_list: [str] = input.split('\n')


def z1(lines: [str]):
    correct = 0
    for line in lines:
        range_condition, letter, word = line.split(' ')
        mini, maxi = list(map(int, range_condition.split('-')))
        letter = letter.replace(':', '')
        count = word.count(letter)
        if mini <= count <= maxi:
            correct += 1
    return correct


def z2(lines: [str]):
    correct = 0
    for line in lines:
        indexes, letter, word = line.split(' ')
        index1, index2 = list(map(int, indexes.split('-')))
        letter = str(letter.replace(':', ''))
        if (word[index1-1] == letter) != (word[index2-1] == letter):
            correct += 1
    return correct


print("Part One : " + str(z1(input_list)))

print("Part Two : " + str(z2(input_list)))
