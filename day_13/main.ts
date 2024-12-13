const data = await Deno.readTextFile('./day_13/input.txt');

type System = {
	a: number;
	b: number;
	c: number;
	d: number;
	x: number;
	y: number;
};

function solveSystem(sys: System): { x: number; y: number } | null {
	const determinant = sys.a * sys.d - sys.b * sys.c;

	if (!determinant) return null;

	const x = (sys.x * sys.d - sys.y * sys.c) / determinant,
		y = (sys.a * sys.y - sys.b * sys.x) / determinant;

	return [x, y].every(Number.isInteger) ? { x, y } : null;
}

const systems = data.split('\n')
	.filter(Boolean)
	.reduce<System[]>((results, _, i, lines) => {
		if (i % 3 === 0) {
			const [buttonA, buttonB, prize] = lines.slice(i, i + 3);
			const match = (pattern: RegExp, str: string) =>
				(pattern.exec(str)?.slice(1).map(Number)) || [];
			const [a, b, c, d, x, y] = [
				...match(/Button A: X\+(\d+), Y\+(\d+)/, buttonA),
				...match(/Button B: X\+(\d+), Y\+(\d+)/, buttonB),
				...match(/Prize: X=(\d+), Y=(\d+)/, prize),
			];

			results.push({ a, b, c, d, x, y });
		}
		return results;
	}, []);

// Part 1
console.log(systems.reduce((acc, system) => {
	const solution = solveSystem(system);

	return solution ? acc + (3 * solution.x + solution.y) : acc + 0;
}, 0));

// Part 2
systems.map((system) => {
	system.x += 10000000000000;
	system.y += 10000000000000;
});

console.log(systems.reduce((acc, system) => {
	const solution = solveSystem(system);

	return solution ? acc + (3 * solution.x + solution.y) : acc + 0;
}, 0));
