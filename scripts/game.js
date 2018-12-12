Game.screens['game-play'] = (function (input, graphics, records, menu) {
	let menuCanvas = document.getElementById('menuCanvas');
	let menuCtx = menuCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameCtx = gameCanvas.getContext('2d');
	let cancelNextRequest = false;
	let keyboard = input.Keyboard();
	let mouse = input.Mouse();
	let drawPath = false;
	let drawGameGrid = true;
	let lives = 10;
	let score = 100;
	let lastTimeStamp = performance.now();
	let towers = [];
	let menuSelectedTower = [ 0, 0, 0, 0];
	
	let grid = new Array(15);

	

	

	function initialize() {
		initialzeGrid();
		menuCanvas.addEventListener('mousedown', selectMenuTower(e));

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

		mouse.registerCommand('mousedown', function (e) {
			mouseCapture = true;
			
		});

		mouse.registerCommand('mouseup', function () {
			mouseCapture = false;
		});

		mouse.registerCommand('mousemove', function (e) {
			if (mouseCapture) {
				
				
			}
		});

		

		graphics.drawGrid();
		graphics.drawBackground();
		graphics.drawTowerTypes();
	}

	function initialzeGrid(){
		for (var i = 0; i < 15; i++){
			grid[i] = new Array(15);
		}

		for (var i = 0; i < 15; i++){
			for(var j = 0; i < 15; j++){
				grid[i][j] = 0;
			}
		}
	}

	function selectMenuTower (e) {
		let mPos = getMousePos(menuCanvas, e)
		if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 50 && mPos.y <= 100) {
			deselectAll();
			menuSelectedTower[0] = 1;			
			return;
		}
		if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 50 && mPos.y <= 100) {
			deselectAll();
			menuSelectedTower[1] = 1;			
			return;
		}
		if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 50 && mPos.y <= 100) {
			deselectAll();
			menuSelectedTower[2] = 1;			
			return;
		}
		if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 50 && mPos.y <= 100) {
			deselectAll();
			menuSelectedTower[3] = 1;
			return;
		}
	}

	function deselectAll (){
		for(var i = 0; i < menuSelectedTower.length; i++){
			menuSelectedTower[i] = 0;
		}
	}

	function drawMenuSelectedBox(){
		if (menuSelectedTower[0] === 1) { graphics.drawSelectedBox({ x: 50, y: 50, canvas: 'menu' }); return; }
		if (menuSelectedTower[1] === 1) { graphics.drawSelectedBox({ x: 150, y: 50, canvas: 'menu' }); return; }
		if (menuSelectedTower[2] === 1) { graphics.drawSelectedBox({ x: 50, y: 150, canvas: 'menu' }); return; }
		if (menuSelectedTower[3] === 1) { graphics.drawSelectedBox({ x: 150, y: 150, canvas: 'menu' }); return; }
	}

	function processInput(elapsedTime) {
		mouse.update(elapsedTime);
		keyboard.update(elapsedTime);
	}

	function getMousePos(canvas, e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	function gameOver() {
		graphics.setLargeTextProperties();
		graphics.drawText("Game Over :(", 25, 350);
		setTimeout(function () { menu.showScreen('main-menu'), 1000 });
		scores.update(score);
	}

	function update(elapsedTime) {
		processInput(elapsedTime);
	}

	function render() {
		graphics.clear();
		graphics.clearMenu();
		graphics.drawScore(score);
		graphics.drawLives(lives);
		graphics.drawTowerTypes();
		drawMenuSelectedBox();

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
