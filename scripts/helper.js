var Helper = (function () {
  'use strict';
  //------------------------------------------------------------------
  // Returns the magnitude of the 2D cross product.  The sign of the
  // magnitude tells you which direction to rotate to close the angle
  // between the two vectors.
  //------------------------------------------------------------------
  function crossProduct2d(v1, v2) {
    return (v1.x * v2.y) - (v1.y * v2.x);
  }

  //------------------------------------------------------------------
  // Computes the angle, and direction (cross product) between two vectors.
  //------------------------------------------------------------------
  function computeAngle(rotation, ptCenter, ptTarget) {
    var v1 = {
      x: Math.cos(rotation),
      y: Math.sin(rotation)
    },
      v2 = {
        x: ptTarget.x - ptCenter.x,
        y: ptTarget.y - ptCenter.y
      },
      dp,
      cp,
      angle;

    v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    v2.x /= v2.len;
    v2.y /= v2.len;

    dp = v1.x * v2.x + v1.y * v2.y;
    angle = Math.acos(dp);

    // Get the cross product of the two vectors so we can know
    // which direction to rotate.
    cp = crossProduct2d(v1, v2);

    return {
      angle: angle,
      crossProduct: cp
    };
  }

  //------------------------------------------------------------------
  // Simple helper function to help testing a value with some level of tolerance.
  //------------------------------------------------------------------
  function testTolerance(value, test, tolerance) {
    if (Math.abs(value - test) < tolerance) {
      return true;
    } else {
      return false;
    }
  }


  return {
    crossProduct2d: crossProduct2d,
    computeAngle: computeAngle,
    testTolerance: testTolerance
  };

}());