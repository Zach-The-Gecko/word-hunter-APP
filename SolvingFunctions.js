const inputData = [
  "a",
  "b",
  "k",
  "p",
  "b",
  "b",
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

const unfinishedGameBoard = inputData.map((letter, position) => {
  return {
    letter,
    interactable: true,
    previousTile: null,
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
    nearbyLettersIndex: nearbyLettersIndex.filter((letter) => {
      return !isNaN(letter);
    }),
  };
});

const getNearbyTiles = (tile) => {
  return tile.nearbyLettersIndex
    .map((index) => {
      return gameBoard[index];
    })
    .filter((tile) => {
      return tile;
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
              if (tile.letter === word[index + 1] && tile.interactable) {
                validNearbyTiles.push(tile);
                tile.interactable = false;
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
    console.log("worked");
    console.log(letterTree[word.length - 1][0]);
  }
};

doesThisWordWork("abkp", gameBoard[0]);
