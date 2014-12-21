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
  
  var makeItem = function (x, y, z) {
    var item = new THREE.Mesh(geometry, material);

    item.position.x = x;
    item.position.y = y;
    item.position.z = z;

    item.cubeInfo = [x, y, z];

    scene.add(item);

    cubes.push(item);
  };

  var x, y, z;
  var spacing = size * 1.2;
  var CUBES_PER_AXIS = 3;

  applyColorsToGeometry(geometry);

  for (x = 0; x < CUBES_PER_AXIS; x++) {
    for(y = 0; y < CUBES_PER_AXIS; y++) {
      for(z = 0; z < CUBES_PER_AXIS; z++) {
        makeItem(
          Math.ceil(x / 2) * spacing * ((x % 2 === 0) ? 1 : -1),
          Math.ceil(y / 2) * spacing * ((y % 2 === 0) ? 1 : -1),
          Math.ceil(z / 2) * spacing * ((z % 2 === 0) ? 1 : -1)
        );
      }  
    }  
  }

  return cubes;
}());


var Plane = function (cubes) {
  this.cubes = cubes;
};

Plane.prototype.info = function () {
  var cubeInfo = [];
  this.cubes.forEach(function (cube) {
    // cubes.push(cube.cubeInfo.join(','));
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

    matrix.makeRotationZ(amount);
    this.cubes.forEach(function (cube) {
      cube.applyMatrix(matrix);
    });
};

var getPlane = function (x, y, z) {
  return new Plane([
    cubes[1],
    cubes[4],
    cubes[7],
    cubes[10],
    cubes[13],
    cubes[16],
    cubes[19],
    cubes[22],
    cubes[25]
  ]);
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