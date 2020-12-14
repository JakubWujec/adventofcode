# Advent of code Year 2020 Day 14 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()

lines = input.split('\n')
program_lines = []
for line in lines:
    addr = None
    instr, val = line.split(' = ')
    if instr[0:3] == 'mem':
        mem, addr = instr.split('[')
        addr = addr[0:-1]
        program_lines.append(('mem', int(addr), int(val)))
    else:
        program_lines.append(('mask', None, val))


def apply_mask_1(string: str, mask: str):
    ls = list(string)
    for index, letter in enumerate(mask):
        if letter != 'X':
            ls[index] = letter
    return ''.join(ls)


def apply_mask_2(string: str, mask: str):
    ls = list(string)
    results = [ls]
    for index, letter in enumerate(mask):
        len_results = len(results)
        for i in range(len_results):
            if letter == '1':
                results[i][index] = '1'
            if letter == 'X':
                result_copy = results[i].copy()
                results[i][index] = '0'
                result_copy[index] = '1'
                results.append(result_copy)
    return list(map(lambda l: ''.join(l), results))


def bin_to_decimal(bin_str):
    return int(bin_str, base=2)


def z1(_program_lines):
    memory = {}
    current_mask = None
    for lin in _program_lines:
        _instr, _addr, _val = lin
        if _instr == 'mask':
            current_mask = _val
        else:
            bin_val = "{0:b}".format(_val).zfill(36)
            res = apply_mask_1(bin_val, current_mask)
            memory[_addr] = bin_to_decimal(res)
    return sum(memory.values())


def z2(_program_lines):
    memory = {}
    current_mask = None
    for lin in _program_lines:
        _instr, _addr, _val = lin
        if _instr == 'mask':
            current_mask = _val
        else:
            bin_addr = "{0:b}".format(_addr).zfill(36)
            addresses = apply_mask_2(bin_addr, current_mask)
            for address in addresses:
                memory[bin_to_decimal(address)] = _val
    return sum(memory.values())


print("Part One : " + str(z1(program_lines)))
print("Part Two : " + str(z2(program_lines)))