# Advent of code Year 2020 Day 21 solution
# Author = ?
# Date = December 2020

with open((__file__.rstrip("code.py")+"input.txt"), 'r') as input_file:
    input = input_file.read()
input = input.replace('(', '').replace(')','').replace(',', '')
lines = input.split('\n')
LIST_OF_FOOD = []
ALL_INGREDIENTS = set()
ALL_ALLERGENS = set()

for food in lines:
    ingredients, allergens = food.split(' contains ')
    allergens = allergens.split(' ')
    ingredients = ingredients.split(' ')
    ALL_ALLERGENS.update(allergens)
    ALL_INGREDIENTS.update(ingredients)
    LIST_OF_FOOD.append((ingredients, allergens))


def z1(lof):
    allergen_possible_ingredient = dict()
    for (_ingredients, _allergens) in lof:
        for allergen in _allergens:
            if allergen in allergen_possible_ingredient:
                allergen_possible_ingredient[allergen] = allergen_possible_ingredient[allergen].intersection(set(_ingredients))
            else:
                allergen_possible_ingredient[allergen] = set(_ingredients)
    mentioned_ingredients = set.union(*allergen_possible_ingredient.values())
    not_mentioned_ingredients = ALL_INGREDIENTS.difference(mentioned_ingredients)
    return count_ingredients_appearances_in_list_of_food(not_mentioned_ingredients)


def count_ingredients_appearances_in_list_of_food(_ingredients):
    counter = 0
    for _food in LIST_OF_FOOD:
        for _ingredient in _food[0]:
            if _ingredient in _ingredients:
                counter += 1
    return counter


def z2(lof):
    allergen_possible_ingredient = dict()
    for (ingredients, allergens) in lof:
        for allergen in allergens:
            if allergen in allergen_possible_ingredient:
                allergen_possible_ingredient[allergen] = allergen_possible_ingredient[allergen].intersection(set(ingredients))
            else:
                allergen_possible_ingredient[allergen] = set(ingredients)
    allergen_possible_ingredient = deduction(allergen_possible_ingredient)
    sorted_api_keys = sorted(allergen_possible_ingredient.keys())
    return ','.join(list(map(lambda k: list(allergen_possible_ingredient[k])[0], sorted_api_keys)))


def deduction(api):
    deducted = set()
    while deducted != ALL_ALLERGENS:
        for key, values in api.items():
            if key not in deducted:
                if len(values) == 1:
                    _ingredient = list(values)[0]
                    # remove this ingredient from other allergens:
                    for k, vs in api.items():
                        if k != key:
                            if _ingredient in vs:
                                vs.remove(_ingredient)
                    deducted.add(key)
                    break
    return api


print("Part One : "+ str(z1(LIST_OF_FOOD)))

print("Part Two : "+ str(z2(LIST_OF_FOOD)))