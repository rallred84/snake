//Global Variable
const areaCols = 25;
const areaRows = 20;
let applesEaten = 0;
let snakeLength = 4;

//Adding a boolean that will move go false when a key is pressed and then back to true after snake moves to prevent rapid presses that could cause snake to try and eat itself
let canKeyDown = true;

const lengthScore = document.querySelector('#snake-length');
const appleScore = document.querySelector('#apples-eaten');
function updateScores() {
  lengthScore.textContent = `Snake Length: ${snakeLength}`;
  appleScore.textContent = `Apples Eaten: ${applesEaten}`;
}
updateScores();

// Adding Row and Column Row Reference global variables that will both serve as the starting 'head' point of the snake, as well as an updatable reference point for moving the snake around the map
let snakeColRef = Math.floor((areaCols - 1) / 2);
let snakeRowRef = Math.floor((areaRows - 1) / 2);

let snake = [];
let currentDirection = 'right';

let gameArea = document.querySelector('#game-area');

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
      pixel.id = `r${i}c${j}`;
      row.appendChild(pixel);
    }
  }
}

createPlayArea();

function placeSnake() {
  let startSpot = gameArea.querySelector(`#r${snakeRowRef}c${snakeColRef}`);
  startSpot.classList.add('snake');
  //push refernce values to starting spot to snake array
  const startSpotRef = `#r${snakeRowRef}c${snakeColRef}`;
  snake.push(startSpotRef);
  //Add 3 more snake pieces to left of snake 'head' to create starting snake
  let bodyColRef = snakeColRef - 1;
  for (let i = 0; i < snakeLength - 1; i++) {
    let snakePiece = gameArea.querySelector(`#r${snakeRowRef}c${bodyColRef}`);
    let snakePieceRef = `#r${snakeRowRef}c${bodyColRef}`;
    snakePiece.classList.add('snake');
    snake.push(snakePieceRef);
    bodyColRef--;
  }
}

let startBox = gameArea.querySelector('.pre-post');
startBox.addEventListener('click', startGame);

//creating a global variable for moving the snake so that it can be access by multiple functions
let move;
let appleInterval;

let firstGame = true;
function startGame() {
  if (firstGame) {
    gameArea.removeChild(startBox);
    firstGame = false;
  } else {
    resetGameBoard();
  }
  placeSnake();
  setTimeout(() => {
    move = setInterval(moveSnake, 200);
    dropApple();
  }, 1000);
  appleInterval = setInterval(dropApple, 5000);
}

function moveSnake() {
  //Will Move differently based on direction, but for eachd direction, each time we move, we will add a new 'snake head' point to the start of the array and will remove the last value of the array
  snakeDirection();
  let newHeadRef = `#r${snakeRowRef}c${snakeColRef}`;

  if (checkSpotConditions(newHeadRef)) {
    let newHead = gameArea.querySelector(newHeadRef);
    newHead.classList.add('snake');
    snake.unshift(newHeadRef);
  }
  canKeyDown = true;
}

function checkSpotConditions(newHeadRef) {
  //If snake hits wall, game over
  if (!gameArea.querySelector(newHeadRef)) {
    let message = 'You hit a wall!';
    endGameScreen(message);
    return false;
  }
  //If snake hits snake, game over
  if (gameArea.querySelector(newHeadRef).classList.contains('snake')) {
    let message = "You can't eat yourself!!";
    endGameScreen(message);
    return false;
  }
  //If does not hit an apple, we will remove the last piece of the previous snake and the snake will not grow
  if (!gameArea.querySelector(newHeadRef).classList.contains('apple')) {
    let removeSnakePiece = gameArea.querySelector(snake[snake.length - 1]);
    removeSnakePiece.classList.remove('snake');
    snake.pop();
    //But if the snake does hit an apple, we will remove the apple from the board and the snake will effectively grow one square
  } else {
    gameArea.querySelector(newHeadRef).classList.remove('apple');
    applesEaten++;
    snakeLength++;
    updateScores();
  }
  return true;
}

function endGameScreen(str) {
  clearInterval(move);
  clearInterval(appleInterval);
  const endScreen = document.createElement('div');
  gameArea.appendChild(endScreen);
  console.log(gameArea);

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
  endScreen.addEventListener('click', startGame);
}

function resetGameBoard() {
  let endScreen = gameArea.querySelector('.pre-post');
  gameArea.removeChild(endScreen);
  //Remove snake class from existing class
  for (piece of snake) {
    let snakePiece = gameArea.querySelector(piece);
    snakePiece.classList.remove('snake');
  }

  //Remove Existing Apples
  //
  //Reset reference points
  snakeColRef = Math.floor((areaCols - 1) / 2);
  snakeRowRef = Math.floor((areaRows - 1) / 2);
  //Reset scores
  applesEaten = 0;
  snakeLength = 4;
  //default current direction
  currentDirection = 'right';
  // empty snake Array
  snake = [];
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

let test = 1;
function dropApple() {
  let randomCol = Math.floor(Math.random() * areaCols);
  let randomRow = Math.floor(Math.random() * areaRows);
  //Check if spot is occupied by the snake already
  let randomLocId = `#r${randomRow}c${randomCol}`;
  let randomLoc = gameArea.querySelector(randomLocId);
  //If the random location already contains the snake class, start the drop app
  if (
    randomLoc.classList.contains('snake') ||
    randomLoc.classList.contains('apple')
  ) {
    return dropApple();
  } else {
    let appleSpot = gameArea.querySelector(randomLocId);
    appleSpot.classList.add('apple');
  }
}
