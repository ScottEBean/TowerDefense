







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