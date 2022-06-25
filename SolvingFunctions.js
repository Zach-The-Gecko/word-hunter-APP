const inputData = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
];

const directions = ["↖️", "⬆️", "↗️", "⬅️", "➡️", "↙️", "⬇️", "↘️"];

const unfinishedGameBoard = inputData.map((letter, position) => {
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

const getNearbyTiles = (tile) => {
  return tile.nearbyLettersIndex.map((index) => {
    return gameBoard[index];
  });
};

const doesThisWordWork = (word, startingTile) => {
  const startingAcc = startingTile.letter === word[0] ? [startingTile] : [];

  const letterTree = Array.from(word).reduce(
    (acc, _letter, index, word) => {
      if (acc[index]) {
        acc[index].map((parentTile) => {
          acc[index + 1] = getNearbyTiles(parentTile).reduce(
            (validNearbyTiles, tile, direction) => {
              if (tile) {
                const parentTilePositions = tile.parents.map(
                  (oneOfTheParents) => {
                    return oneOfTheParents.position;
                  }
                );
                if (
                  tile.letter === word[index + 1] &&
                  !parentTilePositions.includes(tile.position)
                ) {
                  parentTile.direction = directions[direction];
                  tile.parents = [...parentTile.parents, parentTile];
                  validNearbyTiles.push(tile);
                }
              }
              return validNearbyTiles;
            },
            []
          );
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
    finalTile.direction = "🛑";

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
    gameBoard.map((tile) => {
      (tile.parents = []), (tile.direction = "");
    });
    return finalAnswer;
  } else {
    return false;
  }
};
console.log(doesThisWordWork("knife", gameBoard[10]));
