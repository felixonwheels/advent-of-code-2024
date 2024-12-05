const data = await Deno.readTextFile('./day_05/input.txt');

const [orderingRules, updates] = data.split('\n\n').map((el, i) =>
	el.split('\n').map((el) => el.trim().split(['|', ','][i]).map(Number))
);

// Part 1
const isUpdateCorrect = (rules: number[][], update: number[]): boolean =>
	!rules.some(([a, b]) =>
		update.includes(a) && update.includes(b) &&
		update.indexOf(a) > update.indexOf(b)
	);

console.log(
	updates.reduce(
		(acc, update) =>
			acc +
			(isUpdateCorrect(orderingRules, update)
				? update[Math.floor(update.length / 2)]
				: 0),
		0,
	),
);

// Part 2
function orderUpdate(rules: number[][], update: number[]): number[] {
	while (!isUpdateCorrect(rules, update)) {
		rules.forEach(([a, b]) => {
			const indexA = update.indexOf(a);
			const indexB = update.indexOf(b);
			if (indexA > -1 && indexB > -1 && indexA > indexB) {
				[update[indexA], update[indexB]] = [
					update[indexB],
					update[indexA],
				];
			}
		});
	}
	return update;
}

console.log(
	updates.reduce(
		(acc, update) =>
			acc +
			(isUpdateCorrect(orderingRules, update) ? 0 : orderUpdate(
				orderingRules,
				update,
			)[Math.floor(update.length / 2)]),
		0,
	),
);
