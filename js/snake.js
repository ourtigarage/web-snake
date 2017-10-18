class Game {
    constructor(width, height) {
        this.nextMove = undefined;
        this.width = width;
        this.height = height;
        this.snake = [[width/20, height/20]];
        this.bonus = undefined;
        this.addBonus();
    }

    keyDown(e) {
        console.log(e);
        switch(e.key) {
            case "ArrowLeft":
                this.nextMove = "left";
                break;
            case "ArrowUp":
                this.nextMove = "up";
                break;
            case "ArrowRight":
                this.nextMove = "right";
                break;
            case "ArrowDown":
                this.nextMove = "down";
                break;
            default:
                // Do nothing just ignore it
                break;
        }
    }

    addBonus() {
        var x = Math.round(Math.random() * (this.width/10));
        var y = Math.round(Math.random() * (this.height/10));
        this.bonus = [x, y];
    }

    update() {
        var newHead = this.snake[0].slice();
        switch(this.nextMove) {
            case undefined:
                return;
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
        this.snake.pop();
        this.snake.unshift(newHead);
    }

    render(g) {
        g.clearRect(0, 0, this.width, this.height);
        g.strokeStyle = 'black';
        g.lineWidth = 15;
        g.strokeRect(0, 0, this.width, this.height);
        g.fillStyle = 'blue';
        for(var i = 0; i < this.snake.length; i++) {
            var xy = this.snake[i];
            g.fillRect(xy[0]*10, xy[1]*10, 10, 10);
        }
        g.fillStyle = 'green';
        g.fillRect(this.bonus[0]*10, this.bonus[1]*10, 10, 10);
    }
}

function start() {
    game = new Game(800, 600);
    console.log("Starting the game");
    var canvas = document.getElementById("game");
    document.onkeydown = function(e) {game.keyDown(e);};
    var g = canvas.getContext("2d");
    setInterval(loop, 50, game, g);
}

function loop(game, g) {
    game.update();
    game.render(g);
}