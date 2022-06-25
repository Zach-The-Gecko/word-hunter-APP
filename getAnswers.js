import { readFileSync } from "fs";

const directions = ["↖️", "⬆️", "↗️", "⬅️", "➡️", "↙️", "⬇️", "↘️"];

const doesThisWordWork = (word, startingTile, gameBoardd) => {
  const startingAcc = startingTile.letter === word[0] ? [startingTile] : [];

  const letterTree = Array.from(word).reduce(
    (acc, _letter, index, word) => {
      if (acc[index]) {
        acc[index].map((parentTile) => {
          acc[index + 1] = parentTile.nearbyLettersIndex
            .map((index) => {
              return gameBoardd[index];
            })
            .reduce((validNearbyTiles, tile, direction) => {
              if (tile) {
                tile.parents = [...parentTile.parents, parentTile];
                const parentTilePositions = tile.parents.map(
                  (oneOfTheParents) => {
                    return oneOfTheParents.position;
                  }
                );
                if (
                  tile.letter === word[index + 1] &&
                  !parentTilePositions.includes(tile.position)
                ) {
                  tile.parents[tile.parents.length - 1].direction =
                    directions[direction];
                  validNearbyTiles.push(tile);
                }
              }
              return validNearbyTiles;
            }, []);
        });
        return acc;
      }
      return acc;
    },
    [startingAcc]
  );
  letterTree.pop();
  if (letterTree.length === word.length) {
    const finalTile = letterTree[word.length - 1][0];
    finalTile.direction = "⭐";

    const emptyAnswer = [
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
      "⬛",
    ];

    [...finalTile.parents, finalTile].map((tile) => {
      emptyAnswer[tile.position] = tile.direction;
    });

    const finalAnswer = emptyAnswer.reduce(
      (stringAnswer, displayLetter, index) => {
        stringAnswer = stringAnswer + displayLetter;
        if (index % 4 == 3) {
          stringAnswer = stringAnswer + "\n";
        }
        return stringAnswer;
      },
      ""
    );
    return finalAnswer;
  } else {
    return false;
  }
};

export default (minAnswers, input) => {
  const unfinishedGameBoard = Array.from(input).map((letter, position) => {
    return {
      letter,
      parents: [],
      direction: "",
      position,
    };
  });

  const gameBoard = unfinishedGameBoard.map((tile) => {
    const row = Math.floor(tile.position / 4);
    const column = tile.position - row * 4;

    const isLeft = Boolean(column) ? 1 : "yo";
    const isRight = column === 3 ? "yo" : 1;

    const nearbyLettersIndex = [
      tile.position - 5 * isLeft,
      tile.position - 4,
      tile.position - 3 * isRight,
      tile.position - 1 * isLeft,
      tile.position + 1 * isRight,
      tile.position + 3 * isLeft,
      tile.position + 4,
      tile.position + 5 * isRight,
    ];

    return {
      ...tile,
      nearbyLettersIndex,
    };
  });

  const words = readFileSync(
    "./dictionaries/l" + minAnswers + ".txt",
    "utf8"
  ).split("\n");

  const answers = [];
  words.map((word) => {
    gameBoard.map((tile) => {
      const answer = doesThisWordWork(word.toLowerCase(), tile, gameBoard);

      gameBoard.map((tile) => {
        (tile.parents = []), (tile.direction = "");
      });
      if (answer) {
        answers.push([word, answer]);
      }
    });
  });
  const finalAnswers = [];

  answers.map((answer) => {
    if (finalAnswers[answer[0].length]) {
      finalAnswers[answer[0].length].push(answer);
    } else {
      finalAnswers[answer[0].length] = [answer];
    }
  });
  return finalAnswers
    .filter((answerList) => {
      return answerList;
    })
    .reverse();
};
