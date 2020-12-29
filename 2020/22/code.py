# Advent of code Year 2020 Day 22 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read().split('\n\n')

deck1 = list(map(int, (input[0].split('\n')[1:])))
deck2 = list(map(int, (input[1].split('\n')[1:])))


def is_first_higher(_card1, _card2):
    return _card1 > _card2


def both_decks_have_cards(_deck1, _deck2):
    return len(_deck1) > 0 and len(_deck2) > 0


def count_score(_deck):
    score = 0
    for index, card in enumerate(_deck[::-1]):
        score += (index + 1) * card
    return score


def play_combat(_deck1, _deck2):
    while both_decks_have_cards(_deck1, _deck2):
        card1, card2 = _deck1.pop(0), _deck2.pop(0)
        if is_first_higher(card1, card2):
            _deck1.append(card1)
            _deck1.append(card2)
        else:
            _deck2.append(card2)
            _deck2.append(card1)

    return max(count_score(_deck1), count_score(_deck2))


def play_recursive_combat(_deck1, _deck2):
    history = []
    history_repeated = False
    rounds = 0
    while both_decks_have_cards(_deck1, _deck2):
        rounds += 1
        if (_deck1, _deck2) in history:
            history_repeated = True
            break
        else:
            history.append((_deck1.copy(), _deck2.copy()))

        card1, card2 = _deck1.pop(0), _deck2.pop(0)
        if len(_deck1) >= card1 and len(_deck2) >= card2:
            if player_one_won_recursive_subcombat(_deck1[:card1].copy(), _deck2[:card2].copy()):
                _deck1.append(card1)
                _deck1.append(card2)
            else:
                _deck2.append(card2)
                _deck2.append(card1)
        else:
            if is_first_higher(card1, card2):
                _deck1.append(card1)
                _deck1.append(card2)
            else:
                _deck2.append(card2)
                _deck2.append(card1)
    if history_repeated:
        return count_score(_deck1)
    else:
        return max(count_score(_deck1), count_score(_deck2))


def player_one_won_recursive_subcombat(_deck1, _deck2):
    history = []
    while both_decks_have_cards(_deck1, _deck2):
        # print(_deck1, _deck2)
        if (_deck1, _deck2) in history:
            return True
        else:
            history.append((_deck1.copy(), _deck2.copy()))

        card1, card2 = _deck1.pop(0), _deck2.pop(0)

        if len(_deck1) >= card1 and len(_deck2) >= card2:
            if player_one_won_recursive_subcombat(_deck1[:card1].copy(), _deck2[:card2].copy()):
                _deck1.append(card1)
                _deck1.append(card2)
            else:
                _deck2.append(card2)
                _deck2.append(card1)
        else:
            if is_first_higher(card1, card2):
                _deck1.append(card1)
                _deck1.append(card2)
            else:
                _deck2.append(card2)
                _deck2.append(card1)
    return len(_deck1) > 0


print("Part One : " + str(print(play_combat(deck1.copy(), deck2.copy()))))

print("Part Two : " + str(print(play_recursive_combat(deck1.copy(), deck2.copy()))))
