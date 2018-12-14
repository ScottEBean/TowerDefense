







if (that.direction == 'up' && Math.abs(cellY - Py) < 5) {
  if (dir == 'lt') { that.rotation = -Math.PI / 2; that.center.x -= that.moveRate / 1000; that.direction = 'lt'; }
  if (dir == 'rt') { that.rotation = Math.PI / 2; that.center.x += that.moveRate / 1000; that.direction = 'rt'; }
}
if (that.direction == 'dn' && Math.abs(cellY - Py) < 5) {
  if (dir == 'lt') { that.rotation = Math.PI / 2; that.center.x -= that.moveRate / 1000; that.direction = 'lt'; }
  if (dir == 'rt') { that.rotation = -Math.PI / 2; that.center.x += that.moveRate / 1000; that.direction = 'rt'; }
}
if (that.direction == 'lt' && Math.abs(cellX - Px) < 5) {
  if (dir == 'up') { that.rotation = Math.PI / 2; that.center.y -= that.moveRate / 1000; that.direction = 'up'; }
  if (dir == 'dn') { that.rotation = -Math.PI / 2; that.center.y += that.moveRate / 1000; that.direction = 'dn'; }
}
if (that.direction == 'rt' && Math.abs(cellX - Px) < 5) {
  if (dir == 'up') { that.rotation = 0 - Math.PI / 2; that.center.y -= that.moveRate / 1000; that.direction = 'up'; }
  if (dir == 'dn') { that.rotation = Math.PI / 2; that.center.y += that.moveRate / 1000; that.direction = 'dn'; }
}

function calculateDirection(path, row, col) {


  let nextDir = null;
  let nextMin = 225

  if (row - 1 >= 0 && path[row - 1][col] < nextMin) {
    nextMin = path[row - 1][col];
    nextDir = 'up';
  }
  if (row + 1 <= 14 && path[row + 1][col] < nextMin) {
    nextMin = path[row + 1][col];
    nextDir = 'dn';
  }
  if (col - 1 >= 0 && path[row][col - 1] < nextMin) {
    nextMin = path[row][col - 1];
    nextDir = 'lt';
  }
  if (col + 1 <= 14 && path[row][col + 1] < nextMin) {
    nextMin = path[row][col + 1];
    nextDir = 'rt';
  }

  return nextDir;
}


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