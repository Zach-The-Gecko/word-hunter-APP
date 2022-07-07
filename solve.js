import getAnswers from "./getAnswers.js";
import * as fs from "fs";
import { argv } from "process";

const answers = getAnswers(argv[2], argv[3]).reduce(
  (acc, answer, index, totalArray) => {
    if (index === 0 || answer[0].length !== totalArray[index - 1][0].length) {
      acc = acc + `-----  ${answer[0].length}  -----\n`;
    }
    acc = acc + answer[0] + "\n" + answer[1] + "\n";
    return acc;
  },
  ""
);

fs.writeFileSync("./answers.txt", answers);
