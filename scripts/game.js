//https://github.com/ScottEBean/TowerDefense.git

Game.screens['game-play'] = (function (input, graphics, records, menu, ) {
	'use strict';

	let mouseCapture = false;
	let menuCanvas = document.getElementById('menuCanvas');
	let menuCtx = menuCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameCtx = gameCanvas.getContext('2d');
	let keyboard = input.Keyboard();
	let mouse = input.Mouse();
	let lastTimeStamp = performance.now();
	let cancelNextRequest = false;
	let drawArcs = false;

	let menuSelectedTower = [0, 0, 0, 0];
	let grid = new Array(15);
	let testStack = [];
	let testStack2 = [];
	let lrAirStack = [];
	let lrGrndStack = [];
	let tbAirStack = [];
	let tbGndStack = [];
	let wave1 = 20;
	let wave2 = 35;
	let wave3 = 50;
	let creeps = [];

	let drawGameGrid = true;
	let go = false;
	let lives = 10;
	let score = 1000;
	let timeAccumulator = 0;

	/*			Methods			*/

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

		testStack.push({ x: 25, y: 375 });
		testStack.push({ x: 75, y: 375 });
		testStack.push({ x: 125, y: 375 });
		testStack.push({ x: 175, y: 375 });
		testStack.push({ x: 225, y: 375 });
		testStack.push({ x: 275, y: 375 });
		testStack.push({ x: 325, y: 375 });
		testStack.push({ x: 375, y: 375 });
		testStack.push({ x: 425, y: 375 });
		testStack.push({ x: 475, y: 375 });
		testStack.push({ x: 525, y: 375 });
		testStack.push({ x: 575, y: 375 });
		testStack.push({ x: 625, y: 375 });
		testStack.push({ x: 675, y: 375 });
		testStack.push({ x: 725, y: 375 });

		testStack2.push({ x: 375, y: 25 });
		testStack2.push({ x: 375, y: 75 });
		testStack2.push({ x: 375, y: 125 });
		testStack2.push({ x: 375, y: 175 });
		testStack2.push({ x: 375, y: 225 });
		testStack2.push({ x: 375, y: 275 });
		testStack2.push({ x: 375, y: 325 });
		testStack2.push({ x: 375, y: 375 });
		testStack2.push({ x: 375, y: 425 });
		testStack2.push({ x: 375, y: 475 });
		testStack2.push({ x: 375, y: 525 });
		testStack2.push({ x: 375, y: 575 });
		testStack2.push({ x: 375, y: 625 });
		testStack2.push({ x: 375, y: 675 });
		testStack2.push({ x: 375, y: 725 });

		lrAirStack.push({ x: 25, y: 375 });
		lrAirStack.push({ x: 75, y: 375 });
		lrAirStack.push({ x: 125, y: 375 });
		lrAirStack.push({ x: 175, y: 375 });
		lrAirStack.push({ x: 225, y: 375 });
		lrAirStack.push({ x: 275, y: 375 });
		lrAirStack.push({ x: 325, y: 375 });
		lrAirStack.push({ x: 375, y: 375 });
		lrAirStack.push({ x: 425, y: 375 });
		lrAirStack.push({ x: 475, y: 375 });
		lrAirStack.push({ x: 525, y: 375 });
		lrAirStack.push({ x: 575, y: 375 });
		lrAirStack.push({ x: 625, y: 375 });
		lrAirStack.push({ x: 675, y: 375 });
		lrAirStack.push({ x: 725, y: 375 });

		tbAirStack.push({ x: 375, y: 25 });
		tbAirStack.push({ x: 375, y: 75 });
		tbAirStack.push({ x: 375, y: 125 });
		tbAirStack.push({ x: 375, y: 175 });
		tbAirStack.push({ x: 375, y: 225 });
		tbAirStack.push({ x: 375, y: 275 });
		tbAirStack.push({ x: 375, y: 325 });
		tbAirStack.push({ x: 375, y: 375 });
		tbAirStack.push({ x: 375, y: 425 });
		tbAirStack.push({ x: 375, y: 475 });
		tbAirStack.push({ x: 375, y: 525 });
		tbAirStack.push({ x: 375, y: 575 });
		tbAirStack.push({ x: 375, y: 625 });
		tbAirStack.push({ x: 375, y: 675 });
		tbAirStack.push({ x: 375, y: 725 });

	}

	function createWaves() {
		// Wave 1 - All ground left
		for (let i = 0; i < wave1; i++) {
			creeps.push(graphics.creep({
				center: { x: 0, y: 375 },
				direction: 'rt',
				endpoint: { x: 725, y: 375 },
				hp: 50,
				rate: 0,
				type: 1,
				path: testStack,
				wave: 1
			}));
		}

		// // Wave 2 - All ground, left and top
		// for (let i = 0; i < wave2; i++) {
		// 	var ctype = Random.nextRange(1, 2);
		// 	var rstack = Random.nextRange(1, 2);
		// 	var stack = null;
		// 	var endP = null;
		// 	var startP = null;
		// 	var dir = null;

		// 	if (rstack === 1) {
		// 		startP = {x: 0, y: 375};
		// 		endP = { x: 725, y: 375 };
		// 		stack = testStack
		// 		dir = 'rt';
		// 	}
		// 	else {
		// 		startP = { x: 375, y: 0 };
		// 		endP = { x: 375, y:  725};
		// 		stack = testStack2
		// 		dir = 'dn';
		// 	}
		// 	creeps.push(graphics.creep({
		// 		center: startP,
		// 		direction: dir,
		// 		endpoint: endP,
		// 		hp: 50,
		// 		rate: 0,
		// 		type: 2,
		// 		path: stack,
		// 		wave: 2
		// 	}));
		// }

		// // Wave 3 - ground and air left and top
		// for (let i = 0; i < wave3; i++) {
		// 	var cType = Random.nextRange(1, 3);
		// 	var rstack = Random.nextRange(1, 2);
		// 	var stack = null;
		// 	var endP = null;
		// 	var startP = null;
		// 	var dir = null;

		// 	if (rstack === 1 && cType < 3) {
		// 		startP = { x: 0, y: 375 };
		// 		endP = { x: 725, y: 375 };
		// 		stack = testStack;
		// 		dir = 'rt';
		// 	}
		// 	else if(rstack === 2 && ctype < 3){
		// 		startP = { x: 375, y: 0 };
		// 		endP = { x: 375, y: 725 };
		// 		stack = testStack2;
		// 		dir = 'dn';
		// 	}
		// 	else if(rstack === 1 && ctype === 3){
		// 		startP = { x: 0, y: 375 };
		// 		endP = { x: 725, y: 375 };
		// 		stack = lrAirStack;
		// 		dir = 'rt';
		// 	}else{
		// 		startP = { x: 375, y: 0 };
		// 		endP = { x: 375, y: 725 };
		// 		stack = tbAirStack
		// 		dir = 'dn';
		// 	}

		// 	creeps.push(graphics.creep({
		// 		center: startP,
		// 		direction: dir,
		// 		endpoint: endP,
		// 		hp: 50,
		// 		rate: 0,
		// 		type: 3,
		// 		path: stack,
		// 		wave: 3
		// 	}));
		// }
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
		keyboard.registerCommand(KeyEvent.DOM_VK_R, function () { drawArcs = true; });
		keyboard.registerCommand(KeyEvent.DOM_VK_T, function () { drawArcs = false; });
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
		});
		keyboard.registerCommand(KeyEvent.DOM_VK_B, function () {
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
		}

		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				grid[i][j] = 0;
			}
		}

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
				rate: 20 * Math.PI / 1000,
				rotation: Math.PI / 2,
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
				rate: 20 * Math.PI / 1000,
				rotation: Math.PI / 2,
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
				rate: 20 * Math.PI / 1000,
				rotation: Math.PI / 2,
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
				rate: 20 * Math.PI / 1000,
				rotation: Math.PI / 2,
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

	// Used for debugging in the browser :(
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
			for (let i = 0; i < creeps.length; i++) {				
				creeps[i].draw();
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
		timeAccumulator += elapsedTime;
		for (let i = 0; i < wave.length; i++) {
			if (wave[i].moveRate == 0 && timeAccumulator > 1000) {
				timeAccumulator = 0;
				wave[i].moveRate = 3000;
				return;
			}
		}
	}

	function update(elapsedTime) {
		mouse.update(elapsedTime);
		keyboard.update(elapsedTime);
		if (go) {
			setWaveRateInterval(creeps, elapsedTime);
		}

		//towers
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (typeof (grid[i][j]) === 'object') {
					grid[i][j].update(elapsedTime, drawArcs);
				}
			}
		}

		// creeps
		// need to handle waves
		for (let i = 0; i < wave1; i++) {
			creeps[i].update(elapsedTime);
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
