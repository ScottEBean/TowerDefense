// ------------------------------------------------------------------
// This is the graphics object.  The letious rendering components
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
		that.direction = spec.direction; // up dn lt rt
		that.endpoint = { x: spec.endpoint.x, y: spec.endpoint.y };
		that.hp = spec.hp;
		that.moveRate = spec.rate;
		that.rotation = spec.rotation;
		that.type = spec.type;
		that.image = getCreepImage(that.type, 1);
		that.lastUpdate = 0;
		that.finished = false;
		that.path = spec.path;
		that.pathNum = spec.pathNum;

		that.draw = function () {
			if ((that.finished || that.hp <= 0) && that.center.x > 0 && that.center.y > 0) { return; }
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.rotate(that.rotation);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(that.image, that.center.x - gridSize / 2, that.center.y - gridSize / 2, gridSize, gridSize);
			gameCtx.restore();
		}

		that.update = function (elapsedTime, grid) {
			if ((Math.abs(that.endpoint.x - that.center.x) < 5 && Math.abs(that.endpoint.y - that.center.y) < 5) || that.hp <= 0) {
				that.finished = true;
				return;
			}

			if (that.type == 3) {
				if (that.direction == 'dn') { that.center.y += that.moveRate / 1000; return; } // keep going dn
				if (that.direction == 'rt') { that.center.x += that.moveRate / 1000; return; } // keep going rt
			}

			that.lastUpdate += elapsedTime;
			that.path = 0;
			that.path = Path.getPath(grid, { x: that.center.x, y: that.center.y }, that.endpoint)
			let index = getCreepIndex(that.type, that.lastUpdate)
			that.image = getCreepImage(that.type, index);
			if (resetCreepSeq(that.type, index)) { that.lastUpdate = 0; }

			let currentDest = that.path[0];

			let Px = Math.round(that.center.x); // xPos rounded to nearest integer 
			let Py = Math.round(that.center.y); // yPos rounded to nearest integer
			let Cx = Px - Px % 50; //top left x coord of current cell
			let Cy = Py - Py % 50; //top left y coord of current cell
			let row = Cx / 50; //current row
			let col = Cy / 50; //current col
			let cellX = Cx + 25; //center.x of current cell
			let cellY = Cy + 25; //center.y of current cell
			let Rx = Math.abs(currentDest.x - Px);
			let Ry = Math.abs(currentDest.y - Py)


			if (that.moveRate > 0) {
				if (that.direction == 'up' && Ry < 3) {
					that.path.shift();
					if (that.path.length == 0) { that.center.y -= that.moveRate / 1000; that.finished = true; return; }
					if (that.path[0].y < currentDest.y) { that.center.y -= that.moveRate / 1000; } // keep going up
					else if (that.path[0].x < currentDest.x) { // go lt
						that.rotation = Math.PI;
						that.direction = 'lt'
						that.center.x -= that.moveRate / 1000;
					}
					else if (that.path[0].x > currentDest.x) { // go rt
						that.rotation = 0;
						that.direction = 'rt'
						that.center.x += that.moveRate / 1000;
					}
					return;
				}

				if (that.direction == 'dn' && Ry < 3) {
					that.path.shift();
					if (that.path.length == 0) { that.center.y += that.moveRate / 1000; that.finished = true; return; }
					if (that.path[0].y > currentDest.y) { that.center.y += that.moveRate / 1000; } // keep going down
					else if (that.path[0].x < currentDest.x) { // go lt
						that.rotation = Math.PI;
						that.direction = 'lt'
						that.center.x -= that.moveRate / 1000;
					}
					else if (that.path[0].x > currentDest.x) { // go rt
						that.rotation = 0;
						that.direction = 'rt'
						that.center.x += that.moveRate / 1000;
					}
					return;
				}

				if (that.direction == 'lt' && Rx < 3) {
					that.path.shift();
					if (that.path.length == 0) { that.center.x -= that.moveRate / 1000; that.finished = true; return; }
					if (that.path[0].x < currentDest.x) { that.center.x -= that.moveRate / 1000; } // keep going lt
					else if (that.path[0].y < currentDest.y) { // go up
						that.rotation = -Math.PI / 2;
						that.direction = 'up'
						that.center.y -= that.moveRate / 1000;
					}
					else if (that.path[0].y > currentDest.y) { // go dn
						that.rotation = Math.PI / 2;
						that.direction = 'dn'
						that.center.y += that.moveRate / 1000;
					}
					return;
				}

				if (that.direction == 'rt' && Rx < 3) {
					that.path.shift();
					if (that.path.length == 0) { that.center.x += that.moveRate / 1000; that.finished = true; return; }
					if (that.path[0].x > currentDest.x) { that.center.x += that.moveRate / 1000; } // keep going rt
					else if (that.path[0].y < currentDest.y) { // go up
						that.rotation = -Math.PI / 2;
						that.direction = 'up';
						that.center.y -= that.moveRate / 1000;
					}
					else if (that.path[0].y > currentDest.y) { // go dn
						that.rotation = Math.PI / 2;
						that.direction = 'dn';
						that.center.y += that.moveRate / 1000;
					}
					return;
				}

				if (that.direction == 'up') { that.center.y -= that.moveRate / 1000; return; }	// keep going up
				if (that.direction == 'dn') { that.center.y += that.moveRate / 1000; return; } // keep going dn
				if (that.direction == 'lt') { that.center.x -= that.moveRate / 1000; return; } // keep going lt
				if (that.direction == 'rt') { that.center.x += that.moveRate / 1000; return; } // keep going rt
			}
		}

		return that;
	}

	function drawBackground() {
		drawBackgroundBorder();
	}

	function drawBackgroundBorder() {
		let xm = gameCanvas.width / 2 + 250;
		let xw = backCanvas.width;
		let ym = backCanvas.height / 2;
		let yh = backCanvas.height;
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
		for (let i = 250; i <= backCanvas.width; i += gridSize) {
			backCtx.moveTo(i, 0);
			backCtx.lineTo(i, 750);
		}

		//draw horizontal grid lines
		for (let i = 0; i <= backCanvas.height; i += gridSize) {
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
		let livesText = 'Lives: ' + lives;
		let textWidth = menuCtx.measureText(livesText).width + 10;
		menuCtx.fillText(livesText, 250 - textWidth, menuCanvas.height - 10);
	}

	function drawScore(score) {
		menuCtx.font = '15px Roboto';
		menuCtx.fillStyle = cyanStrokeFill;
		let scoreText = '$ ' + score;
		menuCtx.fillText(scoreText, 10, gameCanvas.height - 10);
	}

	function drawSelectedBox(spec) {
		if (spec.canvas === 'menu') {
			menuCtx.beginPath();
			menuCtx.lineWidth = 1;
			menuCtx.strokeStyle = 'rgba(0, 255, 0, 0.75)';
			menuCtx.rect(spec.x, spec.y, gridSize + 2, gridSize + 2);
			menuCtx.stroke();
		} else {
			gameCtx.beginPath();
			gameCtx.lineWidth = 1;
			gameCtx.strokeStyle = 'rgba(0, 255, 0, 0.75)';
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

	function getCreepImage(type, index) {
		// groundCreep1
		if (type == 1 && index == 1) { return Game.assets['groundCreep11']; }
		if (type == 1 && index == 2) { return Game.assets['groundCreep12']; }
		if (type == 1 && index == 3) { return Game.assets['groundCreep13']; }
		if (type == 1 && index == 4) { return Game.assets['groundCreep14']; }
		// groundCreep2
		if (type == 2 && index == 1) { return Game.assets['groundCreep21']; }
		if (type == 2 && index == 2) { return Game.assets['groundCreep22']; }
		if (type == 2 && index == 3) { return Game.assets['groundCreep23']; }
		if (type == 2 && index == 4) { return Game.assets['groundCreep24']; }
		// airCreep
		if (type == 3 && index == 1) { return Game.assets['airCreep1']; }
		if (type == 3 && index == 2) { return Game.assets['airCreep2']; }
		if (type == 3 && index == 3) { return Game.assets['airCreep3']; }
		if (type == 3 && index == 4) { return Game.assets['airCreep4']; }
		if (type == 3 && index == 5) { return Game.assets['airCreep5']; }
		if (type == 3 && index == 6) { return Game.assets['airCreep6']; }
	}

	function getCreepIndex(type, timeAccumulator) {
		if (type == 1 && timeAccumulator <= 200) { return 1; }
		if (type == 1 && timeAccumulator > 200 && timeAccumulator <= 1200) { return 2; }
		if (type == 1 && timeAccumulator > 1200 && timeAccumulator <= 1400) { return 3; }
		if (type == 1 && timeAccumulator > 1400) { return 4; }

		if (type == 2 && timeAccumulator <= 1000) { return 1; }
		if (type == 2 && timeAccumulator > 1000 && timeAccumulator <= 1200) { return 2; }
		if (type == 2 && timeAccumulator > 1200 && timeAccumulator <= 1400) { return 3; }
		if (type == 2 && timeAccumulator > 1400) { return 4; }

		if (type == 3 && timeAccumulator <= 1000) { return 1; }
		if (type == 3 && timeAccumulator > 1000 && timeAccumulator <= 1200) { return 2; }
		if (type == 3 && timeAccumulator > 1200 && timeAccumulator <= 1300) { return 3; }
		if (type == 3 && timeAccumulator > 1300 && timeAccumulator <= 2300) { return 4; }
		if (type == 3 && timeAccumulator > 2300 && timeAccumulator <= 2400) { return 5; }
		if (type == 3 && timeAccumulator > 2300) { return 6; }

		return 1;
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


	function ballProjectile(spec) {
		let that = {};
		that.alive = true;
		that.center = { x: spec.center.x, y: spec.center.y };
		that.damage = spec.damage;
		that.destination = { x: spec.target.center.x, y: spec.target.center.y };
		that.lifeTime = 3000;
		that.rate = spec.rate;
		that.target = spec.target;
		let image = Game.assets['type1'];
		let xCalc = that.target.center.x - that.center.x;
		let yCalc = that.target.center.y - that.center.y;
		let distance = Math.sqrt(Math.pow(xCalc, 2) + Math.pow(yCalc, 2));

		that.draw = function () {
			if (!that.alive) { return; }
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.rotate(that.rotation);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(image, that.center.x - 1.5, that.center.y - 1.5, 3, 3);
			gameCtx.restore();
		}

		that.update = function (elapsedTime) {
			that.lifeTime -= elapsedTime;
			if (that.lifeTime <= 0) { that.alive = false; return; }
			let xDist = that.target.center.x - that.center.x;
			let yDist = that.target.center.y - that.center.y;
			distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
			if (distance < 20) {
				that.target.hp -= that.damage;
				that.alive = false;
				return;
			}

			that.center.x += xCalc * that.rate / 1000;
			that.center.y += yCalc * that.rate / 1000;
		}


		return that;
	}

	function bombProjectile(spec) {
		let that = {};
		that.alive = true;
		that.center = { x: spec.center.x, y: spec.center.y };
		that.damage = spec.damage;
		that.destination = { x: spec.target.center.x, y: spec.target.center.y };
		that.lifeTime = 3000;
		that.rate = spec.rate;
		that.target = spec.target;
		let image = Game.assets['bomb'];
		let xCalc = that.target.center.x - that.center.x;
		let yCalc = that.target.center.y - that.center.y;
		let distance = Math.sqrt(Math.pow(xCalc, 2) + Math.pow(yCalc, 2));

		that.draw = function () {
			if (!that.alive) { return; }
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.rotate(that.rotation);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(image, that.center.x - 1.5, that.center.y - 1.5, 3, 3);
			gameCtx.restore();
		}

		that.update = function (elapsedTime) {
			that.lifeTime -= elapsedTime;
			if (that.lifeTime <= 0) { that.alive = false; return; }
			let xDist = that.target.center.x - that.center.x;
			let yDist = that.target.center.y - that.center.y;
			distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
			if (distance < 20) {
				that.target.hp -= that.damage;
				that.alive = false;
				return;
			}

			that.center.x += xCalc * that.rate / 1000;
			that.center.y += yCalc * that.rate / 1000;
		}


		return that;
	}

	function rocketProjectile(spec) {
		let that = {};
		that.alive = true;
		that.center = { x: spec.center.x, y: spec.center.y };
		that.damage = spec.damage;
		that.destination = { x: spec.target.center.x, y: spec.target.center.y };
		that.lifeTime = 3000;
		that.rotation = spec.rotation;
		that.rate = spec.rate;
		that.target = spec.target;
		let image = Game.assets['rocket'];
		let xCalc = that.target.center.x - that.center.x;
		let yCalc = that.target.center.y - that.center.y;
		let distance = Math.sqrt(Math.pow(xCalc, 2) + Math.pow(yCalc, 2));

		that.draw = function () {
			if (!that.alive) { return; }
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.rotate(that.rotation);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(image, that.center.x - 1.5, that.center.y - 1.5, 3, 3);
			gameCtx.restore();
		}

		that.update = function (elapsedTime) {
			that.lifeTime -= elapsedTime;
			if (that.lifeTime <= 0) { that.alive = false; return; }
			let xDist = that.target.center.x - that.center.x;
			let yDist = that.target.center.y - that.center.y;
			distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
			if (distance < 20) {
				that.target.hp -= that.damage;
				that.alive = false;
				return;
			}

			that.center.x += xCalc * that.rate / 1000;
			that.center.y += yCalc * that.rate / 1000;
		}


		return that;
	}

	function missileProjectile(spec) {
		let that = {};
		that.alive = true;
		that.center = { x: spec.center.x, y: spec.center.y };
		that.damage = spec.damage;
		that.destination = { x: spec.target.center.x, y: spec.target.center.y };
		that.lifeTime = 3000;
		that.rotation = spec.rotation;
		that.rate = spec.rate;
		that.target = spec.target;
		let image = Game.assets['missile'];
		let xCalc = that.target.center.x - that.center.x;
		let yCalc = that.target.center.y - that.center.y;
		let distance = Math.sqrt(Math.pow(xCalc, 2) + Math.pow(yCalc, 2));

		that.draw = function () {
			if (!that.alive) { return; }
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.rotate(that.rotation);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(image, that.center.x - 1.5, that.center.y - 1.5, 3, 3);
			gameCtx.restore();
		}

		that.update = function (elapsedTime) {
			that.lifeTime -= elapsedTime;
			if (that.lifeTime <= 0) { that.alive = false; return; }
			let xDist = that.target.center.x - that.center.x;
			let yDist = that.target.center.y - that.center.y;
			distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
			if (distance < 20) {
				that.target.hp -= that.damage;
				that.alive = false;
				return;
			}

			that.center.x += xCalc * that.rate / 1000;
			that.center.y += yCalc * that.rate / 1000;
		}


		return that;
	}

	function resetCreepSeq(type, index) {
		if ((type == 1 || type == 2) && index == 4) { return true; }
		if (type == 3 && index == 6) { return true; }
		return false;
	}

	function tower(spec) {
		let that = {};

		that.angle = 0;
		that.center = { x: spec.center.x, y: spec.center.y };
		that.cost = 50;
		that.fireRate = spec.fireRate;
		that.level = 1;
		that.damage = that.level * 10;

		that.range = 150;
		that.rotationRate = 25 * Math.PI / 1000

		that.selected = false;
		that.type = spec.type
		that.weapon = getWeapon(spec.type, that.level);
		let arcDraw = false;
		that.target = 0;
		that.targetDist = 1500;
		let shotTimer = 0;


		that.setTarget = function (creeps) {
			that.targetDist = 1500;
			that.target = undefined;
			if (creeps.length < 1) { target = undefined; return; }
			for (let i = 0; i < creeps.length; i++) {
				if (typeof creeps[i] !== 'object') {
					continue;
				}
				let creep = creeps[i];
				let xCalc = that.center.x - creep.center.x;
				let yCalc = that.center.y - creep.center.y;
				let distance = Math.sqrt(Math.pow(xCalc, 2) + Math.pow(yCalc, 2));
				if (distance < that.targetDist && that.type <= 2 && creeps[i].type <=2 ) { //ground units shoot ground targets
					that.targetDist = distance;
					that.target = creeps[i];
				}
				if (distance < that.targetDist && that.type > 2 && creeps[i].type  == 3) {// air units shoot air targets
					that.targetDist = distance;
					that.target = creeps[i];
				}
			}
		}

		that.fire = function (elapsedTime, projectiles) {
			shotTimer -= elapsedTime
			if (that.targetDist <= that.range && shotTimer <= 0) {
				shotTimer = 750;
				let destX = that.target.center.x;
				let destY = that.target.center.y;
				if (that.type == 1) {
					projectiles.push(ballProjectile({
						center: { x: that.center.x, y: that.center.y },
						damage: that.damage,
						destination: { x: destX, y: destY },
						radius: 3,
						rate: 100,
						target: that.target
					}));
				}
				if (that.type == 2) {
					projectiles.push(bombProjectile({
						center: { x: that.center.x, y: that.center.y },
						damage: that.damage,
						destination: { x: destX, y: destY },
						radius: 3,
						rate: 100,
						target: that.target
					}));
				}
				if (that.type == 3) {
					projectiles.push(rocketProjectile({
						center: { x: that.center.x, y: that.center.y },
						damage: that.damage,
						destination: { x: destX, y: destY },
						radius: 3,
						rate: 100,
						target: that.target
					}));
				}
				if (that.type == 4) {
					projectiles.push(missileProjectile({
						center: { x: that.center.x, y: that.center.y },
						damage: that.damage,
						destination: { x: destX, y: destY },
						radius: 3,
						rate: 100,
						target: that.target
					}));
				}
			}
		}

		that.draw = function () {
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(base, that.center.x - gridSize / 2, that.center.y - gridSize / 2, gridSize, gridSize);
			gameCtx.restore();
			gameCtx.save();
			gameCtx.translate(that.center.x, that.center.y);
			gameCtx.rotate(that.angle);
			gameCtx.translate(-that.center.x, -that.center.y);
			gameCtx.drawImage(that.weapon, that.center.x - gridSize / 2, that.center.y - gridSize / 2, gridSize, gridSize);
			gameCtx.restore();
			if (that.selected) {
				drawSelectedBox({ x: that.center.x - gridSize / 2, y: that.center.y - gridSize / 2, canvas: 'game' });
			}
			if (arcDraw) {
				that.drawArc();
			}
		}

		that.drawArc = function () {
			gameCtx.fillStyle = 'rgba(0, 255, 255, 0.10)';
			gameCtx.beginPath();
			gameCtx.moveTo(that.center.x, that.center.y);
			gameCtx.arc(that.center.x, that.center.y, that.range, 0, 2 * Math.PI, true);
			gameCtx.lineTo(spec.center.x, spec.center.y);
			gameCtx.fill();
		}

		that.upgrade = function () {
			if (level < 3) {
				that.level++;
				that.damage = that.level * 10;
				that.fireRate -= 250;
				that.range += 50;
				that.weapon = getWeapon(that.type, that.level)
			}
		}

		that.update = function (elapsedTime, drawArcs, creeps, projectiles, go) {
			arcDraw = drawArcs;

			if (!typeof that.target === 'undefined' && that.target.finished) { that.target = 'undefined'; }
			that.setTarget(creeps);
			if (typeof that.target === 'undefined') { return; }
			let result = Helper.computeAngle(that.angle, that.center, that.target.center);
			if (Helper.testTolerance(result.angle, 0, .03) === false) {
				if (result.crossProduct > 0) {
					that.angle += that.rotationRate;
				} else {
					that.angle -= that.rotationRate;
				}
			}

			if (that.targetDist <= that.range && go) { that.fire(elapsedTime, projectiles) }
		}

		return that;
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
