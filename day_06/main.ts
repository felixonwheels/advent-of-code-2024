const data = await Deno.readTextFile('./day_06/input.txt');

const matrix = data.trim().split('\n').map((row) => row.split(''));

const guardRow = matrix.findIndex((row) => row.includes('^'));
const guardCol = matrix[guardRow].indexOf('^');

const dirs = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
];

// Part 1
let dirIndex = 0;
let pos = [guardRow, guardCol];
const visited = new Set([JSON.stringify(pos)]);

while (true) {
	const [row, col] = pos;
	const [dRow, dCol] = dirs[dirIndex];
	const nextPos = [row + dRow, col + dCol];

	if (
		nextPos[0] < 0 || nextPos[0] >= matrix.length ||
		nextPos[1] < 0 || nextPos[1] >= matrix[0].length
	) break;

	if (matrix[nextPos[0]][nextPos[1]] === '#') {
		dirIndex = (dirIndex + 1) % dirs.length;
		continue;
	}

	pos = nextPos;

	visited.add(JSON.stringify(pos));
}

console.log(visited.size);

// Part 2
let obstructionCount = 0;

for (let i = 0; i < matrix.length; i++) {
	for (let j = 0; j < matrix[i].length; j++) {
		if (!['#', '^'].includes(matrix[i][j])) {
			let dirIndex = 0;
			let pos = [guardRow, guardCol];
			const visited = new Set([
				JSON.stringify([...pos, ...dirs[dirIndex]]),
			]);
			const modifiedMatrix = matrix.map((row) => [...row]);
			modifiedMatrix[i][j] = '#';

			while (true) {
				const [row, col] = pos;
				const [dRow, dCol] = dirs[dirIndex];
				const nextPos = [row + dRow, col + dCol];

				if (
					nextPos[0] < 0 || nextPos[0] >= modifiedMatrix.length ||
					nextPos[1] < 0 || nextPos[1] >= modifiedMatrix[0].length
				) break;

				if (modifiedMatrix[nextPos[0]][nextPos[1]] === '#') {
					dirIndex = (dirIndex + 1) % dirs.length;
					continue;
				}

				pos = nextPos;

				if (visited.has(JSON.stringify([...pos, ...dirs[dirIndex]]))) {
					obstructionCount += 1;
					break;
				}

				visited.add(JSON.stringify([...pos, ...dirs[dirIndex]]));
			}
		}
	}
}

console.log(obstructionCount);
