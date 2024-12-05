import { readFileSync } from "fs";

const fileContents: string = readFileSync("3/input.txt", "ascii")
  .toString()
  .trim();

let sum = [...fileContents.matchAll(/mul\(\d+,\d+\)/g)]
  .map((match) =>
    match[0]
      .slice(0, -1)
      .slice(4)
      .split(",")
      .reduce((mul, num) => mul * parseInt(num), 1),
  )
  .reduce((sum, num) => sum + num);

console.log(sum);
