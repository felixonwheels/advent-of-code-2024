const data = await Deno.readTextFile('./day_08/input.txt');

const matrix = data.split('\n').map((row) => row.split(''));

// Part 1
const antinodes = new Set<string>();

matrix.forEach((row, j) =>
	row.forEach((cell, i) => {
		if (cell === '.') return;

		matrix.forEach((otherRow, l) =>
			otherRow.forEach((otherCell, k) => {
				if (cell === otherCell && (k !== i || l !== j)) {
					const dx = k - i, dy = l - j;

					[[i - dx, j - dy], [k + dx, l + dy]]
						.filter(
							([x, y]) =>
								x >= 0 &&
								x < matrix[0].length &&
								y >= 0 &&
								y < matrix.length,
						)
						.forEach((antinode) =>
							antinodes.add(JSON.stringify(antinode))
						);
				}
			})
		);
	})
);

console.log(antinodes.size);

// Part 2
const antinodesNewMethod = new Set<string>();

matrix.forEach((row, j) =>
	row.forEach((cell, i) => {
		if (cell === '.') return;

		matrix.forEach((otherRow, l) =>
			otherRow.forEach((otherCell, k) => {
				if (cell === otherCell && (k !== i || l !== j)) {
					antinodesNewMethod.add(JSON.stringify([k, l]));

					const dx = k - i;
					const dy = l - j;
					let lineIterator = 1;

					const isValidAntinode = ([x, y]: number[]): boolean =>
						x >= 0 &&
						x < matrix[0].length &&
						y >= 0 &&
						y < matrix.length;

					while (true) {
						const possibleAntinodes = [
							[i - lineIterator * dx, j - lineIterator * dy],
							[k + lineIterator * dx, l + lineIterator * dy],
						];

						const validAntinodes = possibleAntinodes.filter(
							isValidAntinode,
						);

						if (validAntinodes.length === 0) break;

						validAntinodes.forEach((antinode) =>
							antinodesNewMethod.add(JSON.stringify(antinode))
						);

						lineIterator++;
					}
				}
			})
		);
	})
);

console.log(antinodesNewMethod.size);
