var leftPath = new Array(15);
var topPath = new Array(15);
var grid = new Array(15);

function createGrid() {
  for (var i = 0; i < 15; i++) {
    grid[i] = new Array(15);
    leftPath[i] = new Array(15);
    topPath[i] = new Array(15);
  }

  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15, j++) {
      grid[i][j] = 0;
      top[i][j] = 0;
      leftPath[i][j] = 0;
    }
  }

  topPath[7][14] = 0;
  leftPath[14][7] = 0;
}


function createPath(path, endpoint) {
  var frontier = [];

  frontier.push(endpoint);

  while (frontier.length != 0) {

    var currentCell

    //check up
    if (path[i+1][j] > 1) {
      frontier.push()
    }
  }
}

function createUDPath() {

}



createQueue.push(graphics.tower({
  center: { x: e.clientX, y: e.clientY },
  rotation: 0,
  weapon: Game.assets['tower11'],
  fireRate: 1000
}));