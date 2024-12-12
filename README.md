# 🎄 Advent of Code 2024

**Solving Advent of Code 2024 problems with Typescript and Deno!**

## Prerequisites

- [Deno](https://docs.deno.com/runtime/)

## Setup

1. Clone this repository
2. Install dependencies:

   ```shell
   deno i
   ```

   > there are none for now but this is just in case I add some later

## Project Structure

```
.
├── day_XX/             # one folder a day
│   ├── main.ts         # solution file
│   ├── input.txt       # input file
└── deno.json           # deno config
```

## Usage

1. Put your input files as `input.txt` in the according folder [(this repo doesn't include puzzles inputs)](https://adventofcode.com/2024/about#faq_copying).
2. Run the code with:

   ```shell
   deno run -A day_XX/main.ts
   ```

   > Don't forget to change XX with the correspondong day, e.g. day_01 / day_25

## License

MIT
