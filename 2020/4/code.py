# Advent of code Year 2020 Day 4 solution
# Author = ?
# Date = December 2020
import re


def split(delimiters, string, maxsplit=0):
    regexPattern = '|'.join(map(re.escape, delimiters))
    return re.split(regexPattern, string, maxsplit)


class Passport:
    def __init__(self, passport_string):
        self._init_passport_from_passport_string(passport_string)

    def _init_passport_from_passport_string(self, passport_string):
        passport_string_fields = split(['\n', ' '], passport_string)
        for psf in passport_string_fields:
            key, value = split([':'], psf)
            self.__setattr__(key, value)


class PassportValidator:
    def __init__(self):
        self.mandatory_fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']
        self.hcl_pattern = re.compile('^#[a-f0-9]{6}$')
        self.pid_pattern = re.compile('^[0-9]{9}$')
        self.ecl_list = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']

    def has_required_fields(self, p: Passport):
        for mf in self.mandatory_fields:
            if not hasattr(p, mf):
                return False
        return True

    def validate(self, p: Passport):
        if not self.has_required_fields(p):
            return False
        if not (1920 <= int(p.byr) <= 2002):
            return False
        if not 2010 <= int(p.iyr) <= 2020:
            return False
        if not 2020 <= int(p.eyr) <= 2030:
            return False
        if p.hgt[-2:] not in ['cm', 'in']:
            return False
        if p.hgt[-2:] == 'cm':
            if not (150 <= int(p.hgt[0:-2]) <= 193):
                return False
        if p.hgt[-2:] == 'in':
            if not (59 <= int(p.hgt[0:-2]) <= 76):
                return False
        if self.hcl_pattern.match(p.hcl) is None:
            return False
        if p.ecl not in self.ecl_list:
            return False
        if self.pid_pattern.match(p.pid) is None:
            return False
        return True


passportValidator = PassportValidator()


with open((__file__.rstrip("code.py") + "input.txt"), 'r') as input_file:
    input = input_file.read()

passport_strings: [str] = split(["\n\n"], input)
passports: [Passport] = [Passport(ps) for ps in passport_strings]


def z1():
    return sum(list(map(lambda p: int(passportValidator.has_required_fields(p)), passports)))


def z2():
    return sum(list(map(lambda p: int(passportValidator.validate(p)), passports)))


print("Part One : " + str(z1()))
print("Part Two : " + str(z2()))
