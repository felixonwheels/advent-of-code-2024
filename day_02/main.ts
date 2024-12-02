const data = await Deno.readTextFile('./day_02/input.txt');

const reports = data.trim().split('\n').map((row) =>
	row.trim().split(/\s+/).map(Number)
);

function isReportSafe(level: number[]): boolean {
	let sign = 0;

	for (let i = 1; i < level.length; i++) {
		const difference = level[i] - level[i - 1];

		if (Math.abs(difference) < 1 || Math.abs(difference) > 3) {
			return false;
		}

		if (i > 1 && difference * sign < 0) {
			return false;
		}

		sign = difference;
	}

	return true;
}

// Part 1
console.log(
	reports.reduce((acc, val) => acc + +isReportSafe(val), 0),
);

// Part 2
console.log(
	reports.reduce(function (acc, val) {
		for (let i = 0; i < val.length; i++) {
			const modifiedVal = [...val.slice(0, i), ...val.slice(i + 1)];

			if (isReportSafe(modifiedVal)) return acc + 1;
		}

		return acc;
	}, 0),
);
