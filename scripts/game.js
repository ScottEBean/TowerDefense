Game.screens['game-play'] = (function (input, graphics, records, menu) {

	var cancelNextRequest = false;
	var keyboard = input.Keyboard();
	var mouse = input.Mouse();
	var drawPath = false;
	var drawGameGrid = true;
	var lives = 10;
	var score = 100;
	var lastTimeStamp = performance.now();
	var towers = [];

	var groundTower1 = graphics.tower({
		center: {x: 375, y:375},
		weaponSrc: 'assets/towers/t11.png'
	});

	var groundCreep1 = graphics.creep({
		center: {x: 375, y:25},
		imageSrc: 'assets/creeps/gc12.png',
		hp: 50,
		direction: 'dn',
		rotation: Math.PI/2
	});

	towers.push(groundTower1);
	towers.push(groundCreep1);
	

	function initialize() {
		// keyboard.registerCommand(KeyEvent.DOM_VK_U, upgradetower());
		// keyboard.registerCommand(KeyEvent.DOM_VK_S, sellTower());
		// keyboard.registerCommand(KeyEvent.DOM_VK_G, startNextLevel());
		keyboard.registerCommand(KeyEvent.DOM_VK_V, function () {
			if (drawGameGrid) {
				drawGameGrid = false;
				graphics.clearBackground();
				return;
			}

			if (!drawGameGrid) {
				drawGameGrid = true;
				graphics.drawGrid();
				return;
			}
		});
		keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
			cancelNextRequest = true;
			menu.showScreen('main-menu');
		});
		// keyboard.registerCommand(KeyEvent.DOM_VK_T, function(){
		// 	graphics.drawTowerTypes();
		// });	

		graphics.drawGrid();
		graphics.drawBackground();
		graphics.drawTowerTypes();
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

	function update(elapsedTime) {

	}

	function render() {
		graphics.clear();
		// graphics.clearMenuText();
		// graphics.drawScore(score);
		// graphics.drawLives(lives);
		for (var i = 0; i < towers.length; i++) {
			towers[i].draw();
			// console.log(i + ":" + towers[i].center.x + "," + towers[i].center.y);
		}
	}

	function run() {
		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
		console.log('Defend!');
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
