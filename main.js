//Global Variable
const areaCols = 31;
const areaRows = 25;
// Adding Row and Column Row Reference global variables that will both serve as the starting 'head' point of the snake, as well as an updatable reference point for moving the snake around the map
let snakeColRef = Math.floor((areaCols - 1) / 2);
let snakeRowRef = Math.floor((areaRows - 1) / 2);

const snake = [];
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
  for (let i = 0; i < 3; i++) {
    let snakePiece = gameArea.querySelector(`#r${snakeRowRef}c${bodyColRef}`);
    let snakePieceRef = `#r${snakeRowRef}c${bodyColRef}`;
    snakePiece.classList.add('snake');
    snake.push(snakePieceRef);
    bodyColRef--;
  }
}

placeSnake();
console.log(snake);
function moveSnake() {
  //Will Move differently based on direction, but for eachd direction, each time we move, we will add a new 'snake head' point to the start of the array and will remove the last value of the array
  snakeDirection();

  let newHead = gameArea.querySelector(`#r${snakeRowRef}c${snakeColRef}`);
  newHead.classList.add('snake');
  let newHeadRef = `#r${snakeRowRef}c${snakeColRef}`;
  snake.unshift(newHeadRef);
  let removeSnakePiece = gameArea.querySelector(snake[snake.length - 1]);
  removeSnakePiece.classList.remove('snake');

  snake.pop();

  console.log(snake);
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
  console.log(event.key);
  if (event.key === 'ArrowRight') {
    currentDirection = 'right';
  } else if (event.key === 'ArrowUp') {
    currentDirection = 'up';
  } else if (event.key === 'ArrowLeft') {
    currentDirection = 'left';
  } else if (event.key === 'ArrowDown') {
    currentDirection = 'down';
  }
});

setInterval(moveSnake, 200);
