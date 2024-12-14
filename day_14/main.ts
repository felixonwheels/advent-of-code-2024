import { PNGImage } from '@ilawy/dpng';

const data = await Deno.readTextFile('./day_14/input.txt');

type Robot = {
	position: [number, number];
	velocity: [number, number];
};

function getRobots(data: string): Robot[] {
	return data.split('\n').map((line) => {
		const [x, y, vx, vy] = (line.match(/-?\d+/g) || []).map(Number);
		if (
			[x, y, vx, vy].some((value) => value === undefined)
		) {
			throw new Error('Invalid input');
		}
		return { position: [x, y], velocity: [vx, vy] };
	});
}

async function tick(
	robots: Robot[],
	n: number,
	m: number,
	seconds: number,
	writeToFile: boolean = false,
) {
	for (const robot of robots) {
		robot.position = [
			(robot.position[0] + robot.velocity[0] + n) % n,
			(robot.position[1] + robot.velocity[1] + m) % m,
		];
	}

	if (writeToFile) {
		const matrix: number[][] = Array.from(
			{ length: m },
			() => Array(n).fill(0),
		);

		robots.forEach((robot) =>
			matrix[robot.position[1]][robot.position[0]] += 1
		);

		const png = new PNGImage(n, m);

		const red = png.createRGBColor({ r: 255, g: 0, b: 0, a: 1 });

		for (let j = 0; j < m; j++) {
			for (let i = 0; i < n; i++) {
				if (matrix[j][i] !== 0) {
					png.setPixel(i, j, red);
				}
			}
		}

		await Deno.writeFile(`./day_14/images/${seconds}.png`, png.getBuffer());
	}
}

function getQuadrants(
	robots: Robot[],
	quadrants: Map<string, number>,
): Map<string, number> {
	robots.forEach(({ position }) => {
		const [x, y] = position;
		if (x === crossPosition[0] || y === crossPosition[1]) return;

		const quadrantKey = `${x > crossPosition[0]}:${y > crossPosition[1]}`;
		quadrants.set(quadrantKey, (quadrants.get(quadrantKey) || 0) + 1);
	});

	return quadrants;
}

// Part 1
const n = 101, m = 103, crossPosition = [Math.floor(n / 2), Math.floor(m / 2)];

let robots = getRobots(data);

for (let seconds = 1; seconds <= 100; seconds++) {
	await tick(robots, n, m, seconds);
}

const quadrants = getQuadrants(robots, new Map<string, number>());

console.log(
	quadrants.values().reduce(
		(acc, val) => acc * val,
		1,
	),
);

// Part 2
robots = getRobots(data);

for (let seconds = 1; seconds <= 10000; seconds++) {
	await tick(robots, n, m, seconds, true);
}
