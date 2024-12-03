const data = await Deno.readTextFile('./day_03/input.txt');

// Part 1
const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;

const sum = [...data.matchAll(regex)]
	.reduce(
		(acc, match) => acc + parseInt(match[1], 10) * parseInt(match[2], 10),
		0,
	);

console.log(sum);

// Part 2
const regexCorruptedMemory = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g;

let sumCorruptedMemory = 0;
let enabled = true;

[...data.matchAll(regexCorruptedMemory)].forEach((match) => {
	if (match[1] && match[2]) {
		if (enabled) {
			sumCorruptedMemory += parseInt(match[1], 10) *
				parseInt(match[2], 10);
		}
	} else if (match[0] === 'do()') {
		enabled = true;
	} else if (match[0] === "don't()") {
		enabled = false;
	}
});

console.log(sumCorruptedMemory);
