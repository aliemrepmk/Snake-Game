class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('game');
    this.context = this.canvas.getContext('2d');
    this.snakeColor = "red"   // Default snake color
    this.snakeColorInput = document.getElementById('snake-color');

    this.speedSlider = document.getElementById('speed-slider');
    this.speedLabel = document.getElementById('speed-label');
    this.speed = parseInt(this.speedSlider.value, 10);

    this.speedSlider.addEventListener('input', this.onSpeedChange.bind(this));

    this.highestScoreDisplay = document.getElementById('highest-score');
    this.highestScore = 0;
    this.loadHighestScore();

    document.addEventListener('keydown', this.onKeyPress.bind(this));
    this.snakeColorInput.addEventListener('input', () => {
      this.snakeColor = this.snakeColorInput.value;
    });

    this.paused = false; // Variable to track the pause state
  }

  tempX = this.generateRandomNumberExcept10();
  tempY = this.generateRandomNumberExcept10();

  init() {
    this.positionX = this.positionY = 10;
    this.appleX = this.tempX;
    this.appleY = this.tempY;
    this.tailSize = 1;
    this.trail = [];
    this.gridSize = this.tileCount = 20;
    this.velocityX = this.velocityY = 0;

    this.speed = parseInt(this.speedSlider.value, 10);
    this.speedLabel.innerText = this.speed;

    clearInterval(this.timer);
    this.timer = setInterval(this.loop.bind(this), 1000 / (this.speed));
  }

  reset() {
    clearInterval(this.timer);
    this.init();
    this.saveHighestScore();
  }

  loop() {
    if (this.paused) {
      return;   // If paused, do not update or draw the game
    }
    this.update();
    this.draw();
  }

  update() {
    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    if (this.positionX < 0) {
      this.positionX = this.tileCount - 1;
    } else if (this.positionY < 0) {
      this.positionY = this.tileCount - 1;
    } else if (this.positionX > this.tileCount - 1) {
      this.positionX = 0;
    } else if (this.positionY > this.tileCount - 1) {
      this.positionY = 0;
    }

    this.trail.forEach(t => {
      if (this.positionX === t.positionX && this.positionY === t.positionY) {
        this.reset();
      }
    });

    this.trail.push({ positionX: this.positionX, positionY: this.positionY });

    while (this.trail.length > this.tailSize) {
      this.trail.shift();
    }

    if (this.appleX === this.positionX && this.appleY === this.positionY) {
      this.tailSize++;
      this.appleX = Math.floor(Math.random() * this.tileCount);
      this.appleY = Math.floor(Math.random() * this.tileCount);

      if (this.tailSize - 1 > this.highestScore) {
        this.highestScore = this.tailSize - 1;
        this.saveHighestScore();
      }
    }
  }

  draw() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = 'cyan';
    this.context.font = '20px Arial';
    this.context.fillText(this.tailSize - 1, 20, 40);

    this.context.fillStyle = this.snakeColor;
    this.trail.forEach(t => {
      this.context.fillRect(t.positionX * this.gridSize, t.positionY * this.gridSize, this.gridSize - 5, this.gridSize - 5);
    });

    this.context.fillStyle = 'green';
    this.context.fillRect(this.appleX * this.gridSize, this.appleY * this.gridSize, this.gridSize - 5, this.gridSize - 5);
  }

  onKeyPress(e) {
    if (e.keyCode === 32) {
      this.paused = !this.paused; // Toggle pause state
    }

    if (e.keyCode === 27) {
      this.reset(); // Reset the game on the ESC key
    }

    if (this.paused) {
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        this.paused = false; // Resume the game if an arrow key is pressed
      }
      return; // If paused, do not handle keypress events
    }

    if (e.keyCode === 37 && this.velocityX !== 1) {
      this.velocityX = -1;
      this.velocityY = 0;
    } else if (e.keyCode === 38 && this.velocityY !== 1) {
      this.velocityX = 0;
      this.velocityY = -1;
    } else if (e.keyCode === 39 && this.velocityX !== -1) {
      this.velocityX = 1;
      this.velocityY = 0;
    } if (e.keyCode === 40 && this.velocityY !== -1) {
      this.velocityX = 0;
      this.velocityY = 1;
    }
  }

  onSpeedChange() {
    this.speed = parseInt(this.speedSlider.value, 10);
    this.speedLabel.innerText = this.speed;
    this.reset();
  }

  loadHighestScore() {
    const savedScore = localStorage.getItem('highestScore');
    if (savedScore !== null) {
      this.highestScore = parseInt(savedScore, 10);
      this.highestScoreDisplay.innerText = this.highestScore;
    }
  }

  saveHighestScore() {
    localStorage.setItem('highestScore', this.highestScore);
    this.highestScoreDisplay.innerText = this.highestScore;
  }

  generateRandomNumberExcept10() {
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * 20) + 1;
    } while (randomNum === 10);
    return randomNum;
  }
}

const game = new SnakeGame();

window.onload = () => game.init();
