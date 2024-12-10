const data = await Deno.readTextFile('./day_10/input.txt');

const matrix = data.split('\n').map((row) => row.split('').map(Number));

const directions = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
];

// Part 1
function unrollTrail(
	matrix: number[][],
	x: number,
	y: number,
	num: number,
	localCount: Set<string>,
) {
	directions.forEach(([dx, dy]) => {
		const newX = x + dx, newY = y + dy;

		if (
			newY >= 0 && newY < matrix.length &&
			newX >= 0 && newX < matrix[newY].length &&
			matrix[newY][newX] === num + 1
		) {
			if (matrix[newY][newX] === 9) {
				localCount.add(`${newY},${newX}`);
			} else {
				unrollTrail(matrix, newX, newY, num + 1, localCount);
			}
		}
	});
	return localCount.size;
}

const count = matrix.flatMap((row, y) =>
	row.map((cell, x) =>
		!cell ? unrollTrail(matrix, x, y, 0, new Set<string>()) : 0
	)
).reduce((acc, val) => acc + val, 0);

console.log(count);

// Part 2
function unrollTrailRating(
	matrix: number[][],
	x: number,
	y: number,
	num: number,
) {
	directions.forEach(([dx, dy]) => {
		const newX = x + dx, newY = y + dy;

		if (
			newY >= 0 && newY < matrix.length &&
			newX >= 0 && newX < matrix[newY].length &&
			matrix[newY][newX] === num + 1
		) {
			if (matrix[newY][newX] === 9) {
				trailheadsCount += 1;
			} else {
				unrollTrailRating(matrix, newX, newY, num + 1);
			}
		}
	});
}

let trailheadsCount = 0;

matrix.forEach((row, y) => {
	row.forEach((cell, x) => {
		if (!cell) {
			unrollTrailRating(matrix, x, y, 0);
		}
	});
});

console.log(trailheadsCount);
