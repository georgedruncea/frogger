var COL_SIZE = 101;
var ROW_SIZE = 83;
var PLAYER_ROW_DELTA = 20;
var ENEMY_ROW_DELTA = 20;

var Entity = function(x, y, sprite, row_delta) {
  this.x = x * COL_SIZE;
  this.y = y * ROW_SIZE;
  this.sprite = sprite;
  this.row_delta = row_delta;
};

/**
 * Return entity's x coordinate
 * @return {int} horizontal coordinate
 */

Entity.prototype.getX = function() {
  return this.x / COL_SIZE;
};

/**
 * Return entity's y coordinate
 * @return {int} vertical coordinate
 */

Entity.prototype.getY = function() {
  return this.y / ROW_SIZE;
};

Entity.prototype.onCollision = function(anotherEntity, collisionOutcome) {
  if (Math.abs(this.getX() - anotherEntity.getX()) <= 0.5 && this.getY() === anotherEntity.getY()) {
    collisionOutcome();
  }
};


Entity.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y - this.row_delta);
};

/**
 * Enemies our player must avoid
 * @param  {[int]} x horizontal axis coordinate
 * @param  {[int]} y vertical axis coordinate
 * @param  {int} speed vertical axis speed coeficient [0,1]
 * @return {[Enemy]} a new enemy object
 */
var Enemy = function(x, y, sprite, row_delta, speed, delay) {
  Entity.call(this, x, y, sprite, row_delta);
  this.speed = speed;
  this.delay = delay;
  this.reset = 0;
};

Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.x === (-1*COL_SIZE)) {
    var now = Date.now();
    if (this.reset === 0)
      this.reset = now;
    if (((now - this.reset) /1000.0) <= this.delay)
      return;
    else {
      this.reset = 0;
    }
  }
  var update_pos = function() {
    if (this.x <= 5 * COL_SIZE) {
      this.x+=this.speed;
    } else {
      this.x = -1*COL_SIZE;
    }
  };
  setTimeout(update_pos.call(this), dt);
};


/**
 * The Player
 * @param  {[int]} x horizontal axis coordinate
 * @param  {[int]} y horizontal axis coordinate
 * @return {[Player]} a new player object
 */

var Player = function(x, y, sprite, row_delta) {
  Entity.call(this, x, y, sprite, row_delta);
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

/**
 * Updates player's avatar position based on input recevied from the user
 *
 */

Player.prototype.update = function() {
  switch (this.input) {
    case "left":
      if (this.x > 0) {
        this.x = this.x - COL_SIZE;
      }
      break;
    case "right":
      if (this.x < 4 * COL_SIZE) {
        this.x = this.x + COL_SIZE;
      }
      break;
    case "up":
      if (this.y > 0) {
        //this.y = this.y - ROW_SIZE - this.row_delta;
        this.y = this.y - ROW_SIZE;
      }
      break;
    case "down":
      if (this.y < 5 * ROW_SIZE) {
        //this.y = this.y + ROW_SIZE + this.row_delta;
        this.y = this.y + ROW_SIZE;
      }
      break;
  }
  this.input = "none";
};

/**
 * Handles player control input from the user
 */

Player.prototype.handleInput = function(key) {
  this.input = key;
};

Player.prototype.rePosition = function(x, y) {
  this.x = x * COL_SIZE;
  this.y = y * ROW_SIZE;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(-1, 1, "images/enemy-bug.png", ENEMY_ROW_DELTA, Math.random() * 10, Math.random()*5),
  new Enemy(-1, 2, "images/enemy-bug.png", ENEMY_ROW_DELTA, Math.random()* 10, Math.random()*5),
  new Enemy(-1, 3, "images/enemy-bug.png", ENEMY_ROW_DELTA, Math.random() * 10, Math.random()*5)];
var player = new Player(2, 5, "images/char-boy.png", PLAYER_ROW_DELTA);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
