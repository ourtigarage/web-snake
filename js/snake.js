// Class representing the game
class Game {
    // Build a new game with the given pixel width and height
    constructor(width, height) {
        // At the beginnig, no movement is set, the game is paused
        this.nextMove = undefined;
        this.width = width;
        this.height = height;
        this.tileWidth = width/60;
        this.tileHeight = height/60;
        // Initialize a 1 sized snake at the center of the game board
        this.snake = [[Math.round(width/(2*this.tileWidth)), Math.round(height/(2*this.tileHeight))]];
        this.food = undefined;
        this.score = new Score();
        this.gameover = false
        this.scoreHtmlElmt = document.getElementById("score");
        this.addFood();
    }

    // Callback function called when a keyboard key
    // is pushed down
    keyDown(e) {
        //Get the pause popup div
        var popup = document.getElementById("pausePopup");

        console.log(e);
        switch(e.key) {
            case "ArrowLeft":
		if (this.nextMove != "right") {
		   this.nextMove = "left";
           popup.style.visibility = "hidden";
		}
                break;
            case "ArrowUp":
		if (this.nextMove != "down") {
		   this.nextMove = "up";
           popup.style.visibility = "hidden";
		}
                break;
            case "ArrowRight":
		if (this.nextMove != "left") {
		   this.nextMove = "right";
           popup.style.visibility = "hidden";
		}
                break;
            case "ArrowDown":
		if (this.nextMove != "up") {
		   this.nextMove = "down";
           popup.style.visibility = "hidden";
		}
                break;
            case " ":

           this.nextMove = undefined;
           popup.style.visibility = "visible";
                break;
            default:
                // Do nothing just ignore it
                break;
        }
    }

    // Add a food somewhere in the game (randomly)
    addFood() {
        var x = Math.round(Math.random() * 60);
        var y = Math.round(Math.random() * 60);
        this.food = [x, y];
    }

    // Update the game state with the next move
    update() {
        var newHead = this.snake[0].slice();
        switch(this.nextMove) {
            case undefined:
                return;
                break;
            case "left":
                newHead[0] -= 1;
                break;
            case "up":
                newHead[1] -= 1;
                break;
            case "right":
                newHead[0] += 1;
                break;
            case "down":
                newHead[1] += 1;
                break;
            default:
                throw "Unexpected move";
        }
        //TODO: Check next move is not a game over
        // 1) If snake is going out ouf the game
        if(newHead[0] < 0) {
            this.gameover = true;
            newHead[0] = 0;
        } else if(newHead[0] >= Math.round(this.width/(this.tileWidth))) {
	    this.gameover = true;
            newHead[0] = Math.round(this.width/(this.tileWidth))-1;
        }
        if(newHead[1] < 0) {
	    this.gameover = true;
            newHead[1] = 0;
        } else if(newHead[1] >= Math.round(this.height/(this.tileHeight))) {
	    this.gameover = true;
            newHead[1] = Math.round(this.height/(this.tileHeight))-1;
        }
        // 2) If snake bites itself

        //Check if next move is on some food
        if(newHead[0] == this.food[0] && newHead[1] == this.food[1]) {
            console.log("Yum yum !!!");
            console.log("score", this.snake.length);
            //TODO: Move food to another place
            //This place must not be somewhere on the snake
            this.addFood();
        } else {
            this.snake.pop(); //Don't grow the snake
        }
        // Push the snake's new head position
        this.snake.unshift(newHead);
    }

    // Draw / render the current game state
    render(ctx) {
        // Clear the screen
        ctx.clearRect(0, 0, this.width, this.height);

        // Update score HTML element
        this.scoreHtmlElmt.textContent = this.snake.length - 1;

        // Draw the borders
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, this.width, this.height);

        // Draw the snake
        ctx.fillStyle = 'blue';
        for(var i = 0; i < this.snake.length; i++) {
            var xy = this.snake[i];
            ctx.fillRect(xy[0]*this.tileWidth, xy[1]*this.tileHeight, this.tileWidth, this.tileHeight);
        }

        // Draw the food
		var food = new Image();
		food.src = "js/Phone.jpg";
		//TO DO : Randomize placement
		ctx.drawImage(food, this.food[0]*this.tileWidth, this.food[1]*this.tileHeight);
	//GameOver
	      if (this.gameover) {
              ctx.font = '48px serif';
              ctx.fillStyle = 'black';
              var displayGameOver = "GAME OVER";
              var text = ctx.measureText(displayGameOver);
              console.log(text.width);
              ctx.fillText(displayGameOver, (this.width-text.width)/2, this.height / 2);
          }
    }
}

// Initialize and start the game
function start() {
    console.log("Starting the game");
    var canvas = document.getElementById("game");
    game = new Game(canvas.width, canvas.height);
    document.onkeydown = function(e) {game.keyDown(e);};
    var ctx = canvas.getContext("2d");
    setInterval(loop, 75, game, ctx);
}

// The game update and rendering loop
function loop(game, ctx) {
    game.update();
    game.render(ctx);
}
