# Advent of code Year 2020 Day 23 solution
# Author = ?
# Date = December 2020


with open((__file__.rstrip("code3.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

cups = list(map(int, list(input)))


class CupNode:
    def __init__(self, value, _prev=None, _next=None):
        self.value = value
        self.prev = _prev
        self.next = _next

    def __repr__(self):
        return 'N' + str(self.value)


class CupStorage:
    def __init__(self):
        self.cup_dict = {}

    @classmethod
    def from_list(cls, cup_list):
        cs = CupStorage()
        head = CupNode(cup_list[0])
        cs.cup_dict[head.value] = head
        tmp = head

        for value in cup_list[1:]:
            new_node = CupNode(value)
            tmp.next = new_node
            new_node.prev = tmp
            cs.cup_dict[new_node.value] = new_node

            tmp = tmp.next

        tmp.next = head
        head.prev = tmp
        return cs

    def get_by_value(self, value):
        return self.cup_dict[value]

    def as_list(self, _from: CupNode):
        tmp = _from
        l = [tmp]
        while tmp.next != _from:
            l.append(tmp.next)
            tmp = tmp.next
        return l

    def __repr__(self):
        return str(self.cup_dict)


def pick_next_cups(cup_node: CupNode, to_pick: int):
    picked = []
    tmp = cup_node
    for i in range(to_pick):
        picked.append(tmp.next)
        tmp = tmp.next
    cup_node.next = tmp.next
    tmp.next.prev = cup_node
    picked[0].prev = None
    picked[-1].next = None
    return picked


def insert_after(to_insert: CupNode, node: CupNode):
    next_node = node.next
    node.next = to_insert
    to_insert.prev = node
    to_insert.next = next_node
    next_node.prev = to_insert


def find_destination_cup_value(current_cup_value, num_of_cups, picked_cups_values: [int]):
    label = current_cup_value
    while label in picked_cups_values or label == current_cup_value:
        label = label - 1
        if label == 0:
            label = num_of_cups
    return label


def task(turns: int, input_cup_list: [int]):
    N = len(input_cup_list)
    cup_storage = CupStorage.from_list(input_cup_list)
    first_cup = cup_storage.get_by_value(1)
    current_cup = cup_storage.get_by_value(input_cup_list[0])

    for turn in range(turns):
        picked_cups = pick_next_cups(current_cup, 3)
        destination_cup_value = find_destination_cup_value(current_cup.value, N,
                                                           list(map(lambda cup: cup.value, picked_cups)))
        destination_cup = cup_storage.get_by_value(destination_cup_value)

        tmp = destination_cup
        for cup in picked_cups:
            insert_after(cup, tmp)
            tmp = tmp.next

        current_cup = current_cup.next
    return cup_storage, first_cup


def z1(turns: int, input_cup_list: [int]):
    cup_storage, first_cup = task(turns, input_cup_list)
    return ''.join(map(lambda cup: str(cup.value), cup_storage.as_list(first_cup)[1:]))


def z2(turns: int, input_cup_list: [int]):
    cup_storage, first_cup = task(turns, input_cup_list)
    return first_cup.next.value * first_cup.next.next.value


print("Part One : " + z1(100, cups))

expanded_cups = cups + list(range(10, 1000000 + 1))
print("Part Two : " + str(z2(10000000, expanded_cups)))
