// ------------------------------------------------------------------
// This is the graphics object.  The various rendering components
// are located here.
// ------------------------------------------------------------------
Game.graphics = (function () {

	let bgndCanvas = document.getElementById('backgroundCanvas');
	let bgndCtx = bgndCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameCtx = gameCanvas.getContext('2d');
	let topLayerCanvas = document.getElementById('topLayerCanvas');
	let topLayerCtx = topLayerCanvas.getContext('2d');
	let gridSize = 50;
	let cyanStrokeFill = 'rgba(0, 208, 208, 1)';

	//------------------------------------------------------------------
	// Public function that allows the client code to clear the canvas.
	//------------------------------------------------------------------
	function clear() {
		gameCtx.save();
		gameCtx.setTransform(1, 0, 0, 1, 0, 0);
		gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		gameCtx.restore();
	}

	function clearTopLayer() {
		topLayerCtx.save();
		topLayerCtx.setTransform(1, 0, 0, 1, 0, 0);
		topLayerCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerCtx.restore();
	}

	function drawBgnd() {
		drawBgndBorder();
	}
	
	function drawBgndBorder(){
		var x0 = bgndCanvas.width/4; // 250
		var xm = (bgndCanvas.width - x0)/2 + x0; // 625
		var xw = bgndCanvas.width;
		var ym = (bgndCanvas.height)/2;
		var yh = bgndCanvas.height;
		//bgndCtx.save();
		bgndCtx.beginPath();
		bgndCtx.moveTo(x0, yh/2 - gridSize/2); // 250,350
		bgndCtx.lineTo(x0, 0)/ // 250,0
		bgndCtx.lineTo(xm - gridSize/2, 0); // 600,0
		bgndCtx.moveTo(xm + gridSize/2, 0); // 650,0
		bgndCtx.lineTo(xw, 0); // 1000,0
		bgndCtx.lineTo(xw, ym - gridSize/2); // 1000,350
		bgndCtx.moveTo(xw, ym + gridSize/2); // 1000,400
		bgndCtx.lineTo(xw, yh); // 1000,750
		bgndCtx.lineTo(xm + gridSize / 2, yh); // 650,750
		bgndCtx.moveTo(xm - gridSize / 2, yh); // 600,750
		bgndCtx.lineTo(x0, yh); // 250,750
		bgndCtx.lineTo(x0, ym + gridSize/2); // 250,400

		bgndCtx.lineWidth = 5;
		bgndCtx.strokeStyle = cyanStrokeFill;
		bgndCtx.stroke();
		//bgndCtx.restore();
	}

	function drawGrid() {
		gameCtx.save();
		bgndCtx.beginPath();
		gameCtx.setLineDash([1, 10]);
		//draw Vertical grid lines
		for (var i = gameCanvas.width / 4; i <= gameCanvas.width; i += gridSize) {
			gameCtx.moveTo(i, 0);
			gameCtx.lineTo(i, gameCanvas.height);
		}

		//draw horizontal grid lines
		for (var i = 0; i <= gameCanvas.height; i += gridSize) {
			gameCtx.moveTo(gameCanvas.width / 4, i);
			gameCtx.lineTo(gameCanvas.width, i);
		}

		gameCtx.lineWidth = 1;
		gameCtx.strokeStyle = 'rgba(0, 208, 208, .025)';
		gameCtx.stroke();
		gameCtx.setLineDash([]);
		gameCtx.restore();
	}

	function drawScore(score) {
		gameCtx.font = '15px Roboto';
		gameCtx.fillStyle = cyanStrokeFill;
		var scoreText = '$ ' + score;
		var textWidth = gameCtx.measureText(scoreText).width + 10;
		gameCtx.fillText(scoreText, 10, gameCanvas.height - 10);
	}

	function drawLives(lives){
		gameCtx.font = '15px Roboto';
		gameCtx.fillStyle = cyanStrokeFill;
		var livesText = 'Lives: ' + lives;
		var textWidth = gameCtx.measureText(livesText).width + 10;
		gameCtx.fillText(livesText, 250 - textWidth, gameCanvas.height - 10);
	}

	function airCreep(spec){
		that = {};
		var center = { x: spec.center, y: spec.center };
		var img = new Image(50, 50);
		return that;
	}

	function airTower(spec){
		that = {};
		var center = {x: spec.center, y: spec.center};
		var img = new Image(50, 50);
		var level = 1;
		var cost = level * 50;
		var damage = level * 10;

		return that;
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


	function groundTower(spec) {
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
		airTower: airTower,
		clear: clear,
		clearTopLayer: clearTopLayer,
		drawBgnd: drawBgnd,
		drawBgndBorder: drawBgndBorder,
		drawGrid: drawGrid,
		drawLives: drawLives,
		drawScore: drawScore,
		groundCreepA: groundCreepA,
		groundCreepB: groundCreepB,
		groundTower: groundTower,
	};

}());
