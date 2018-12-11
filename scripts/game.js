Game.screens['game-play'] = (function (input, graphics, records, menu) {

	var cancelNextRequest = false;
	var keyboard = input.Keyboard();
	var mouse = input.Mouse();
	var drawPath = false;
	var drawGrid = true;
	var lives = 10;
	var score = 100;
	var lastTimeStamp = performance.now();
	var ac = graphics.airCreep({
		center:{x : 3, y : 4}
		});
	

	
	function initialize() {
		// keyboard.registerCommand(KeyEvent.DOM_VK_U, upgradetower());
		// keyboard.registerCommand(KeyEvent.DOM_VK_S, sellTower());
		// keyboard.registerCommand(KeyEvent.DOM_VK_G, startNextLevel());
		keyboard.registerCommand(KeyEvent.DOM_VK_V, function(){
			if(drawGrid){
				drawGrid = false;
				graphics.clearBackground();
				return;
			}

			if(!drawGrid){
				drawGrid = true;
				graphics.drawGrid();
				return;
			}
		});
		keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
			cancelNextRequest = true;
			menu.showScreen('main-menu');
		});

		graphics.drawGrid();
		graphics.drawBackground();
	}	

	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
	}

	function gameOver() {
		graphics.setLargeTextProperties();
		graphics.drawText("Game Over :(", 25, 350);
		setTimeout(function () { menu.showScreen('main-menu'), 1000 });
		scores.update(score);
	}
	
	
	function run() {
		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
		console.log('Defend!');
	}

	function update(elapsedTime) {
		
	}

	function render() {
		graphics.clear();
		graphics.drawScore(score);
		graphics.drawLives(lives);
	}

	function gameLoop(currentTime) {
		let elapsedTime = currentTime - lastTimeStamp;
		lastTimeStamp = currentTime;
		processInput(elapsedTime);
		update(elapsedTime);
		render();
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	};

	return {
		initialize: initialize,
		run: run
	};

}(Game.input,
	Game.graphics,
	Game.records,
	Game.menu));
