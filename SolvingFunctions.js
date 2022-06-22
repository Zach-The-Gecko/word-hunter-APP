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

const unfinishedGameBoard = inputData.map((letter, position) => {
  const row = Math.floor(position / 4);
  const column = position - row * 4;
  return {
    letter,
    interactable: false,
    previousTile: null,
    row,
    column,
    position,
  };
});

const gameBoard = unfinishedGameBoard.map((tile) => {
  const isLeft = Boolean(tile.column) ? 1 : 0;
  const isRight = tile.column === 3 ? 0 : 1;
  // console.log(isLeft, isRight);
  console.log(
    // Top Left
    unfinishedGameBoard[tile.position - 5] * isLeft,
    // Top
    unfinishedGameBoard[tile.position - 4],
    // Top Right
    unfinishedGameBoard[tile.position - 3] * isRight,
    // Left
    unfinishedGameBoard[tile.position - 1] * isLeft,
    // Right
    unfinishedGameBoard[tile.position + 1] * isRight,
    // Bottom Left
    unfinishedGameBoard[tile.position + 3] * isLeft,
    // Bottom
    unfinishedGameBoard[tile.position + 4],
    // Bottom Right
    unfinishedGameBoard[tile.position + 5] * isRight
  );
  return {
    ...tile,
  };
});
