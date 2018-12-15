let Path = (function () {
  'use strict';

  function updateGrid(grid, endpoint) {
    let pathGrid = new Array(15);

    for (let i = 0; i < grid.length; i++) { pathGrid[i] = new Array(15); }
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        pathGrid[i][j] = grid[i][j];
      }
    }

    let frontier = [];
    let first = getIndices(endpoint);
    frontier.push({ x: first.col, y: first.row });

    pathGrid[first.row][first.col] = 0;

    //this is what happens when you pull all nighters
    while (frontier.length != 0) {
      first = frontier.shift();
      //up
      if (first.x != 0) {
        if (pathGrid[first.y][first.x - 1] != 1500 && pathGrid[first.y][first.x - 1] > pathGrid[first.y][first.x] + 1) {
          pathGrid[first.y][first.x - 1] = pathGrid[first.y][first.x] + 1;
          frontier.push({ y: first.y, x: first.x - 1 });
        }
      }
      //down
      if (first.x != pathGrid.length - 1) {
        if (pathGrid[first.y][first.x + 1] != 1500 && pathGrid[first.y][first.x + 1] > pathGrid[first.y][first.x] + 1) {
          pathGrid[first.y][first.x + 1] = pathGrid[first.y][first.x] + 1;
          frontier.push({ y: first.y, x: first.x + 1 });
        }
      }
      //left
      if (first.y != 0) {
        if (pathGrid[first.y - 1][first.x] != 1500 && pathGrid[first.y - 1][first.x] > pathGrid[first.y][first.x] + 1) {
          pathGrid[first.y - 1][first.x] = pathGrid[first.y][first.x] + 1;
          frontier.push({ y: first.y - 1, x: first.x });
        }
      }
      //right
      if (first.y != pathGrid.length - 1) {
        if (pathGrid[first.y + 1][first.x] != 1500 && pathGrid[first.y + 1][first.x] > pathGrid[first.y][first.x] + 1) {
          pathGrid[first.y + 1][first.x] = pathGrid[first.y][first.x] + 1;
          frontier.push({ y: first.y + 1, x: first.x });
        }
      }
    }

    return pathGrid;
  }

  //blarg I've been awake for 24 hours straight
  // Oh no I'm running into walls now.
  function getPath(grid, position, endpoint) {
    let path = [];
    let current = getIndices(position);
    let final = getIndices(endpoint);
    path.push(getCoords({ y: current.row, x: current.col }));
    let min = 1500;

    while (min > 0) {
      min = grid[current.row][current.col];

      if (current.col + 1 < 15 && grid[current.row][current.col + 1] < min) {
        path.push(getCoords({ y: current.row, x: current.col + 1 }));
      }
      else if (current.row + 1 < 15 && grid[current.row + 1][current.col] < min) {
        path.push(getCoords({ y: current.row + 1, x: current.col }));
      }
      else if (current.col - 1 > 0 && grid[current.row][current.col - 1] < min) {
        path.push(getCoords({ y: current.row, x: current.col - 1 }));
      }
      else if (current.row - 1 > 0 && grid[current.row - 1][current.col] < min) {
        path.push(getCoords({ y: current.row - 1, x: current.col }));
      }
      current = getIndices(path[path.length - 1]);      
    }

    return path;
  }

  function getCoords(cell) {
    return { x: cell.x * 50 + 25, y: cell.y * 50 + 25 };
  }

  function getIndices(point) {
    let Px = Math.floor(point.x);
    let Py = Math.floor(point.y);
    Px -= Px % 50;
    Py -= Py % 50;
    let xIndex = Px / 50;
    let yIndex = Py / 50;

    return { col: xIndex, row: yIndex }
  }

  return {
    updateGrid: updateGrid,
    getPath: getPath
  };

}());