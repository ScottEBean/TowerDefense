//https://github.com/ScottEBean/TowerDefense.git

Game.screens['game-play'] = (function (input, graphics, records, menu) {
	'use strict';

	let mouseCapture = false;
	let menuCanvas = document.getElementById('menuCanvas');
	let menuCtx = menuCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameCtx = gameCanvas.getContext('2d');
	let keyboard = input.Keyboard();
	let mouse = input.Mouse();
	let lastTimeStamp = performance.now();
	let timeAccumulator = 0;
	let cancelNextRequest = false;

	let grid = new Array(15);
	let go = false;
	let lives = 10;
	let score = 1000;
	let drawGameGrid = true;
	let menuSelectedTower = [0, 0, 0, 0];
	let lrPath = new Array(15);
	let lrStack = [];
	let tbPath = new Array(15);
	let wave1 = []

	function deselectGrid() {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (grid[i][j] == 1) {
					grid[i][j] = 0;
				}
				if (typeof (grid[i][j]) === 'object') {
					grid[i][j].selected = false;
				}
			}
		}
	}

	function createPaths() {
		lrPath[7][13] = 1;
		lrPath[7][12] = 2;
		lrPath[7][11] = 3;
		lrPath[7][10] = 4;
		lrPath[7][9] = 5;
		lrPath[7][8] = 6;
		lrPath[7][7] = 7;
		lrPath[7][6] = 8;
		lrPath[7][5] = 9;
		lrPath[7][4] = 10;
		lrPath[7][3] = 11;
		lrPath[7][2] = 12;
		lrPath[7][1] = 13;
		lrPath[7][0] = 14;

		lrStack.push({ x: 25, y: 375 });
		lrStack.push({ x: 75, y: 375 });
		lrStack.push({ x: 125, y: 375 });
		lrStack.push({ x: 175, y: 375 });
		lrStack.push({ x: 225, y: 375 });
		lrStack.push({ x: 275, y: 375 });
		lrStack.push({ x: 325, y: 375 });
		lrStack.push({ x: 375, y: 375 });
		lrStack.push({ x: 425, y: 375 });
		lrStack.push({ x: 475, y: 375 });
		lrStack.push({ x: 525, y: 375 });
		lrStack.push({ x: 575, y: 375 });
		lrStack.push({ x: 625, y: 375 });
		lrStack.push({ x: 675, y: 375 });
		lrStack.push({ x: 725, y: 375 });
	}

	function createWaves() {
		//Wave 1
		for (let i = 0; i < 20; i++) {
				wave1.push(graphics.creep({
					center: {x: 0, y: 375},
					direction: 'rt',
					endpoint: {x: 725, y: 375},
					hp: 50,
					rate: 0,
					type: i % 2 + 1,
					path: lrStack,
				}));
			}
	}

	function deselectMenu() {
		for (var i = 0; i < menuSelectedTower.length; i++) {
			menuSelectedTower[i] = 0;
		}
	}

	function drawMenuSelectedBox() {
		if (menuSelectedTower[0] === 1) { graphics.drawSelectedBox({ x: 50, y: 50, canvas: 'menu' }); return; }
		if (menuSelectedTower[1] === 1) { graphics.drawSelectedBox({ x: 150, y: 50, canvas: 'menu' }); return; }
		if (menuSelectedTower[2] === 1) { graphics.drawSelectedBox({ x: 50, y: 150, canvas: 'menu' }); return; }
		if (menuSelectedTower[3] === 1) { graphics.drawSelectedBox({ x: 150, y: 150, canvas: 'menu' }); return; }
	}

	function drawGridSelectedBox() {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (grid[i][j] == 1) {
					graphics.drawSelectedBox({ x: i * 50, y: j * 50, canvas: 'game' });
				}
			}
		}
	}

	function getMousePos(canvas, e) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	function gameLoop(currentTime) {
		//let elapsedTime = currentTime - lastTimeStamp;
		let elapsedTime = Math.abs(currentTime - lastTimeStamp);
		lastTimeStamp = currentTime;
		update(elapsedTime);
		render();
		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}

	function initialize() {

		menuCanvas.addEventListener('mousedown', function (e) { selectMenuTower(e) });
		gameCanvas.addEventListener('mousedown', function (e) { placeTower(e) });
		gameCanvas.addEventListener('click', function (e) { selectGridCell(e); });

		// keyboard.registerCommand(KeyEvent.DOM_VK_U, upgradetower());
		// keyboard.registerCommand(KeyEvent.DOM_VK_S, sellTower());
		keyboard.registerCommand(KeyEvent.DOM_VK_G, function () {
			go = true;
		});
		keyboard.registerCommand(KeyEvent.DOM_VK_D, function () { deselectMenu(); deselectGrid(); })
		keyboard.registerCommand(KeyEvent.DOM_VK_V, function () {
			if (drawGameGrid) {
				drawGameGrid = false;
				graphics.clearBackground();
				graphics.drawBackgroundBorder();
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

		initializeGrids();
		createPaths();
		createWaves();
		graphics.drawGrid();
		graphics.drawBackground();
		graphics.drawTowerTypes();
	}

	function initializeGrids() {
		for (var i = 0; i < 15; i++) {
			grid[i] = new Array(15);
			lrPath[i] = new Array(15);
			tbPath[i] = new Array(15);
		}

		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				grid[i][j] = 0;
				lrPath[i][j] = 225;
				tbPath[i][j] = 225;
			}
		}

		lrPath[7][14] = 0;
		tbPath[14][7] = 0;

		grid[7][0] = 225;
		grid[7][14] = 225;
		grid[0][7] = 225;
		grid[14][7] = 225;
	}

	function placeTower(e) {
		let mPos = getMousePos(gameCanvas, e);
		let mPx = Math.floor(mPos.x);
		let mPy = Math.floor(mPos.y);
		mPx -= mPx % 50;
		mPy -= mPy % 50;
		let rowIndex = mPx / 50;
		let colIndex = mPy / 50;

		if (grid[rowIndex][colIndex] != 0 && grid[rowIndex][colIndex] != 1) { return; }

		if (menuSelectedTower[0] == 1 && score > 50) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rotation: 0,
				type: 1,
				fireRate: 1000,
			});

			lrPath[rowIndex][colIndex] = 225;
			tbPath[rowIndex][colIndex] = 225;

			score -= 50;
			return;
		}
		if (menuSelectedTower[1] == 1 && score > 100) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rotation: 0,
				type: 2,
				fireRate: 1000,
			});

			lrPath[rowIndex][colIndex] = 225;
			tbPath[rowIndex][colIndex] = 225;

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

			lrPath[rowIndex][colIndex] = 225;
			tbPath[rowIndex][colIndex] = 225;

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

			lrPath[rowIndex][colIndex] = 225;
			tbPath[rowIndex][colIndex] = 225;

			score -= 50;
			return;
		}

		return;
	}

	function printGrid() {
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

		//towers
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid.length; j++) {
				if (grid[i][j] != 0 && grid[i][j] != 225 && grid[i][j] != 1) {
					grid[i][j].draw();
				}
			}
		}
		drawGridSelectedBox();

		//creeps
		if (go) {
			for (let i = 0; i < wave1.length; i++) {
				wave1[i].draw();
			}
		}

		//menu
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

	function selectGridCell(e) {
		deselectGrid();
		let mPos = getMousePos(gameCanvas, e);
		let mPx = Math.floor(mPos.x);
		let mPy = Math.floor(mPos.y);
		mPx -= mPx % 50;
		mPy -= mPy % 50;
		let rowIndex = mPx / 50;
		let colIndex = mPy / 50;
		if (typeof (grid[rowIndex][colIndex]) === 'object') {
			grid[rowIndex][colIndex].selected = true;
			return;
		} else
			if (grid[rowIndex][colIndex] != 100) {
				grid[rowIndex][colIndex] = 1;
			}

	}

	function selectMenuTower(e) {
		let mPos = getMousePos(menuCanvas, e)
		if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 50 && mPos.y <= 100) {
			deselectMenu();
			menuSelectedTower[0] = 1;
			return;
		} else
			if (mPos.x >= 150 && mPos.x <= 200 && mPos.y >= 50 && mPos.y <= 100) {
				deselectMenu();
				menuSelectedTower[1] = 1;
				return;
			} else
				if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 150 && mPos.y <= 200) {
					deselectMenu();
					menuSelectedTower[2] = 1;
					return;
				} else
					if (mPos.x >= 150 && mPos.x <= 200 && mPos.y >= 150 && mPos.y <= 200) {
						deselectMenu();
						menuSelectedTower[3] = 1;
						return;
					} else {
						deselectMenu();
					}
	}

	function setWaveRateInterval(wave, elapsedTime) {
		timeAccumulator +=elapsedTime;
		for (let i = 0; i < wave.length; i++) {
			if (wave[i].moveRate == 0 && timeAccumulator > 5000) {
				timeAccumulator = 0;
				wave[i].moveRate = 500;
				return;
			}
		}
	}

	function update(elapsedTime) {
		mouse.update(elapsedTime);
		keyboard.update(elapsedTime);
		if (go) {
			setWaveRateInterval(wave1, elapsedTime);
		}
		for (let i = 0; i < wave1.length; i++) {
			wave1[i].update(elapsedTime);
		}
	}

	return {
		initialize: initialize,
		run: run
	};

}(Game.input,
	Game.graphics,
	Game.records,
	Game.menu));
