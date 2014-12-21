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
      gx: gx,
      gy: gy,
      gz: gz
    };

    item.position.x = x;
    item.position.y = y;
    item.position.z = z;

    scene.add(item);

    cubes.push(item);
  };

  var x, y, z;
  var spacing = size * 1.2;
  var CUBES_PER_AXIS = 3;
  var gx, gy, gz;

  applyColorsToGeometry(geometry);


  for (x = 0; x < CUBES_PER_AXIS; x++) {
    gx = indexToG(x);
    
    for(y = 0; y < CUBES_PER_AXIS; y++) {
      gy = indexToG(y);
      
      for(z = 0; z < CUBES_PER_AXIS; z++) {
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
};

Plane.prototype.info = function () {
  var cubeInfo = [];
  this.cubes.forEach(function (cube) {
    cubeInfo.push(cubes.indexOf(cube));
  });
  console.log(cubeInfo);
};

Plane.prototype.rotate = function (amount, counter) {
    var matrix = new THREE.Matrix4();

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

    this.cubes.forEach(function (cube) {
      cube.applyMatrix(matrix);
    });
};

var getPlane = function (x, y, z) {
  var planeCubes;
  var rotationAxis;

  if (typeof x === 'string') {
    switch (x) {
      case 'or':
        planeCubes = [
          cubes[1],
          cubes[4],
          cubes[7],
          cubes[10],
          cubes[13],
          cubes[16],
          cubes[19],
          cubes[22],
          cubes[25]
        ];
        rotationAxis = 'z';
        break;

      case 'r':
        planeCubes = [
          cubes[2],
          cubes[5],
          cubes[8],
          cubes[11],
          cubes[14],
          cubes[17],
          cubes[20],
          cubes[23],
          cubes[26]
        ];
        rotationAxis = 'z';
        break;

      case 'b':
        planeCubes = [
          cubes[18],
          cubes[19],
          cubes[20],
          cubes[21],
          cubes[22],
          cubes[23],
          cubes[24],
          cubes[25],
          cubes[26]
        ];
        rotationAxis = 'x';
        break;

      case 'g':
        planeCubes = [
          cubes[9],
          cubes[10],
          cubes[11],
          cubes[12],
          cubes[13],
          cubes[14],
          cubes[15],
          cubes[16],
          cubes[17]
        ];
        rotationAxis = 'x';
        break;     
    }
  }

  return new Plane(planeCubes, rotationAxis);
};

camera.position.z = 5;
camera.position.x = 5;
camera.position.y = 5;
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