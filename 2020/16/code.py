# Advent of code Year 2020 Day 16 solution
# Author = ?
# Date = December 2020
import re
import copy

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

rules_input, your_ticket, nearby_tickets = input.split('\n\n')
your_ticket = list(map(int, your_ticket.split('\n')[1].split(',')))
nearby_tickets = [list(map(int, x.split(','))) for x in nearby_tickets.split('\n')[1:]]

def process_rules(r_string):
    rules_dict = {}
    r_strings = r_string.split('\n')
    for r in r_strings:
        key, ranges = r.split(':')
        rules_dict[key] = []
        ranges = ranges.split(' or ')
        for rr in ranges:
            start, end = rr.split('-')
            rules_dict[key].append(range(int(start), int(end)+1))
    return rules_dict


rules = process_rules(rules_input)
rules_ranges = [v for sublist in rules.values() for v in sublist]


def is_value_in_ranges(value, ranges):
    for r in ranges:
        if value in r:
            return True
    return False


def values_at(index, lists):
    return list(map(lambda x: x[index], lists))


def are_values_fit_ranges(values, ranges):
    for value in values:
        if not is_value_in_ranges(value, ranges):
            return False
    return True


def validate_ticket(ticket):
    error_rate = 0
    for val in ticket:
        if not is_value_in_ranges(val, rules_ranges):
            error_rate += val
    return error_rate


def z1():
    return sum([validate_ticket(t) for t in nearby_tickets])


all_tickets = copy.deepcopy(nearby_tickets)
all_tickets.append(your_ticket)
valid_tickets = list(filter(lambda t: validate_ticket(t) == 0, all_tickets))


def z2():
    rule_index_map = {rule: [] for rule in rules}
    unique_rule_index_map = {}
    for rule in rules:
        for index in range(len(rules)):
            if are_values_fit_ranges(values_at(index, valid_tickets), rules[rule]):
                rule_index_map[rule].append(index)
    print(rule_index_map)
    loop = True
    while loop:
        n = len(rule_index_map)
        x = {key: _list for key, _list in rule_index_map.items() if len(_list) == 1}
        if len(x) == 0:
            break
        val = list(x.values())[0][0]
        key = list(x.keys())[0]
        unique_rule_index_map[key] = val
        rule_index_map.pop(key)
        for rule in rule_index_map:
            if val in rule_index_map[rule]:
                rule_index_map[rule].remove(val)
        if len(rule_index_map) == 0:
            loop = False

    res = {k: v for k, v in unique_rule_index_map.items() if str.startswith(k, 'departure')}
    result = 1
    for val in res.values():
        result *= your_ticket[val]
    return result


print("Part One : " + str(z1()))

print("Part Two : " + str(z2()))
