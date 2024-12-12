const data = await Deno.readTextFile('./day_12/input.txt');

const matrix = data.split('\n').map((row) => row.split(''));

const directions = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
];

function getArea(
	matrix: string[][],
	i: number,
	j: number,
	char: string,
	area: Set<string>,
): Set<string> {
	area.add(JSON.stringify([i, j]));

	for (const dir of directions) {
		const [row, col] = dir;
		const nextPos = [i + row, j + col];

		if (
			nextPos[1] < 0 || nextPos[1] >= matrix.length ||
			nextPos[0] < 0 || nextPos[0] >= matrix[0].length
		) continue;
		else if (
			matrix[nextPos[1]][nextPos[0]] === char &&
			!area.has(JSON.stringify(nextPos))
		) {
			area.add(JSON.stringify([nextPos[0], nextPos[1]]));
			const next = getArea(matrix, nextPos[0], nextPos[1], char, area);
			if (next) area.union(next);
		}
	}

	return area;
}

function getAreas(matrix: string[][]): Map<string, number[][][]> {
	const areas = new Map<string, number[][][]>();

	const visited = new Set<string>();

	for (let i = 0; i < matrix.length; i++) {
		for (let j = 0; j < matrix[i].length; j++) {
			if (!visited.has(JSON.stringify([i, j]))) {
				visited.add(JSON.stringify([i, j]));

				const area = getArea(
					matrix,
					i,
					j,
					matrix[j][i],
					new Set<string>(),
				);

				areas.set(matrix[j][i], [
					...(areas.get(matrix[j][i]) || []),
					Array.from(area).map((a) => JSON.parse(a)),
				]);

				area.forEach((pos) => visited.add(pos));
			}
		}
	}

	return areas;
}

function getBorders(
	matrix: string[][],
	area: number[][],
	char: string,
): Map<string, string[]> {
	const borders = new Map<string, string[]>();

	area.forEach((a) => {
		for (const dir of directions) {
			const [row, col] = dir;
			const nextPos = [a[0] + row, a[1] + col];

			if (
				nextPos[1] < 0 || nextPos[1] >= matrix.length ||
				nextPos[0] < 0 || nextPos[0] >= matrix[0].length ||
				matrix[nextPos[1]][nextPos[0]] !== char
			) {
				borders.set(
					`${a[0]},${a[1]}`,
					[
						...(borders.get(`${a[0]},${a[1]}`) || ''),
						`${dir[0]},${dir[1]}`,
					],
				);
			}
		}
	});

	return borders;
}

function getPerimeter(
	matrix: string[][],
	area: number[][],
	char: string,
): number {
	return getBorders(matrix, area, char).values().reduce(
		(acc, val) => acc + val.length,
		0,
	);
}

function getPerimeterWithDiscount(
	matrix: string[][],
	area: number[][],
	char: string,
): number {
	const borders = getBorders(matrix, area, char);

	const similarities: string[] = [];

	borders.forEach((value, key) => {
		const [row, col] = key.split(',').map(Number);

		borders.forEach((value2, key2) => {
			const [row2, col2] = key2.split(',').map(Number);
			const [drow, dcol] = [Math.abs(row2 - row), Math.abs(col2 - col)];

			if (
				key2 !== key &&
				((drow === 0 && dcol === 1) || (drow === 1 && dcol === 0))
			) {
				similarities.push(...value.filter(function (el) {
					return value2.indexOf(el) >= 0;
				}));
			}
		});
	});

	return borders.values().reduce(
		(acc, val) => acc + val.length,
		0,
	) - similarities.length / 2;
}

const areas = getAreas(matrix);

// Part 1
const price = Array.from(areas.entries())
	.flatMap(([char, charAreas]) =>
		charAreas.map((area) => area.length * getPerimeter(matrix, area, char))
	)
	.reduce((sum, value) => sum + value, 0);

console.log(price);

// Part 2
const priceWithDiscount = Array.from(areas.entries())
	.flatMap(([char, charAreas]) =>
		charAreas.map((area) =>
			area.length * getPerimeterWithDiscount(matrix, area, char)
		)
	)
	.reduce((sum, value) => sum + value, 0);

console.log(priceWithDiscount);
