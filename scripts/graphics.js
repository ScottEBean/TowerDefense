// ------------------------------------------------------------------
// This is the graphics object.  The various rendering components
// are located here.
// ------------------------------------------------------------------
Game.graphics = (function () {
	'use strict';

	let backCanvas = document.getElementById('backgroundCanvas');
	let backCtx = backCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameCtx = gameCanvas.getContext('2d');
	let menuCanvas = document.getElementById('menuCanvas');
	let menuCtx = menuCanvas.getContext('2d');
	let gridSize = 50;
	let cyanStrokeFill = 'rgba(0, 208, 208, 1)';
	let base = Game.assets['towerBase'];

	//------------------------------------------------------------------
	// Public function that allows the client code to clear the canvas.
	//------------------------------------------------------------------
	function clear() {
		gameCtx.save();
		gameCtx.setTransform(1, 0, 0, 1, 0, 0);
		gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		gameCtx.restore();
	}

	function clearBackground() {
		gameCtx.save();
		gameCtx.setTransform(1, 0, 0, 1, 0, 0);
		gameCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
		gameCtx.restore();
	}

	function clearMenu() {
		menuCtx.save();
		menuCtx.setTransform(1, 0, 0, 1, 0, 0);
		menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
		menuCtx.restore();
	}

	function creep(spec) {
		let that = {};
		that.center = { x: spec.center.x, y: spec.center.y };
		that.hp = spec.hp;
		that.direction = spec.direction; // up dn lt rt

		var image = new Image();
		var imageReady = false;
		image.onload = function () { imageReady = true; }
		image.src = spec.imageSrc;

		that.draw = function () {
			if (imageReady) {
				gameCtx.save();
				gameCtx.translate(spec.center.x, spec.center.y);
				gameCtx.rotate(spec.rotation);
				gameCtx.translate(-spec.center.x, -spec.center.y);
				gameCtx.drawImage(image, that.center.x - gridSize / 2, that.center.y - gridSize / 2, gridSize, gridSize);
				gameCtx.restore();
			}
		}

		that.update = function () {

		}

		return that;
	}

	function drawBackground() {
		drawBackgroundBorder();
	}

	function drawBackgroundBorder() {
		var xm = gameCanvas.width / 2 + 250;
		var xw = backCanvas.width;
		var ym = backCanvas.height / 2;
		var yh = backCanvas.height;
		backCtx.save();
		backCtx.beginPath();
		backCtx.moveTo(250, ym - gridSize / 2);
		backCtx.lineTo(250, 0);
		backCtx.lineTo(xm - gridSize / 2, 0);
		backCtx.moveTo(xm + gridSize / 2, 0);
		backCtx.lineTo(xw, 0);
		backCtx.lineTo(xw, ym - gridSize / 2);
		backCtx.moveTo(xw, ym + gridSize / 2);
		backCtx.lineTo(xw, yh);
		backCtx.lineTo(xm + gridSize / 2, yh);
		backCtx.moveTo(xm - gridSize / 2, yh);
		backCtx.lineTo(250, yh);
		backCtx.lineTo(250, ym + gridSize / 2);

		backCtx.lineWidth = 5;
		backCtx.strokeStyle = cyanStrokeFill;
		backCtx.stroke();
		backCtx.restore();
	}

	function drawGrid() {
		backCtx.save();
		backCtx.beginPath();
		backCtx.setLineDash([1, 10]);

		//draw Vertical grid lines
		for (var i = 250; i <= backCanvas.width; i += gridSize) {
			backCtx.moveTo(i, 0);
			backCtx.lineTo(i, 750);
		}

		//draw horizontal grid lines
		for (var i = 0; i <= backCanvas.height; i += gridSize) {
			backCtx.moveTo(250, i);
			backCtx.lineTo(1000, i);
		}

		backCtx.lineWidth = 1;
		backCtx.strokeStyle = 'rgba(0, 255, 0, .75)';
		backCtx.stroke();
		backCtx.restore();
		backCtx.setLineDash([]);
	}

	function drawLives(lives) {
		menuCtx.font = '15px Roboto';
		menuCtx.fillStyle = cyanStrokeFill;
		var livesText = 'Lives: ' + lives;
		var textWidth = menuCtx.measureText(livesText).width + 10;
		menuCtx.fillText(livesText, 250 - textWidth, menuCanvas.height - 10);
	}

	function drawScore(score) {
		menuCtx.font = '15px Roboto';
		menuCtx.fillStyle = cyanStrokeFill;
		var scoreText = '$ ' + score;
		menuCtx.fillText(scoreText, 10, gameCanvas.height - 10);
	}

	function drawSelectedBox(spec) {
		if (spec.canvas === 'menu') {
			menuCtx.beginPath();
			menuCtx.lineWidth = 1;
			menuCtx.strokeStyle = 'rgba(255, 0, 0, 0.75)';
			menuCtx.rect(spec.x, spec.y, gridSize + 2, gridSize + 2);
			menuCtx.stroke();
		} else {
			gameCtx.beginPath();
			gameCtx.lineWidth = 1;
			gameCtx.strokeStyle = 'rgba(255, 0, 0, 0.75)';
			gameCtx.rect(spec.x, spec.y, gridSize + 2, gridSize + 2);
			gameCtx.stroke();
		}
	}

	function drawTowerTypes() {
		let gt1 = Game.assets['tower11'];
		let gt2 = Game.assets['tower21'];
		let at1 = Game.assets['tower31'];
		let at2 = Game.assets['tower41'];

		menuCtx.save();
		menuCtx.drawImage(base, 50, 50, 50, 50);
		menuCtx.drawImage(gt1, 50, 50, 50, 50)
		menuCtx.drawImage(base, 150, 50, 50, 50);
		menuCtx.drawImage(gt2, 150, 50, 50, 50);
		menuCtx.drawImage(base, 50, 150, 50, 50);
		menuCtx.drawImage(at1, 50, 150, 50, 50)
		menuCtx.drawImage(base, 150, 150, 50, 50);
		menuCtx.drawImage(at2, 150, 150, 50, 50)
		gameCtx.restore();
	}

	function tower(spec) {
		let that = {};
		that.type = spec.type
		that.selected = false;
		that.center = { x: spec.center.x, y: spec.center.y };
		that.level = 1;
		that.damage = that.level * 10;
		that.rotation = spec.rotation;
		that.weapon = getWeapon(spec.type, that.level);
		that.fireRate = spec.fireRate;
		that.cost = 50;

		that.draw = function () {
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.rotate(that.rotation);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(base, that.center.x - gridSize / 2, that.center.y - gridSize / 2, gridSize, gridSize);
			gameCtx.drawImage(that.weapon, that.center.x - gridSize / 2, that.center.y - gridSize / 2, gridSize, gridSize);
			if (that.selected) {
				drawSelectedBox({ x: that.center.x - gridSize / 2, y: that.center.y - gridSize / 2, canvas: 'game' });
			}
			gameCtx.restore();

		}

		that.upgrade = function () {
			if (level < 3) {
				that.level++;
				that.damage = that.level * 10;
				that.fireRate -= 250;
				that.weapon = getWeapon(that.type, that.level)
			}
		}

		that.update = function (elapsedTime) {

		}

		return that;
	}

	function getWeapon(type, level) {
		if (type == 1) {
			if (level == 1) { return Game.assets['tower11']; }
			if (level == 2) { return Game.assets['tower12']; }
			if (level == 3) { return Game.assets['tower13']; }
		}
		if (type == 2) {
			if (level == 1) { return Game.assets['tower21']; }
			if (level == 2) { return Game.assets['tower22']; }
			if (level == 3) { return Game.assets['tower23']; }
		}
		if (type == 3) {
			if (level == 1) { return Game.assets['tower31']; }
			if (level == 2) { return Game.assets['tower32']; }
			if (level == 3) { return Game.assets['tower33']; }
		}
		if (type == 4) {
			if (level == 1) { return Game.assets['tower41']; }
			if (level == 2) { return Game.assets['tower42']; }
			if (level == 3) { return Game.assets['tower43']; }
		}
	}

	return {
		clear: clear,
		clearBackground: clearBackground,
		clearMenu: clearMenu,
		creep: creep,
		drawBackground: drawBackground,
		drawBackgroundBorder: drawBackgroundBorder,
		drawGrid: drawGrid,
		drawLives: drawLives,
		drawSelectedBox: drawSelectedBox,
		drawScore: drawScore,
		drawTowerTypes: drawTowerTypes,
		tower: tower,
	};

}());
