//Global Variable
const areaCols = 25;
const areaRows = 20;
let applesEaten = 0;
let snakeLength = 4;
let applesEatenHigh = 0;
let snakeLengthHigh = 4;

// Adding Row and Column Row Reference global variables that will both serve as the starting 'head' point of the snake, as well as an updatable reference point for moving the snake around the map
let snakeRowRef = Math.floor((areaRows - 1) / 2);
let snakeColRef = Math.floor((areaCols - 1) / 2);

let snake = [];
let droppedApples = [];
let currentDirection = 'right';

let snakeWrapOn = false;

const lengthScore = document.querySelector('#snake-length');
const appleScore = document.querySelector('#apples-eaten');

const lengthHighScore = document.querySelector('#snake-length-high');
const appleHighScore = document.querySelector('#apples-eaten-high');

const startBox = document.querySelector('.pre-post');
startBox.addEventListener('click', startGame);

//creating a global variable for moving the snake so that it can be access by multiple functions
let moveSnakeInterval;
let appleInterval;

let firstGame = true;

function updateScores() {
  lengthScore.textContent = snakeLength;
  lengthHighScore.textContent = snakeLengthHigh;
  appleScore.textContent = applesEaten;
  appleHighScore.textContent = applesEatenHigh;
}
//Sets default scores at beginning of game
updateScores();

const gameArea = document.querySelector('#game-area');

//Adding a boolean that will move go false when a key is pressed and then back to true after snake moves to prevent rapid presses that could cause snake to try and eat itself
let canKeyDown = true;

function createPlayArea() {
  // Use loop to create rows
  for (let i = 0; i < areaRows; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    gameArea.appendChild(row);
    //Use second loop to add individual pixels to each row
    for (let j = 0; j < areaCols; j++) {
      const pixel = document.createElement('div');
      //To create checker pattern, even rows will start with gray and odd rows will start with blue
      if (i % 2 === 0) {
        //Even row === gray/blue/gray, etc.
        if (j % 2 === 0) {
          pixel.className = 'gray';
        } else pixel.className = 'blue';

        //Odd row === blue/gray/blue, etc.
      } else {
        if (j % 2 === 0) {
          pixel.className = 'blue';
        } else pixel.className = 'gray';
      }
      pixel.dataset.row = i;
      pixel.dataset.column = j;
      row.appendChild(pixel);
    }
  }
}

createPlayArea();

function placeSnake() {
  const snakeHeadRef = `[data-row="${snakeRowRef}"][data-column = "${snakeColRef}"]`;
  let startSpot = gameArea.querySelector(snakeHeadRef);
  startSpot.classList.add('snake');
  const snakeHeadArt = document.createElement('img');
  snakeHeadArt.src = 'images/snakehead.png';
  startSpot.appendChild(snakeHeadArt);

  //push refernce values to starting spot to snake array
  snake.push(snakeHeadRef);
  //Add 3 more snake pieces to left of snake 'head' to create starting snake
  let bodyColRef = snakeColRef - 1;
  for (let i = 0; i < snakeLength - 1; i++) {
    let snakePieceRef = `[data-row="${snakeRowRef}"][data-column = "${bodyColRef}"]`;
    let snakePiece = gameArea.querySelector(snakePieceRef);
    snakePiece.classList.add('snake');
    snake.push(snakePieceRef);
    const snakeBodyArt = document.createElement('img');
    if (i == snakeLength - 2) {
      snakeBodyArt.src = 'images/snaketail.png';
    } else {
      snakeBodyArt.src = 'images/snakebody.png';
    }
    snakePiece.appendChild(snakeBodyArt);

    bodyColRef--;
  }
}

function updateSnakeImages() {
  //Only need to update are to three pieces (the head, 2nd piece (old head), and the new tail)
  //The old tail removal will be done in the checkSpotConditions function
  const snakeHead = document.querySelector(snake[0]);

  //Update head art
  snakeHead.innerHTML = '';
  const snakeHeadArt = document.createElement('img');
  snakeHead.appendChild(snakeHeadArt);
  snakeHeadArt.src = 'images/snakehead.png';
  if (currentDirection === 'right') {
    snakeHeadArt.className = 'point-right';
  }
  if (currentDirection === 'up') {
    snakeHeadArt.className = 'point-up';
  }
  if (currentDirection === 'left') {
    snakeHeadArt.className = 'point-left';
  }
  if (currentDirection === 'down') {
    snakeHeadArt.className = 'point-down';
  }

  //Update Old Head Art (Index 1)
  const snakeIndex1 = document.querySelector(snake[1]);
  const snakeIndex2 = document.querySelector(snake[2]);
  const snakeIndex1Art = snakeIndex1.querySelector('img');
  snakeIndex1Art.innerHTML = '';
  snakeIndex1Art.className = '';

  if (
    snakeIndex1.dataset.row === snakeHead.dataset.row &&
    snakeIndex1.dataset.row === snakeIndex2.dataset.row
  ) {
    snakeIndex1Art.className = 'point-right';
    snakeIndex1Art.src = 'images/snakebody.png';
  }
  if (
    snakeIndex1.dataset.column === snakeHead.dataset.column &&
    snakeIndex1.dataset.column === snakeIndex2.dataset.column
  ) {
    snakeIndex1Art.className = 'point-up';
    snakeIndex1Art.src = 'images/snakebody.png';
  }

  if (
    (Number(snakeIndex1.dataset.row) > Number(snakeHead.dataset.row) &&
      Number(snakeIndex1.dataset.column) <
        Number(snakeIndex2.dataset.column)) ||
    (Number(snakeIndex1.dataset.column) < Number(snakeHead.dataset.column) &&
      Number(snakeIndex1.dataset.row) > Number(snakeIndex2.dataset.row))
  ) {
    snakeIndex1Art.src = 'images/snaketurn.png';
    snakeIndex1Art.className = 'point-right';
  } else if (
    (Number(snakeIndex1.dataset.row) > Number(snakeHead.dataset.row) &&
      Number(snakeIndex1.dataset.column) >
        Number(snakeIndex2.dataset.column)) ||
    (Number(snakeIndex1.dataset.column) > Number(snakeHead.dataset.column) &&
      Number(snakeIndex1.dataset.row) > Number(snakeIndex2.dataset.row))
  ) {
    snakeIndex1Art.src = 'images/snaketurn.png';
    snakeIndex1Art.className = 'point-up';
  } else if (
    (Number(snakeIndex1.dataset.row) < Number(snakeHead.dataset.row) &&
      Number(snakeIndex1.dataset.column) >
        Number(snakeIndex2.dataset.column)) ||
    (Number(snakeIndex1.dataset.column) > Number(snakeHead.dataset.column) &&
      Number(snakeIndex1.dataset.row) < Number(snakeIndex2.dataset.row))
  ) {
    snakeIndex1Art.src = 'images/snaketurn.png';
    snakeIndex1Art.className = 'point-left';
  } else if (
    (Number(snakeIndex1.dataset.row) < Number(snakeHead.dataset.row) &&
      Number(snakeIndex1.dataset.column) <
        Number(snakeIndex2.dataset.column)) ||
    (Number(snakeIndex1.dataset.column) < Number(snakeHead.dataset.column) &&
      Number(snakeIndex1.dataset.row) < Number(snakeIndex2.dataset.row))
  ) {
    snakeIndex1Art.src = 'images/snaketurn.png';
    snakeIndex1Art.className = 'point-down';
  }

  //Update Snake Tail Art
  let snakeNewTail = document.querySelector(snake[snake.length - 1]);
  let snakeOldtail = document.querySelector(snake[snake.length - 2]);
  let newTailArt = snakeNewTail.querySelector('img');
  newTailArt.innerHTML = '';
  newTailArt.className = '';

  if (snakeNewTail.dataset.row === snakeOldtail.dataset.row) {
    if (
      Number(snakeNewTail.dataset.column) < Number(snakeOldtail.dataset.column)
    ) {
      newTailArt.className = 'point-right';
    } else {
      newTailArt.className = 'point-left';
    }
  }
  if (snakeNewTail.dataset.column === snakeOldtail.dataset.column) {
    if (Number(snakeNewTail.dataset.row) > Number(snakeOldtail.dataset.row)) {
      newTailArt.className = 'point-up';
    } else {
      newTailArt.className = 'point-down';
    }
  }

  newTailArt.src = 'images/snaketail.png';
}

function startGame() {
  if (firstGame) {
    gameArea.removeChild(startBox);
    firstGame = false;
  } else {
    resetGameBoard();
  }
  placeSnake();
  setTimeout(() => {
    moveSnakeInterval = setInterval(moveSnake, intervalSpeed);
    dropApple();
  }, 1000);
  appleInterval = setInterval(dropApple, 3000);
}

function moveSnake() {
  //Will Move differently based on direction, but for eachd direction, each time we move, we will add a new 'snake head' point to the start of the array and will remove the last value of the array
  snakeDirection();
  checkSnakeWrap();
  let newHeadRef = `[data-row="${snakeRowRef}"][data-column = "${snakeColRef}"]`;

  if (checkSpotConditions(newHeadRef)) {
    let newHead = gameArea.querySelector(newHeadRef);
    newHead.classList.add('snake');
    snake.unshift(newHeadRef);
  }
  updateSnakeImages();
  canKeyDown = true;
}

function snakeDirection() {
  if (currentDirection === 'right') {
    snakeColRef++;
  } else if (currentDirection === 'up') {
    snakeRowRef--;
  } else if (currentDirection === 'left') {
    snakeColRef--;
  } else if (currentDirection === 'down') {
    snakeRowRef++;
  }
}

function dropApple() {
  let randomCol = Math.floor(Math.random() * areaCols);
  let randomRow = Math.floor(Math.random() * areaRows);
  //Check if spot is occupied by the snake already
  let randomLocId = `[data-row="${randomRow}"][data-column = "${randomCol}"]`;
  let randomLoc = gameArea.querySelector(randomLocId);
  //If the random location already contains the snake class, start the drop app over
  if (
    randomLoc.classList.contains('snake') ||
    randomLoc.classList.contains('apple')
  ) {
    return dropApple();
  } else {
    const appleSpot = gameArea.querySelector(randomLocId);
    const appleImage = document.createElement('img');
    appleImage.src = 'images/apple.png';
    appleSpot.appendChild(appleImage);
    appleSpot.classList.add('apple');
    droppedApples.push(randomLocId);
  }
}

function checkSpotConditions(newHeadRef) {
  const snakesNextHeadPosition = gameArea.querySelector(newHeadRef);
  //If snake hits wall(reference point doeesnt exist), game over
  if (!snakesNextHeadPosition) {
    let message = 'You hit a wall!';
    endGameScreen(message);
    return false;
  }
  //If snake hits snake, game over
  if (snakesNextHeadPosition.classList.contains('snake')) {
    let message = "You can't eat yourself!!";
    endGameScreen(message);
    return false;
  }
  //If does not hit an apple, we will remove the last piece of the previous snake and the snake will not grow
  if (!snakesNextHeadPosition.classList.contains('apple')) {
    let removeSnakePiece = gameArea.querySelector(snake[snake.length - 1]);
    removeSnakePiece.classList.remove('snake');
    //To remove snake art
    removeSnakePiece.innerHTML = '';
    snake.pop();

    //But if the snake does hit an apple, we will remove the apple from the board and the snake will effectively grow one square
  } else {
    snakesNextHeadPosition.classList.remove('apple');
    applesEaten++;
    snakeLength++;
    if (applesEaten > applesEatenHigh) {
      applesEatenHigh = applesEaten;
    }
    if (snakeLength > snakeLengthHigh) {
      snakeLengthHigh = snakeLength;
    }
    updateScores();
  }

  return true;
}

function endGameScreen(str) {
  clearInterval(moveSnakeInterval);
  clearInterval(appleInterval);
  const endScreen = document.createElement('div');
  gameArea.appendChild(endScreen);
  endScreen.className = 'pre-post';
  endScreen.innerHTML = `
  <h3>Game Over:</h3>
  <p class="game-end-message">${str}</p>
  <p class="game-end-recap">
    You ate a total of <span>${applesEaten} apples</span> and grew your snake to a
    <span>length of ${snakeLength}</span>, but you can do better!
  </p>
  <button>Try Again!</button>
`;
  let restartButton = endScreen.querySelector('button');
  restartButton.addEventListener('click', startGame);
}

function resetGameBoard() {
  let endScreen = gameArea.querySelector('.pre-post');
  gameArea.removeChild(endScreen);
  //Remove snake class from existing class
  for (piece of snake) {
    let snakePiece = gameArea.querySelector(piece);
    snakePiece.classList.remove('snake');
    snakePiece.innerHTML = '';
  }
  snake = [];
  //Remove Existing Apples
  for (apple of droppedApples) {
    let oldApple = gameArea.querySelector(apple);
    oldApple.classList.remove('apple');
    oldApple.innerHTML = '';
  }
  droppedApples = [];
  //Reset reference points
  snakeColRef = Math.floor((areaCols - 1) / 2);
  snakeRowRef = Math.floor((areaRows - 1) / 2);
  //Reset scores
  applesEaten = 0;
  snakeLength = 4;
  //default current direction
  currentDirection = 'right';
  updateScores();
}

document.addEventListener('keydown', (event) => {
  if (canKeyDown) {
    if (event.key === 'ArrowRight' && currentDirection !== 'left') {
      currentDirection = 'right';
    } else if (event.key === 'ArrowUp' && currentDirection !== 'down') {
      currentDirection = 'up';
    } else if (event.key === 'ArrowLeft' && currentDirection !== 'right') {
      currentDirection = 'left';
    } else if (event.key === 'ArrowDown' && currentDirection !== 'up') {
      currentDirection = 'down';
    }
  }
  canKeyDown = false;
});

// Additional Options::

//Speed Settings
let initialIntervalSpeed = 150;
intervalSpeed = initialIntervalSpeed;

const speedSelect = document.querySelector('#speed');
speedSelect.addEventListener('change', () => {
  if (speedSelect.value === 'Slow') {
    intervalSpeed = 200;
  }
  if (speedSelect.value === 'Normal') {
    intervalSpeed = initialIntervalSpeed;
  }
  if (speedSelect.value === 'Faster') {
    intervalSpeed = 75;
  }
  if (speedSelect.value === 'Insane') {
    intervalSpeed = 50;
  }
});

//Snake Wrap
const wrapSelect = document.querySelector('#wrap');
wrapSelect.addEventListener('change', () => {
  if (wrapSelect.value === 'Off') {
    snakeWrapOn = false;
  } else {
    snakeWrapOn = true;
  }
});

function checkSnakeWrap() {
  if (!snakeWrapOn) {
    return;
  } else {
    if (snakeColRef === -1) {
      snakeColRef = areaCols - 1;
    }
    if (snakeColRef === areaCols) {
      snakeColRef = 0;
    }
    if (snakeRowRef === -1) {
      snakeRowRef = areaRows - 1;
    }
    if (snakeRowRef === areaRows) {
      snakeRowRef = 0;
    }
  }
}
