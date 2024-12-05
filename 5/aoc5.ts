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
      let check = true;

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
    failed.map((update) => {
      let sorted = [update[0]];

      update.shift();

      update.forEach((pageNum) => {
        let added = false;
        let rules = getRulesForPage(pageNum);

        sorted.forEach((sortedPageNum, index) => {
          if (!added && shouldBeBefore(pageNum, sortedPageNum, rules)) {
            added = true;
            sorted.splice(index, 0, pageNum);
          }
        });

        if (!added) {
          sorted.push(pageNum);
        }
      });
      return sorted;
    }),
  );
}

console.log(part1());
console.log(part2());