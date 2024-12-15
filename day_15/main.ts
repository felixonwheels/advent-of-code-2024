const data = await Deno.readTextFile('./day_15/input.txt');

const input = data.split('\n\n');

const map = input[0].split('\n').map((s) => s.split(''));

const moves = input[1].split('\n').map((s) => s.split('')).flat();

const dirs: Record<string, [number, number]> = {
	'<': [-1, 0],
	'v': [0, 1],
	'>': [1, 0],
	'^': [0, -1],
};

function findRobot(map: string[][]): [number, number] {
	for (let j = 0; j < map.length; j++) {
		for (let i = 0; i < map[0].length; i++) {
			if (map[j][i] === '@') {
				return [i, j];
			}
		}
	}

	return [0, 0];
}

function getNextBoxes(
	map: string[][],
	i: number,
	j: number,
	di: number,
	dj: number,
	acc: [[number, number], [number, number]][],
): number[][][] | null {
	const boxPos: [[number, number], [number, number]] = map[j][i] === '['
		? [[i, j], [i + 1, j]]
		: [[i - 1, j], [i, j]];

	const [y, x1] = [boxPos[0][1] + dj, boxPos[0][0]];
	const x2 = x1 + 1;

	const cell1 = map[y][x1];
	const cell2 = map[y][x2];

	if (cell1 === '#' || cell2 === '#') return null;

	if (cell1 === '.' && cell2 === '.') {
		return [boxPos, ...acc];
	}

	const recurse = (nextI: number): number[][][] | null =>
		getNextBoxes(map, nextI, y, di, dj, []);

	if (cell1 === '[' && cell2 === ']') {
		return recurse(i) ? [...recurse(i)!, boxPos] : null;
	}
	if (cell1 === ']' && cell2 === '.') {
		return recurse(i - 1) ? [...recurse(i - 1)!, boxPos] : null;
	}
	if (cell1 === '.' && cell2 === '[') {
		return recurse(i + 1) ? [...recurse(i + 1)!, boxPos] : null;
	}

	const nextBox1 = recurse(i - 1);
	const nextBox2 = recurse(i + 1);

	return nextBox1 && nextBox2 ? [...nextBox1, ...nextBox2, boxPos] : null;
}

function applyMoves(
	map: string[][],
	moves: string[],
	elementsWidth: number = 1,
): string[][] {
	let pos = findRobot(map);

	map[pos[1]][pos[0]] = '.';

	moves.forEach((move) => {
		const [di, dj] = dirs[move];
		const [i, j] = pos;
		const [newI, newJ] = [i + di, j + dj];

		if (elementsWidth === 1) {
			if (map[newJ][newI] === '.') {
				pos = [newI, newJ];
			} else if (map[newJ][newI] === 'O') {
				let [nextI, nextJ] = [newI + di, newJ + dj];

				while (map[nextJ][nextI] === 'O') {
					nextI += di, nextJ += dj;
				}

				if (map[nextJ][nextI] === '.') {
					map[nextJ][nextI] = 'O';
					map[newJ][newI] = '.';
					pos = [newI, newJ];
				}
			}
		} else {
			if (map[newJ][newI] === '.') {
				pos = [newI, newJ];
			} else if (['[', ']'].includes(map[newJ][newI])) {
				if (dj === 0) {
					let nextI = newI + di;

					while (['[', ']'].includes(map[j][nextI])) nextI += di;

					if (map[j][nextI] === '.') {
						while (nextI !== newI) {
							[map[j][nextI], map[j][nextI - di]] = [
								map[j][nextI - di],
								map[j][nextI],
							];
							nextI -= di;
						}
						pos = [newI, newJ];
					}
				} else {
					let boxes = getNextBoxes(map, newI, newJ, di, dj, []);

					if (boxes) {
						const uniqueBoxes = new Set<string>();

						boxes = boxes.filter((box) =>
							uniqueBoxes.has(JSON.stringify(box))
								? false
								: uniqueBoxes.add(JSON.stringify(box))
						);

						for (const box of boxes) {
							map[box[0][1] + dj][box[0][0] + di] = '[';
							map[box[1][1] + dj][box[1][0] + di] = ']';
							map[box[0][1]][box[0][0]] = '.';
							map[box[1][1]][box[1][0]] = '.';
						}
						pos = [newI, newJ];
					}
				}
			}
		}
	});

	return map;
}

function coordinatesSum(map: string[][], elementsWidth: number = 1): number {
	return elementsWidth === 1
		? map.reduce(
			(colsAcc, col, colIndnextI) =>
				colsAcc +
				col.reduce((rowsAcc, row, rowIndnextI) =>
					row === 'O'
						? rowsAcc += 100 * colIndnextI +
							rowIndnextI
						: rowsAcc, 0),
			0,
		)
		: map.reduce(
			(colsAcc, col, colIndnextI) =>
				colsAcc +
				col.reduce(
					(rowsAcc, row, rowIndnextI) =>
						row === '['
							? rowsAcc += 100 * colIndnextI + rowIndnextI
							: rowsAcc,
					0,
				),
			0,
		);
}

// Part 1
let newMap = [...map.map((e) => [...e])];

console.log(coordinatesSum(applyMoves(newMap, moves)));

// Part 2
newMap = map.map((col) =>
	col.flatMap((row) => {
		switch (row) {
			case '#':
			case '.':
				return [row, row];
			case 'O':
				return ['[', ']'];
			default:
				return ['@', '.'];
		}
	})
);

console.log(coordinatesSum(applyMoves(newMap, moves, 2), 2));
