# Advent of code Year 2020 Day 25 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()

card_pk, door_pk = map(int, input.split('\n'))
print(card_pk, door_pk)

DIVISOR = 20201227
SUBJECT_NUMBER = 7


def find_loop_size(subject_number, pub_key):
    loop_size = 1
    while transform_subject_number(subject_number, loop_size) != pub_key:
        loop_size += 1
    return loop_size


def transform_subject_number(subject_number, loop_size):
    return pow(subject_number, loop_size, DIVISOR)


def z1(subject_number, card_pk, door_pk):
    loop_size = find_loop_size(subject_number, card_pk)
    encryption_key = transform_subject_number(door_pk, loop_size)
    return encryption_key

print(z1(SUBJECT_NUMBER, card_pk, door_pk))

print("Part One : "+ str(None))

print("Part Two : "+ str(None))