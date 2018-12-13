//https://github.com/ScottEBean/TowerDefense.git

Game.screens['game-play'] = (function (input, graphics, records, menu) {
	let menuCanvas = document.getElementById('menuCanvas');
	let menuCtx = menuCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameCtx = gameCanvas.getContext('2d');		
	let keyboard = input.Keyboard();
	let mouse = input.Mouse();
	let lastTimeStamp = performance.now();
	let cancelNextRequest = false;

	let grid = new Array(15);
	let lives = 10;
	let score = 1000;
	let drawGameGrid = true;
	let menuSelectedTower = [0, 0, 0, 0];	


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

	function getMousePos(canvas, e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	function gameLoop(currentTime) {
		let elapsedTime = currentTime - lastTimeStamp;
		lastTimeStamp = currentTime;
		update(elapsedTime);
		render();
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}

	function initialize() {
		
		menuCanvas.addEventListener('mousedown', function(e){selectMenuTower(e);});
		gameCanvas.addEventListener('mousedown', function(e){placeTower(e);});

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
		initialzeGrid();
		graphics.drawGrid();
		graphics.drawBackground();
		graphics.drawTowerTypes();
	}

	function initialzeGrid() {
		for (var i = 0; i < 15; i++) {
			grid[i] = new Array(15);
		}

		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				grid[i][j] = 0;
			}
		}

		grid[7][0] = 100;
		grid[7][14] = 100;
		grid[0][7] = 100;
		grid[14][7] = 100;
	}

	function placeTower(e) {
		let mPos = getMousePos(gameCanvas, e);
		let mPx = Math.floor(mPos.x);
		let mPy = Math.floor(mPos.y);
		mPx -= mPx % 50;
		mPy -= mPy % 50;
		let rowIndex = mPx / 50;
		let colIndex = mPy / 50;

		if (menuSelectedTower[0] == 1 && score > 50) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rotation: 0,
				type: 1,
				fireRate: 1000,
			});

			score -= 50;
			printGrid();
			return;
		}
		if (menuSelectedTower[1] == 1 && score > 100) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rotation: 0,
				type: 2,
				fireRate: 1000,
			});

			score -= 50;
			return;
		}
		if (menuSelectedTower[2] == 1 && score > 50) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rotation: 0,
				type: 3,
				fireRate: 1000,
			});

			score -= 50;
			return;
		}
		if (menuSelectedTower[3] == 1 && score > 100) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rotation: 0,
				type: 4,
				fireRate: 1000,
			});

			score -= 50;
			return;
		}

		return;
	}

	function printGrid(){
		var line = "";
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				line += grid[i][j] + " ";				
			}
			console.log(line);
			line = "";			
		}
	}

	function render() {
		graphics.clear();
		for(var i = 0; i < grid.length; i++){
			for(var j = 0; j < grid.length; j++){
				if(grid[i][j] != 0 && grid[i][j] != 100){
					grid[i][j].draw();
				}
			}
		}
		graphics.clearMenu();
		graphics.drawScore(score);
		graphics.drawLives(lives);
		graphics.drawTowerTypes();
		drawMenuSelectedBox();
	}

	

	function run() {
		lastTimeStamp = performance.now();
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
		console.log('Defend!');
	}

	function selectMenuTower(e) {
		let mPos = getMousePos(menuCanvas, e)
		if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 50 && mPos.y <= 100) {
			deselectAll();
			menuSelectedTower[0] = 1;
			return;
		}else
		if (mPos.x >= 150 && mPos.x <= 200 && mPos.y >= 50 && mPos.y <= 100) {
			deselectAll();
			menuSelectedTower[1] = 1;
			return;
		}else
		if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 150 && mPos.y <= 200) {
			deselectAll();
			menuSelectedTower[2] = 1;
			return;
		}else
		if (mPos.x >= 150 && mPos.x <= 200 && mPos.y >= 150 && mPos.y <= 200) {
			deselectAll();
			menuSelectedTower[3] = 1;
			return;
		}else{
			deselectAll();
		}
	}

	function update(elapsedTime) {
		mouse.update(elapsedTime);
		keyboard.update(elapsedTime);
	}

	return {
		initialize: initialize,
		run: run
	};

}(Game.input,
	Game.graphics,
	Game.records,
	Game.menu));
