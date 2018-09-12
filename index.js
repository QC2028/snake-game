window.onload = function () {
    var GRID_SIZE = 20;
    var FRAME_RATE = 1000 / 10;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var gridWidth = gridHeight = GRID_SIZE - 1;
    var cellWidth = Math.ceil(canvas.width / gridWidth);
    var cellHeight = Math.ceil(canvas.height / gridHeight);
    var gameOver = false
    var keypress = false
    
    var score = {
        current: 0,
        highScore: 0,
        update() {
            ctx.font = "10px Arial";
            ctx.fillStyle = 'white'
            ctx.fillText('score:' + this.current, 10, 10);
            
            ctx.font = "10px Arial";
            ctx.fillStyle = 'white'
            ctx.fillText('high score:' + this.highScore, 60, 10);
        },
        reset() {
            if (this.highScore < this.current) {
                this.highScore = this.current
            }
            
            this.current = 0
        }
        
    }


    var apple = {
        draw () {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.position.x * cellWidth, this.position.y * cellHeight, cellWidth, cellHeight); 
        },
        eaten: false,
        position: {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)    
        },
        reset(){
            this.position = {
                x: Math.floor(Math.random() * gridWidth),
                y: Math.floor(Math.random() * gridHeight)  
            }  
            this.eaten = false
        },
        update () {
            if(this.eaten === true) {
                this.reset()
                score.current++
            }
            this.draw();
        }
    }

    var snake = {
        draw () {
            for (var i = 0; i < this.length; i++) {
                var position = this.positions[i];
                ctx.fillStyle = '#32CD32';
                ctx.fillRect(position.x * cellWidth, position.y * cellHeight, cellWidth, cellHeight); 
            }
        },
        reset(){
            this.length = 1
            this.positions = [{
                x: 0,
                y: 0
            }]
            this.velocity = {
                x: 0,
                y: 0
            }
        },
        length: 1,
        positions: [{
            x: 0,
            y: 0
        }],
        update () {
            if (!this.velocity.x && !this.velocity.y) {
                return
            }

            var oldPosition = this.positions[this.length - 1]

            this.positions.push({
                x: oldPosition.x + this.velocity.x,
                y: oldPosition.y + this.velocity.y
            });

            var newPosition = this.positions[this.length]
            
            if(newPosition.x >= gridWidth) {
                newPosition.x = 0
            }
            if(newPosition.y >= gridHeight) {
                newPosition.y = 0
            }
            if(newPosition.x < 0) {
                newPosition.x = GRID_SIZE - 1
            }
            if(newPosition.y < 0) {
                newPosition.y = GRID_SIZE - 1
            }

            if(newPosition.x === apple.position.x && newPosition.y === apple.position.y) {
                apple.eaten = true 
                this.length++
            } else {
                this.positions.splice(0, 1);
            }
            
            for (var i = 0; i < this.length - 1; i++) {
                var position = this.positions[i];
                if (newPosition.x === position.x && newPosition.y === position.y) {
                    gameOver = true
                }
            }

            this.draw();
        },
        velocity: {
            x: 0,
            y: 0
        }
    }
    setInterval(function() {
        if (!gameOver) {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            snake.update();
            apple.update();
            score.update();

            if (gameOver) {
                setTimeout(function() {
                    function resetGame(event) {
                        snake.reset()
                        apple.reset()
                        score.reset()
                        gameOver = false
                        
                        window.removeEventListener('keypress', resetGame)
                    }
                    window.addEventListener('keypress', resetGame)
                }, 1000)
            }
        }
        

    }, FRAME_RATE );
    
    window.onkeypress = function(event) {
       if(keypress === false) {
            if(gameOver === false) {
                if (event.key === 'd' && snake.velocity.x !== -1) {
                    snake.velocity.x = 1
                    snake.velocity.y = 0       

                    keypress = true
                }
                if (event.key === 's' && snake.velocity.y !== -1) {
                    snake.velocity.x = 0
                    snake.velocity.y = 1       

                    keypress = true
                }
                if (event.key === 'a' && snake.velocity.x !== 1) {
                    snake.velocity.x = -1
                    snake.velocity.y = 0        

                    keypress = true
                }
                if (event.key === 'w' && snake.velocity.y !== 1) {
                    snake.velocity.x = 0
                    snake.velocity.y = -1       

                    keypress = true
                }
            }
        }

        if (keypress) {
            setTimeout(function() {
                keypress = false;
            }, FRAME_RATE)
        }
    }
}