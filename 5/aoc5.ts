import { readFileSync } from "fs";

const fileContents: string[] = readFileSync("5/input.txt", "ascii")
  .toString()
  .trim()
  .split("\n\n");

const rules: number[][] = fileContents[0]
  .split("\n")
  .map((rule) => rule.split("|").map((pageNum) => parseInt(pageNum)));

const updates: number[][] = fileContents[1]
  .split("\n")
  .map((update) => update.split(",").map((pageNum) => parseInt(pageNum)));

let failed: number[][] = [];

function getRulesForPage(pageNum: number): number[][] {
  return rules.filter((rule) => rule[0] === pageNum || rule[1] === pageNum);
}

function validate(update: number[], rules: number[][]): boolean {
  for (let rule of rules) {
    let indexA = update.indexOf(rule[0]);
    let indexB = update.indexOf(rule[1]);

    if (indexA === -1 || indexB === -1) {
      continue;
    }

    if (indexA > indexB) {
      return false;
    }
  }

  return true;
}

function sumMiddleValues(arr: number[][]) {
  return arr
    .map((entry) => {
      return entry[Math.floor(entry.length / 2)];
    })
    .reduce((sum, cur) => (sum += cur));
}

function part1(): number {
  return sumMiddleValues(
    updates.filter((update) => {
      for (let page of update) {
        if (!validate(update, getRulesForPage(page))) {
          failed.push(update);
          return false;
        }
      }
      return true;
    }),
  );
}

function shouldBeBefore(a: number, b: number, rules: number[][]): boolean {
  return !!rules.find((rule) => rule[0] === a && rule[1] === b);
}

function part2(): number {
  return sumMiddleValues(
    failed.map((update) =>
      update.sort((a, b) =>
        shouldBeBefore(a, b, getRulesForPage(b)) ? -1 : 1,
      ),
    ),
  );
}

console.log("Part 1: " + part1());
console.log("Part 2: " + part2());
