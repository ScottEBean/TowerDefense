// ------------------------------------------------------------------
// This is the graphics object.  The various rendering components
// are located here.
// ------------------------------------------------------------------
Game.graphics = (function () {

	let backgroundCanvas = document.getElementById('backgroundCanvas');
	let backgroundContext = backgroundCanvas.getContext('2d');
	let gameCanvas = document.getElementById('gameCanvas');
	let gameContext = gameCanvas.getContext('2d');
	let topLayerCanvas = document.getElementById('topLayerCanvas');
	let topLayerContext = topLayerCanvas.getContext('2d');
	
	//------------------------------------------------------------------
	// Public function that allows the client code to clear the canvas.
	//------------------------------------------------------------------
	function clear() {
		gameContext.save();
		gameContext.setTransform(1, 0, 0, 1, 0, 0);
		gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		gameContext.restore();
	}

	function clearTopLayer() {
		topLayerContext.save();
		topLayerContext.setTransform(1, 0, 0, 1, 0, 0);
		topLayerContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.restore();
	}

	function drawBackground() {
		backgroundContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		backgroundContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		backgroundContext.fillStyle = 'red';
	}

	function setCountdownTextProperties() {
		topLayerContext.font = '45px Roboto';
		topLayerContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		topLayerContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.fillStyle = '#00d0d0';
	}

	function setScoreTextProps() {
		gameContext.font = '15px Roboto';
		gameContext.fillStyle = '#00d0d0';
	}

	function setLargeTextProperties() {
		topLayerContext.font = '125px Roboto';
		topLayerContext.fillStyle = "rgba(0, 0, 0, 0.25)";
		topLayerContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		topLayerContext.fillStyle = '#00d0d0';
	}

	function drawText(text, x, y) {
		topLayerContext.fillText(text, x, y);

		// This was used to set the correct x coordinate for text.
		// For no conceivable reason text is drawn from the x: left y: bottom
		// or x: left y:middle of the character/string
		//console.log(topContext.measureText(text));
	}

	function drawScore(score) {
		setScoreTextProps();
		var scoreText = 'Score: ' + score;
		var textWidth = gameContext.measureText(scoreText).width + 10;
		gameContext.fillText(scoreText, gameCanvas.width - textWidth, gameCanvas.height - 10);
	}

	function intersection(r1l, r1r, r1t, r1b, r2l, r2r, r2t, r2b) {
		return !(r2l > r1r ||
			r2r < r1l ||
			r2t > r1b ||
			r2b < r1t);
	}

	function BlocksIntersect(blockArr, x, y) {
		if (blockArr.length == 0) { return false; }
		for (let i = 0; i < blockArr.length; i++) {
			var r1 = blockArr[i].getCoords();
			if (intersection(r1.x, r1.x + BLOCKSIZE, r1.y, r1.y + BLOCKSIZE, x, x + BLOCKSIZE, y, y + BLOCKSIZE)) {
				return true;
			}
		}
		return false;
	}


	

	

	return {
		drawBackground: drawBackground,
		drawScore: drawScore,
		setCountdownTextProperties: setCountdownTextProperties,
		setLargeTextProperties: setLargeTextProperties,
		drawText: drawText,
		clearTopLayer: clearTopLayer,
		clear: clear,		
	};

}());
