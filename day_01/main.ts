const data = await Deno.readTextFile('./day_01/input.txt');

const rows = data.trim().split('\n').map((row) =>
	row.trim().split(/\s+/).map(Number)
);

const [firstColumn, secondColumn] = [
	rows.map((row) => row[0]).sort(),
	rows.map((row) => row[1]).sort(),
];

// Part 1
console.log(firstColumn.reduce(
	(acc, val, i) => acc + Math.abs(val - secondColumn[i]),
	0,
));

// Part 2
console.log(firstColumn.reduce(
	(acc, val) => acc + val * secondColumn.filter((x) => x === val).length,
	0,
));
