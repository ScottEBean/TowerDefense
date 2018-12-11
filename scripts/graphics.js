// ------------------------------------------------------------------
// This is the graphics object.  The various rendering components
// are located here.
// ------------------------------------------------------------------
Game.graphics = (function () {

	let backCanvas = document.getElementById('backgroundCanvas');
	let backCtx = backCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameCtx = gameCanvas.getContext('2d');
	let menuCanvas = document.getElementById('menuCanvas');
	let menuCtx = menuCanvas.getContext('2d');
	let gridSize = 50;
	let cyanStrokeFill = 'rgba(0, 208, 208, 1)';

	//------------------------------------------------------------------
	// Public function that allows the client code to clear the canvas.
	//------------------------------------------------------------------
	function airCreep(spec) {
		that = {};
		that.center = { x: spec.center.x, y: spec.center.y };
		var img = new Image(50, 50);

		that.draw = function () {

		}
		return that;
	}

	function airTowerA(spec) {
		that = {};
		var center = { x: spec.center.x, y: spec.center.y };
		var img = new Image(50, 50);
		var level = 1;
		var cost = level * 50;
		var damage = level * 10;

		return that;
	}

	function airTowerB(spec) {
		that = {};
		var center = { x: spec.center.x, y: spec.center.y };
		var img = new Image(50, 50);
		var level = 1;
		var cost = level * 50;
		var damage = level * 10;

		return that;
	}	
	
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
		drawBackgroundBorder();
	}

	function clearMenuText(){
		menuCtx.save();
		menuCtx.setTransform(1, 0, 0, 1, 0, 0);
		menuCtx.clearRect(0, 50, menuCanvas.width, menuCanvas.height);
		menuCtx.restore();
	}

	function drawBackground() {
		drawBackgroundBorder();
	}
	
	function drawBackgroundBorder(){
		var xm = gameCanvas.width/2 + 250; 
		var xw = backCanvas.width;
		var ym = backCanvas.height/2;
		var yh = backCanvas.height;
		backCtx.save();
		backCtx.beginPath();
		backCtx.moveTo(250, ym - gridSize/2); 
		backCtx.lineTo(250, 0);
		backCtx.lineTo(xm - gridSize/2, 0); 
		backCtx.moveTo(xm + gridSize/2, 0); 
		backCtx.lineTo(xw, 0); 
		backCtx.lineTo(xw, ym - gridSize/2); 
		backCtx.moveTo(xw, ym + gridSize/2); 
		backCtx.lineTo(xw, yh); 
		backCtx.lineTo(xm + gridSize / 2, yh); 
		backCtx.moveTo(xm - gridSize / 2, yh); 
		backCtx.lineTo(250, yh); 
		backCtx.lineTo(250, ym + gridSize/2); 

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

	function drawScore(score) {
		menuCtx.font = '15px Roboto';
		menuCtx.fillStyle = cyanStrokeFill;
		var scoreText = '$ ' + score;		
		menuCtx.fillText(scoreText, 10, gameCanvas.height - 10);
	}

	function drawLives(lives){
		menuCtx.font = '15px Roboto';
		menuCtx.fillStyle = cyanStrokeFill;
		var livesText = 'Lives: ' + lives;
		var textWidth = menuCtx.measureText(livesText).width + 10;
		menuCtx.fillText(livesText, 250 - textWidth, menuCanvas.height - 10);
	}	

	function groundCreepA(spec){
		that = {};
		var center = { x: spec.center, y: spec.center };
		var img = new Image(50, 50);
		return that;
	}

	function groundCreepB(spec) {
		that = {};
		var center = { x: spec.center, y: spec.center };
		var img = new Image(50, 50);
		return that;
	}

	function groundTowerA(spec) {
		that = {};
		var center = { x: spec.center, y: spec.center };
		var img = new Image(50, 50);
		var level = 1;
		var cost = level * 50;
		var damage = level * 10;

		return that;
	}

	function groundTowerB(spec){
		that = {};
		var center = { x: spec.center, y: spec.center };
		var img = new Image(50, 50);
		var level = 1;
		var cost = level * 50;
		var damage = level * 10;

		return that;
	}


	return {
		airCreep: airCreep,
		airTowerA: airTowerA,
		airTowerB: airTowerB,		
		clear: clear,
		clearBackground: clearBackground,
		clearMenuText: clearMenuText,
		drawBackground: drawBackground,
		drawBackgroundBorder: drawBackgroundBorder,
		drawGrid: drawGrid,
		drawLives: drawLives,
		drawScore: drawScore,
		groundCreepA: groundCreepA,
		groundCreapB: groundCreepB,
		groundTowerA: groundTowerA,
		grountTowerB: groundTowerB,
	};

}());
