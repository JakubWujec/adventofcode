# Advent of code Year 2020 Day 5 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()

seat_strings: [str] = input.split('\n')
seats_ids: [int] = []


def calculate_seat_id(seat_row: int, seat_col: int):
    return seat_row * 8 + seat_col


def convert_to_seat_id(seat: str):
    binary = seat.replace('F', '0').replace('B', '1').replace('R', '1').replace('L', '0')
    seat_row = int(binary[0:7], 2)
    seat_col = int(binary[7:], 2)
    return calculate_seat_id(seat_row, seat_col)


max_sid = 0
for seat_string in seat_strings:
    sid = convert_to_seat_id(seat_string)
    seats_ids.append(sid)
    if sid > max_sid:
        max_sid = sid

sorted_seats = sorted(seats_ids)
min_seat = sorted_seats[0]
z2 = -1
for index in range(len(sorted_seats)):
    if sorted_seats[index+1] - sorted_seats[index] == 2:
        z2 = sorted_seats[index] + 1
        break

print("Part One : "+ str(max_sid))

print("Part Two : "+ str(z2))