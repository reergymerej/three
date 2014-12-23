var quarterTurn = function (coords, axis, counter) {
  var negate;

  var turned = {};

  if (axis === 'z') {
    turned = {
      x: coords.y,
      y: coords.x,
      z: coords.z
    };

    negate = counter ? 'x' : 'y';

  } else if (axis === 'x') {
    turned = {
      x: coords.x,
      y: coords.z,
      z: coords.y
    };

    negate = counter ? 'y' : 'z';

  } else if (axis === 'y') {
    turned = {
      x: coords.z,
      y: coords.y,
      z: coords.x
    };

    negate = counter ? 'z' : 'x';

  }
  
  turned[negate] *= -1;

  return turned;
};

// ================================================
var assert = require('assert');
var coords;

coords = quarterTurn({ x: -7, y: -9 }, 'z');
assert.equal(coords.x, -9);
assert.equal(coords.y, 7);

coords = quarterTurn({ x: 2, y: 3 }, 'z', true);
assert.equal(coords.x, -3);
assert.equal(coords.y, 2);

coords = quarterTurn({ y: 1, z: -3 }, 'x');
assert.equal(coords.z, -1);
assert.equal(coords.y, -3);

coords = quarterTurn({ y: -3, z: -1 }, 'x', true);
assert.equal(coords.z, -3);
assert.equal(coords.y, 1);

coords = quarterTurn({ x: 3, z: -1 }, 'y');
assert.equal(coords.z, 3);
assert.equal(coords.x, 1);

coords = quarterTurn({ x: 1, z: 3 }, 'y', true);
assert.equal(coords.z, -1);
assert.equal(coords.x, 3);