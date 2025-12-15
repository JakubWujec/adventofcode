# 129411462 is too low
# 1_396_463_530 too low?
# 4633889290 to high?
from collections import defaultdict
from dataclasses import dataclass
from typing import List


def get_input_data(filename="input.txt"):
    with open((__file__.rstrip("code.py") + filename), "r") as input_file:
        input = input_file.read()
        return input


def process_data(input_data):
    lines = input_data.split("\n")
    return [[int(x) for x in line.split(",")] for line in lines]


def area(p1, p2):
    return (abs(p2[0] - p1[0]) + 1) * (abs(p2[1] - p1[1]) + 1)


def task1(input_data: str):
    data = process_data(input_data)
    n = len(data)

    max_area = 0
    for i in range(n):
        for j in range(0, i):
            rect_area = area(data[i], data[j])
            max_area = max(max_area, rect_area)

    # print(data)
    return max_area


@dataclass(frozen=True)
class Point:
    x: int
    y: int

    def points_between(self, other: "Point"):
        assert self.on_the_same_line(other)

        if self.x == other.x:
            minY = min(self.y, other.y)
            maxY = max(self.y, other.y)
            for y in range(minY, maxY + 1):
                yield Point(self.x, y)
        else:
            minX = min(self.x, other.x)
            maxX = max(self.x, other.x)
            for x in range(minX, maxX + 1):
                yield Point(x, self.y)

    def added(self, to_add: "Point"):
        return Point(self.x + to_add.x, self.y + to_add.y)

    def on_the_same_line(self, other: "Point"):
        return self.x == other.x or self.y == other.y

    @classmethod
    def get_direction(cls, start: "Point", stop: "Point"):
        assert start != stop
        assert start.on_the_same_line(stop)

        if start.x < stop.x:
            return cls.RIGHT()
        if start.x > stop.x:
            return cls.LEFT()
        if start.y < stop.y:
            return cls.UP()
        else:
            return cls.DOWN()

    @classmethod
    def RIGHT(cls):
        return cls(1, 0)

    @classmethod
    def LEFT(cls):
        return cls(-1, 0)

    @classmethod
    def UP(cls):
        return cls(0, 1)

    @classmethod
    def DOWN(cls):
        return cls(0, -1)

    def rectangle_area(self, other: "Point"):
        side1 = abs(other.x - self.x) + 1
        side2 = abs(other.y - self.y) + 1
        return side1 * side2


def task2(input_data: str):
    data = process_data(input_data)
    points = [Point(x, y) for [x, y] in data]
    n = len(points)

    outside_points_by_row = get_outside_points_by_row(points)

    max_area = 0
    for i in range(n):
        print(f"{i}/{n}  {max_area}")
        for j in range(0, i):
            rect_area = points[i].rectangle_area(points[j])

            if rect_area > max_area:
                if is_valid_rectangle(points[i], points[j], outside_points_by_row):
                    max_area = max(max_area, rect_area)

    return max_area


def get_outside_points_by_row(points):
    rightmost_idx = find_top_righmost_point_idx(points)
    DIRECTIONS = [Point.UP(), Point.RIGHT(), Point.DOWN(), Point.LEFT()]

    n = len(points)
    outside_points_by_row = defaultdict(set)
    border_by_row = defaultdict(set)
    anticlockwise = (
        1
        if (
            Point.get_direction(
                points[(rightmost_idx) % n], points[(rightmost_idx + 1) % n]
            )
            == Point.DOWN()
        )
        else -1
    )

    for i in range(0, n + 2):
        current_point = points[(rightmost_idx + i) % n]
        next_point = points[(rightmost_idx + i + 1) % n]
        move_direction = Point.get_direction(current_point, next_point)
        mark_direction = DIRECTIONS[
            (DIRECTIONS.index(move_direction) - int(anticlockwise)) % 4
        ]

        for point in Point.points_between(current_point, next_point):
            to_mark = point.added(mark_direction)
            outside_points_by_row[to_mark.x].add(to_mark.y)
            border_by_row[point.x].add(point.y)

    for row in outside_points_by_row:
        outside_points_by_row[row] -= border_by_row[row]
    return outside_points_by_row


def is_valid_rectangle(p1: Point, p2: Point, outside_points_by_row: dict):
    minCol = min(p1.y, p2.y)
    maxCol = max(p1.y, p2.y)

    minRow = min(p1.x, p2.x)
    maxRow = max(p1.x, p2.x)
    # print(f"IS_VALID {p1} {p2}")

    for row in range(minRow, maxRow + 1):
        for col in outside_points_by_row[row]:
            if col in range(minCol, maxCol + 1):
                return False

    return True


def get_rectangle_border_points(p1: Point, p2: Point):
    minCol = min(p1.y, p2.y)
    maxCol = max(p1.y, p2.y)

    minRow = min(p1.x, p2.x)
    maxRow = max(p1.x, p2.x)

    for row in range(minRow, maxRow + 1):
        yield Point(row, minCol)
        yield Point(row, maxCol)

    for col in range(minCol, maxCol + 1):
        yield Point(minRow, col)
        yield Point(maxRow, col)


def find_top_righmost_point_idx(points: List[Point]):
    selected_idx = 0
    selected_point = points[selected_idx]

    for idx, point in enumerate(points):
        if point.x > selected_point.x or (point.y > selected_point.y):
            selected_idx = idx
            selected_point = point
    return selected_idx


if __name__ == "__main__":
    input_data = get_input_data()

    answer1 = task1(input_data)
    print(f"Answer1: {answer1}")

    answer2 = task2(input_data)
    print(f"Answer2: {answer2}")
