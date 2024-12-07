const data = await Deno.readTextFile('./day_07/input.txt');

const calibrationEquations = data.split('\n').reduce((map, line) => {
    const [key, values] = line.split(':');

    map.set(parseInt(key.trim(), 10), values.trim().split(' ').map(Number));

    return map;
}, new Map<number, number[]>());

const generateCombinations = (
    arr: number[],
    operations: string[],
): string[][] =>
    arr.slice(1).reduce(
        (combinations) =>
            combinations.flatMap((combination) =>
                operations.map((op) => [...combination, op])
            ),
        [[]] as string[][],
    );

const calculate = (
    equations: Map<number, number[]>,
    operations: string[],
): number =>
    Array.from(equations.entries()).reduce((acc, [k, v]) => {
        const combinations = generateCombinations(v, operations);

        for (const combination of combinations) {
            const result = v.reduce((res, num, i) =>
                i === 0
                    ? num
                    : combination[i - 1] === '+'
                    ? res + num
                    : combination[i - 1] === '*'
                    ? res * num
                    : Number(`${res}${num}`)
            );

            if (result === k) {
                return acc + k;
            }
        }

        return acc;
    }, 0);

// Part 1
console.log(calculate(calibrationEquations, ['+', '*']));

// Part 2
console.log(calculate(calibrationEquations, ['+', '*', '||']));
