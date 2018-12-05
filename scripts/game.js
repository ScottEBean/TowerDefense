//https://bft.usu.edu/kv9rq
Game.screens['game-play'] = (function (input, graphics, records, menu) {

	var cancelNextRequest = false;
	var keyboard = input.Keyboard();
	
	function initialize() {
		

		keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, snake.moveLeft(-speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, snake.moveRight(speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_UP, snake.moveUp(-speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_DOWN, snake.moveDown(speed));
		keyboard.registerCommand(KeyEvent.DOM_VK_SPACE, go);
		keyboard.registerCommand(KeyEvent.DOM_VK_R, run);
		keyboard.registerCommand(KeyEvent.DOM_VK_I, initialize)
		keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
			cancelNextRequest = true;
			menu.showScreen('main-menu');
		});
	}	

	function processInput(elapsedTime) {
		keyboard.update(elapsedTime);
	}

	function gameOver() {
		graphics.setLargeTextProperties();
		graphics.drawText("Game Over :(", 25, 350);
		setTimeout(function () { menu.showScreen('main-menu'), 1000 });
		// scores.update(score);
	}

	function go() {
		graphics.clearTopLayer();
		graphics.setCountdownTextProperties();
		graphics.drawText("3", 187, 250);
		setTimeout(function () { graphics.drawText("2", 375, 200); }, 1000);
		setTimeout(function () { graphics.drawText("1", 562, 200); }, 2000);
		setTimeout(function () { graphics.setLargeTextProperties(); }, 2999);
		setTimeout(function () { graphics.drawText("Go!", 280, 500); }, 3000);
		setTimeout(function () { graphics.clearTopLayer(); }, 3300);
		setTimeout(function () { speed = 150; }, 3300);
	}
	
	function run() {
		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
		console.log('Defend!');
	}

	function update(elapsedTime) {
		detectCollision();
	}

	function render() {
		graphics.clear();
		graphics.drawScore(score);
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
