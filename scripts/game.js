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
	let drawHp = false;
	let waveFinished = false;
	let finishedCount = 0;

	let menuSelectedTower = [0, 0, 0, 0];
	let grid = new Array(15);
	let lrGrid = new Array(15);
	let tbGrid = new Array(15);
	let testStack = [];
	let testStack2 = [];
	let lrAirStack = [];
	let lrGndStack = [];
	let tbAirStack = [];
	let tbGndStack = [];
	let projectiles = [];
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

		lrGndStack = Path.getPath(lrGrid, { x: 0, y: 375 }, { x: 725, y: 375 });
		tbGndStack = Path.getPath(tbGrid, { x: 375, y: 0 }, { x: 375, y: 725 });

		for (let i = 25; i < 775; i += 50) {
			lrAirStack.push({ x: i, y: 375 });
		}

		for (let i = 25; i < 775; i += 50) {
			tbAirStack.push({ x: 375, y: i });
		}
	}

	function createWave1() {
		// Wave 1 - All ground left
		for (let i = 0; i < wave1; i++) {
			creeps.push(graphics.creep({
				center: { x: 0, y: 375 },
				direction: 'rt',
				endpoint: { x: 725, y: 375 },
				hp: 50,
				rate: 0,
				rotation: 0,
				type: Random.nextRange(1, 2),
				path: lrGndStack,
				pathNum: 1,
				grid: lrGrid,
				wave: 1
			}));
		}
	}

	function createWave2() {
		// Wave 2 - All ground, left and top
		for (let i = 0; i < wave2; i++) {
			let cType = Random.nextRange(1, 2);
			let randStack = Random.nextRange(1, 2);
			let stack = null;
			let pathGrid = null;
			let endP = null;
			let startP = null;
			let dir = null;
			let angle = null;

			if (randStack === 1) {
				startP = { x: 0, y: 375 };
				endP = { x: 725, y: 375 };
				stack = lrGndStack,
					pathGrid = lrGrid;
				dir = 'rt';
				angle = 0;
			}
			else {
				startP = { x: 375, y: 0 };
				endP = { x: 375, y: 725 };
				stack = tbGrid
				dir = 'dn';
				angle = Math.PI / 2;
			}
			creeps.push(graphics.creep({
				center: startP,
				direction: dir,
				endpoint: endP,
				hp: 50,
				rate: 0,
				rotation: angle,
				type: cType,
				path: stack,
				pathNum: randStack,
				wave: 2
			}));
		}
	}

	function createWave3() {
		// Wave 3 - ground and air left and top
		for (let i = 0; i < wave3; i++) {
			let cType = Random.nextRange(1, 3);
			let randStack = Random.nextRange(1, 2);
			let stack = null;
			let startP = null;
			let endP = null;
			let dir = null;
			let angle = null;

			if (randStack === 1 && cType < 3) {
				startP = { x: 0, y: 375 };
				endP = { x: 725, y: 375 };
				stack = lrGndStack;
				dir = 'rt';
				angle = 0;
			}
			else if (randStack === 2 && cType < 3) {
				startP = { x: 375, y: 0 };
				endP = { x: 375, y: 725 };
				stack = tbGndStack;
				dir = 'dn';
				angle = Math.PI / 2;
			}
			else if (randStack === 1 && cType === 3) {
				startP = { x: 0, y: 375 };
				endP = { x: 725, y: 375 };
				stack = lrAirStack;
				dir = 'rt';
				angle = 0;
			} else {
				startP = { x: 375, y: 0 };
				endP = { x: 375, y: 725 };
				stack = tbAirStack
				dir = 'dn';
				angle = Math.PI / 2;
			}

			creeps.push(graphics.creep({
				center: startP,
				direction: dir,
				endpoint: endP,
				hp: 50,
				rate: 0,
				rotation: angle,
				type: cType,
				path: stack,
				pathNum: randStack,
				wave: 3
			}));
		}
	}

	function deselectMenu() {
		for (let i = 0; i < menuSelectedTower.length; i++) {
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
		let rect = canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}

	function getSelectedTower() {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; i < grid.length; j++) {
				if (typeof grid[i][j] === 'object' && grid[i][j].selected) {
					return { twr: grid[i][j], row: i, col: j };
				}
			}
		}
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
		mouse.registerCommand('mousedown', function (e) { mouseCapture = true; });
		mouse.registerCommand('mouseup', function () { mouseCapture = false; });
		mouse.registerCommand('mousemove', function (e) { if (mouseCapture) { } });
		menuCanvas.addEventListener('mousedown', function (e) { selectMenuTower(e) });
		gameCanvas.addEventListener('mousedown', function (e) { placeTower(e) });
		gameCanvas.addEventListener('click', function (e) { selectGridCell(e); });

		keyboard.registerCommand(KeyEvent.DOM_VK_U, function () { upgradeTower(); });
		keyboard.registerCommand(KeyEvent.DOM_VK_S, function () { sellTower(); });
		keyboard.registerCommand(KeyEvent.DOM_VK_R, function () { drawArcs = true; });
		keyboard.registerCommand(KeyEvent.DOM_VK_T, function () { drawArcs = false; });
		keyboard.registerCommand(KeyEvent.DOM_VK_G, function () { go = true; });
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

		initializeGrids();
		createPaths();
		createWave1();
		graphics.drawGrid();
		graphics.drawBackground();
		graphics.drawTowerTypes();
	}

	function initializeGrids() {
		for (let i = 0; i < 15; i++) {
			grid[i] = new Array(15);
			lrGrid[i] = new Array(15);
			tbGrid[i] = new Array(15);
		}

		for (let i = 0; i < 15; i++) {
			for (let j = 0; j < 15; j++) {
				grid[i][j] = 0;
				lrGrid[i][j] = 225;
				tbGrid[i][j] = 225;
			}
		}

		grid[7][0] = 225;
		grid[7][14] = 225;
		grid[0][7] = 225;
		grid[14][7] = 225;


		lrGrid = Path.updateGrid(lrGrid, { x: 725, y: 375 });
		tbGrid = Path.updateGrid(tbGrid, { x: 375, y: 725 });
	}

	function placeTower(e) {
		let mPos = getMousePos(gameCanvas, e);
		let mPx = Math.floor(mPos.x);
		let mPy = Math.floor(mPos.y);
		mPx -= mPx % 50;
		mPy -= mPy % 50;
		let rowIndex = mPy / 50;
		let colIndex = mPx / 50;

		if (grid[rowIndex][colIndex] != 0 && grid[rowIndex][colIndex] != 1) { return; }

		if (menuSelectedTower[0] == 1 && score > 50) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rate: 30 * Math.PI / 1000,
				rotation: Math.PI / 2,
				type: 1,
				fireRate: 1000,
			});

			lrGrid[rowIndex][colIndex] = 1500;
			tbGrid[rowIndex][colIndex] = 1500;
			lrGrid = Path.updateGrid(lrGrid, { x: 725, y: 375 });
			tbGrid = Path.updateGrid(tbGrid, { x: 375, y: 725 });

			score -= 50;
			return;
		}
		if (menuSelectedTower[1] == 1 && score > 100) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rate: 30 * Math.PI / 1000,
				rotation: Math.PI / 2,
				type: 2,
				fireRate: 1000,
			});

			lrGrid[rowIndex][colIndex] = 1500;
			tbGrid[rowIndex][colIndex] = 1500;
			lrGrid = Path.updateGrid(lrGrid, { x: 725, y: 375 });
			tbGrid = Path.updateGrid(tbGrid, { x: 375, y: 725 });

			score -= 50;
			return;
		}
		if (menuSelectedTower[2] == 1 && score > 50) {
			grid[rowIndex][colIndex] = graphics.tower({
				center: { x: mPx + 25, y: mPy + 25 },
				rate: 30 * Math.PI / 1000,
				rotation: Math.PI / 2,
				type: 3,
				fireRate: 1000,
			});

			lrGrid[rowIndex][colIndex] = 1500;
			tbGrid[rowIndex][colIndex] = 1500;
			lrGrid = Path.updateGrid(lrGrid, { x: 725, y: 375 });
			tbGrid = Path.updateGrid(tbGrid, { x: 375, y: 725 });

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

			lrGrid[rowIndex][colIndex] = 1500;
			tbGrid[rowIndex][colIndex] = 1500;
			lrGrid = Path.updateGrid(lrGrid, { x: 725, y: 375 });
			tbGrid = Path.updateGrid(tbGrid, { x: 375, y: 725 });

			score -= 50;
			return;
		}

		return;
	}

	function render() {
		graphics.clear();

		//towers
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (grid[i][j] != 0 && grid[i][j] != 225 && grid[i][j] != 1) {
					grid[i][j].draw();
				}
			}
		}
		drawGridSelectedBox();

		//projectiles
		for (let i = 0; i < projectiles.length; i++) {
			if (typeof projectiles[i] === 'object' && projectiles[i].alive) {
				projectiles[i].draw();
			}
		}
		

		//creeps
		if (go) {
			for (let i = 0; i < creeps.length; i++) {
				if (typeof creeps[i] === 'object') {
					creeps[i].draw();
				}
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
		} else if (mPos.x >= 150 && mPos.x <= 200 && mPos.y >= 50 && mPos.y <= 100) {
			deselectMenu();
			menuSelectedTower[1] = 1;
			return;
		} else if (mPos.x >= 50 && mPos.x <= 100 && mPos.y >= 150 && mPos.y <= 200) {
			deselectMenu();
			menuSelectedTower[2] = 1;
			return;
		} else if (mPos.x >= 150 && mPos.x <= 200 && mPos.y >= 150 && mPos.y <= 200) {
			deselectMenu();
			menuSelectedTower[3] = 1;
			return;
		} else {
			deselectMenu();
		}
	}

	function sellTower() {
		var sold = getSelectedTower();

		grid[sold.row][sold.col] = 0;

		score += 50;
	}

	function setWaveRateInterval(wave, elapsedTime) {
		timeAccumulator += elapsedTime;
		for (let i = 0; i < wave.length; i++) {
			if (wave[i].moveRate == 0 && timeAccumulator > 2000) {
				timeAccumulator = 0;
				wave[i].moveRate = 1000;
				return;
			}
		}
	}

	function update(elapsedTime) {
		mouse.update(elapsedTime);
		keyboard.update(elapsedTime);

		//make the creeps move in each wave (eventually)
		if (go) {
			setWaveRateInterval(creeps, elapsedTime);
		}

		//towers
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid.length; j++) {
				if (typeof (grid[i][j]) === 'object') {
					grid[i][j].update(elapsedTime, drawArcs, creeps, projectiles);
				}
			}
		}

		//projectiles
		for (let i = 0; i < projectiles.length; i++) {
			if (typeof projectiles[i] === 'object' && projectiles[i].alive) {
				projectiles[i].update(elapsedTime);
			}

		}

		// creeps
		for (let i = 0; i < wave1; i++) {
			if (typeof creeps[i] === 'object') {
				if (creeps[i].finished && creeps[i].hp > 0) {
					lives--;
					creeps[i] = 0;
				} else if (creeps[i].finished) {
					score += 50;
					creeps[i] = 0;
				} else {
					if (creeps[i].endpoint.x == 725) {
						creeps[i].update(elapsedTime, lrGrid);
					} else {
						creeps[i].update(elapsedTime, tbGrid);
					}
				}
			}
		}
	}

	function upgradeTower() {
		getSelectedTower().twr.upgrade();
		score -= 50;
	}

	return {
		initialize: initialize,
		run: run
	};

}(Game.input,
	Game.graphics,
	Game.records,
	Game.menu));
