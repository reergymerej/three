var CUBES_PER_AXIS = 3;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var matrix = new THREE.Matrix4();
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

var cameraSpeed = {
  rate: 0.01,
  x: 0,
  y: 0,
  z: 0
};

var m1 = new THREE.Matrix4();
var m2 = new THREE.Matrix4();
var m3 = new THREE.Matrix4();

var isEven = function (x) {
  return x % 2 === 0;
};

/**
* Get the G series number at index i.
* @param {Number} i
* @return {Number}
*/
var indexToG = function (i) {
  var g = 0;

  if (i > 0) {
    g = Math.floor(i / 2);

    if (isEven(i)) {
      g *= -1;
    } else {
      g += 1;
    }
  }

  return g;
};

/**
* Get the index of a number in the G series.
* @param {Number} g
* @return {Number}
*/
var gToIndex = function (g) {
  var i = 0;

  if (g !== 0) {
    if (g < 0) {
      i = Math.abs(g + g);
    } else {
      i = g * 2 - 1;
    }
  }

  return i;
};

// make the cubes

var cubes = (function () {
  var size = 0.8;
  var geometry = new THREE.BoxGeometry(size, size, size);

  var applyColorsToGeometry = function (geometry) {
    var colors = [
      // blue
      new THREE.Color(0, 0, 1),
      // green
      new THREE.Color(0x29dd00),
      // white
      new THREE.Color(1, 1, 1),
      // yellow
      new THREE.Color(0xffff00),
      // red
      new THREE.Color(1, 0, 0),
      // orange
      new THREE.Color(1, 0.5, 0),
    ];

    var i = 0;
    var max = geometry.faces.length / 2;

    for (; i < max; i++) {
      geometry.faces[i * 2].color = colors[i];
      geometry.faces[i * 2 + 1].color = colors[i];
    }
  };

  var material = new THREE.MeshBasicMaterial({
    // wireframe: true,
    vertexColors: THREE.VertexColors
  });

  var cubes = [];
  
  var makeItem = function (gx, gy, gz) {
    var item = new THREE.Mesh(geometry, material);

    var x = gx * spacing;
    var y = gy * spacing;
    var z = gz * spacing;

    item.cubeInfo = {
      x: gx,
      y: gy,
      z: gz
    };

    item.position.x = x;
    item.position.y = y;
    item.position.z = z;

    scene.add(item);

    cubes.push(item);
  };

  var x, y, z;
  var spacing = size * 1.2;
  var gx, gy, gz;

  applyColorsToGeometry(geometry);


  for (x = 0; x < CUBES_PER_AXIS; x++) {
  // for (x = 0; x < 1; x++) {
    gx = indexToG(x);
    
    for (y = 0; y < CUBES_PER_AXIS; y++) {
    // for (y = 0; y < 1; y++) {
      gy = indexToG(y);
      
      for (z = 0; z < CUBES_PER_AXIS; z++) {
        gz = indexToG(z);

        makeItem(gx, gy, gz);
      }  
    }  
  }

  return cubes;
}());


var Plane = function (cubes, rotationAxis) {
  this.cubes = cubes;
  this.rotationAxis = rotationAxis;
  this.rotation = {
    x: 0,
    y: 0,
    z: 0
  };
};

Plane.prototype.info = function () {
  var cubeInfo = [];
  this.cubes.forEach(function (cube) {
    cubeInfo.push(cubes.indexOf(cube));
    console.log(cube.cubeInfo.x, cube.cubeInfo.y, cube.cubeInfo.z);
  });
  console.log(cubeInfo);
};

var quarterTurn = function (coords, axis, counter) {
  var negate;

  var turned = {};

  if (axis === 'z') {
    turned = {
      x: coords.y,
      y: coords.x,
      z: coords.z
    };

    // negate = counter ? 'x' : 'y';
    negate = counter ? 'y' : 'x';

  } else if (axis === 'x') {
    turned = {
      x: coords.x,
      y: coords.z,
      z: coords.y
    };

    // negate = counter ? 'y' : 'z';
    negate = counter ? 'z' : 'y';

  } else if (axis === 'y') {
    turned = {
      x: coords.z,
      y: coords.y,
      z: coords.x
    };

    // negate = counter ? 'z' : 'x';
    negate = counter ? 'x' : 'z';

  }
  
  turned[negate] *= -1;

  return turned;
};

Plane.prototype.rotate = function (amount, counter) {
    var matrix = new THREE.Matrix4();
    var updateCubeInfo;

    if (amount === undefined) {
      amount = Math.PI / 4;
    }

    if (counter) {
      amount *= -1;
    }

    switch (this.rotationAxis) {
      case 'x':
        matrix.makeRotationX(amount);
        break;
      case 'y':
        matrix.makeRotationY(amount);
        break;
      case 'z':
        matrix.makeRotationZ(amount);
        break;
    }

    this.rotation[this.rotationAxis] += amount;

    if (Math.abs(this.rotation[this.rotationAxis]) === Math.PI / 2) {
      updateCubeInfo = true;
    }

    this.cubes.forEach(function (cube) {
      cube.applyMatrix(matrix);
      if (updateCubeInfo) {
        cube.cubeInfo = quarterTurn(cube.cubeInfo, this.rotationAxis, counter);
      }
    }, this);

    if (updateCubeInfo) {
      this.rotation = {
        x: 0,
        y: 0,
        z: 0
      };
    }
};

var getPlane = function (rotationAxis, g) {
  var planeCubes = [];

  cubes.forEach(function (cube) {
    if (cube.cubeInfo[rotationAxis] === g) {
      planeCubes.push(cube);
    }
  });

  return new Plane(planeCubes, rotationAxis);
};

var Range = function (min, max) {
  this.min = min;
  this.max = max;
  this.length = max - min + 1;
};

/**
* Divide this range into sub-ranges and return
* the specified segment.  For range[1 - 12],
* getSegment(2, 3) -> range[5 - 8]
* getSegment(2, 4) -> range[4 - 6]
* @param {Number} segment the nth sub-range
* @param {Number} divisor how many segments to divide this range in to
* @return {Range}
*/
Range.prototype.getSegment = function (segment, divisor) {
  var segmentLength = this.length / divisor;
  var start = this.min + (segmentLength * (segment - 1));
  var end = start + segmentLength - 1;
  return new Range(start, end);
};

/**
* 
* @param {Number} gx
* @param {Number} gy
* @param {Number} gz
* @return {Cube}
*/
var getCubeByCoords = function (gx, gy, gz) {
  // The ranges must be queried in the same order they
  // were laid out in initially.
  // This is cool, but for simplicity (because rotating messes up the algorithm)
  // just loop through the cubes.
  // var xRange = (new Range(0, cubes.length - 1)).getSegment(gToIndex(gx) + 1, CUBES_PER_AXIS);
  // var yRange = xRange.getSegment(gToIndex(gy) + 1, CUBES_PER_AXIS);
  // var index = yRange.getSegment(gToIndex(gz) + 1, CUBES_PER_AXIS).min;

  var theCube;
  cubes.forEach(function (cube) {
    if (!theCube) {
      if (cube.cubeInfo.x === gx &&
        cube.cubeInfo.y === gy &&
        cube.cubeInfo.z === gz) {
        theCube = cube;
      }
    }
  });

  return theCube;
};

camera.position.z = 5;
camera.position.x = 3;
camera.position.y = 3;
camera.lookAt(new THREE.Vector3(0, 0, 0));

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  m1.makeRotationX(cameraSpeed.x);
  m2.makeRotationY(cameraSpeed.y);
  matrix.multiplyMatrices(m1, m2);

  camera.applyMatrix(matrix);
}
render();


// standard moves
var move = {
  R: function () {
    var plane = getPlane('x', indexToG(CUBES_PER_AXIS - 2));
    plane.rotate(undefined, true);
  },

  L: function () {
    var plane = getPlane('x', indexToG(CUBES_PER_AXIS - 1));
    plane.rotate();
  },

  U: function () {
    var plane = getPlane('y', indexToG(CUBES_PER_AXIS - 2));
    plane.rotate(undefined, true);
  },

  D: function () {
    var plane = getPlane('y', indexToG(CUBES_PER_AXIS - 1));
    plane.rotate();
  },

  F: function () {
    var plane = getPlane('z', indexToG(CUBES_PER_AXIS - 2));
    plane.rotate(undefined, true);
  },

  B: function () {
    var plane = getPlane('z', indexToG(CUBES_PER_AXIS - 1));
    plane.rotate();
  },
};


// ================================================
$('body').on('keydown', function (e) {
  var axis;
  var direction;
  var speed;

  switch (e.which) {
    case 37:
    case 38:
      direction = -1;
      break;
    case 39:
    case 40:
      direction = 1;
      break;

    case 82:
      move.R();
      break;
    case 76:
      move.L();
      break;
    case 85:
      move.U();
      break;
    case 68:
      move.D();
        break;
  }

  switch (e.which) {
    case 37:
    case 39:
      axis = 'y';
      break;
    case 38:
    case 40:
      axis = 'x';
      break;
  }

  if (axis && direction) {
    speed = cameraSpeed.rate * direction;
    cameraSpeed[axis] += speed;
  }
});