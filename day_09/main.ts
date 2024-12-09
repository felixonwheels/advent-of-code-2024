const data = await Deno.readTextFile('./day_09/input.txt');

const blocks = data.split('').map((digit, i) =>
	i % 2 === 0
		? Array(Number(digit)).fill(i / 2)
		: Array(Number(digit)).fill('.')
).filter((item) => item.length).flat();

// Part 1
const blocksPart1 = [...blocks];

let index = blocksPart1.length - 1;

while (index >= blocksPart1.indexOf('.')) {
	if (!isNaN(Number(blocksPart1[index]))) {
		const firstDotIndex = blocksPart1.indexOf('.');

		blocksPart1[firstDotIndex] = blocksPart1[index],
			blocksPart1[index] = '.';
	}

	index -= 1;
}

console.log(
	blocksPart1.reduce(
		(acc, val, i) => {
			return !isNaN(Number(val)) ? acc += i * Number(val) : acc;
		},
		0,
	),
);

// Part 2
const blocksPart2 = [...blocks];

index = blocksPart2.length - 1;

while (index >= blocksPart2.indexOf('.')) {
	if (!isNaN(Number(blocksPart2[index]))) {
		const firstIndex = blocksPart2.indexOf(blocksPart2[index]);
		const rangeLength = index - firstIndex + 1;

		for (let j = 0; j <= firstIndex; j++) {
			const slice = blocksPart2.slice(j, j + rangeLength);

			if (slice.every((item) => item === '.')) {
				const filled = Array(rangeLength).fill(blocksPart2[index]);
				const dots = Array(rangeLength).fill('.');

				blocksPart2.splice(j, rangeLength, ...filled);
				blocksPart2.splice(firstIndex, rangeLength, ...dots);

				break;
			}
		}

		index -= rangeLength;
		continue;
	}

	index -= 1;
}

console.log(
	blocksPart2.reduce(
		(acc, val, i) => {
			return !isNaN(Number(val)) ? acc += i * Number(val) : acc;
		},
		0,
	),
);
