const data = await Deno.readTextFile('./day_16/input.txt');

const matrix = data.trim().split('\n').map((row) => row.split(''));
// const matrix = data.trim().split('\n');

type Point = { row: number; col: number };
type Step = { point: Point; direction: Point; turns: number; path: Point[] };

const directions: Point[] = [
	{ row: -1, col: 0 },
	{ row: 1, col: 0 },
	{ row: 0, col: -1 },
	{ row: 0, col: 1 },
];

function findAllPaths(
	matrix: string[][],
	start: Point,
	end: Point,
): Point[][] {
	const rows = matrix.length;
	const cols = matrix[0].length;

	const queue: Step[] = [
		{
			point: start,
			direction: { row: 0, col: 1 },
			turns: 0,
			path: [start],
		},
	];
	const visited: Record<string, number> = {};
	const allPaths: Point[][] = [];
	const key = (p: Point, d: Point) => `${p.row},${p.col},${d.row},${d.col}`;

	while (queue.length > 0) {
		const { point, direction, turns, path } = queue.shift()!;

		if (point.row === end.row && point.col === end.col) {
			allPaths.push(path);
			continue;
		}

		for (const dir of directions) {
			const newRow = point.row + dir.row;
			const newCol = point.col + dir.col;
			const newPoint = { row: newRow, col: newCol };

			if (
				newRow >= 0 &&
				newRow < rows &&
				newCol >= 0 &&
				newCol < cols &&
				matrix[newRow][newCol] !== '#'
			) {
				const newTurns =
					dir.row !== direction.row || dir.col !== direction.col
						? turns + 1
						: turns;

				const stateKey = key(newPoint, dir);

				if (
					visited[stateKey] === undefined ||
					visited[stateKey] > newTurns
				) {
					visited[stateKey] = newTurns;
					queue.push({
						point: newPoint,
						direction: dir,
						turns: newTurns,
						path: [...path, newPoint],
					});
				}
			}
		}
	}

	return allPaths;
}

function computeScore(path: Point[]): number {
	let score = 0;

	for (let i = 1; i < path.length; i++) {
		score++;

		if (
			i === 1 && path[0].row !== path[1].row ||
			i > 1 && (
					path[i].row - path[i - 1].row !==
						path[i - 1].row - path[i - 2].row ||
					path[i].col - path[i - 1].col !==
						path[i - 1].col - path[i - 2].col
				)
		) {
			score += 1000;
		}
	}

	return score;
}

// Part 1
const start: Point = { row: matrix.length - 2, col: 1 };
const end: Point = { row: 1, col: matrix.length - 2 };

const allPaths = findAllPaths(matrix, start, end);

const scores = allPaths.map((path) => computeScore(path));

console.log(Math.min(...scores));

// Part 2

console.log(
	matrix.map((e, j) =>
		e.map((inner, i) =>
			allPaths.flat().some((e) => e.col === i && e.row === j)
				? 'X'
				: inner
		)
			.join('')
	).join('\n'),
);

const tiles = new Set<[number, number]>();

allPaths.forEach((path) => {
	for (const tile of path) {
		tiles.add([tile.col, tile.row]);
	}
});

console.log(tiles.size);
