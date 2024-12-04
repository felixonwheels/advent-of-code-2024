const data = await Deno.readTextFile('./day_04/input.txt');

const matrix = data.trim().split('\n').map((row) => row.split(''));

// Part 1
function searchWord(
	matrix: string[][],
	row: number,
	col: number,
	word: string,
): number {
	const dir = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	const m = matrix.length, n = matrix[0].length;

	if (matrix[row][col] !== word[0]) return 0;

	return dir.reduce((count, [dx, dy]) => {
		let x = row + dx, y = col + dy, k = 1;

		while (
			k < word.length && x >= 0 && x < m && y >= 0 && y < n &&
			matrix[x][y] === word[k]
		) {
			x += dx, y += dy, k++;
		}

		return count + (k === word.length ? 1 : 0);
	}, 0);
}

console.log(matrix.reduce(
	(acc, row, i, array) =>
		acc +
		row.reduce(
			(rowAcc, _, j) => rowAcc + searchWord(array, i, j, 'XMAS'),
			0,
		),
	0,
));

// Part 2
function searchXMASes(
	matrix: string[][],
	row: number,
	col: number,
): boolean {
	if (
		row < 1 || row >= matrix[0].length - 1 ||
		col < 1 || col >= matrix.length - 1 ||
		matrix[row][col] !== 'A'
	) {
		return false;
	}

	const diagonals = [
		matrix[row - 1][col - 1],
		matrix[row - 1][col + 1],
		matrix[row + 1][col - 1],
		matrix[row + 1][col + 1],
	].join('');

	return ['MSMS', 'MMSS', 'SSMM', 'SMSM'].includes(diagonals);
}

console.log(matrix.reduce(
	(acc, row, i, array) =>
		acc +
		row.reduce(
			(rowAcc, _, j) => rowAcc + +searchXMASes(array, i, j),
			0,
		),
	0,
));
