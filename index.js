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

// make some items
(function () {
  var size = 0.8;
  var geometry = new THREE.BoxGeometry(size, size, size);
  var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  
  var makeItem = function (x, y, z) {
    var item = new THREE.Mesh(geometry, material);

    item.position.x = x;
    item.position.y = y;
    item.position.z = z;

    scene.add(item);
  };

  var x, y, z;
  var spacing = size * 2.5;
  var max = 3;

  for (x = 0; x < max; x++) {
    for(y = 0; y < max; y++) {
      for(z = 0; z < max; z++) {
        makeItem(
          Math.ceil(x / 2) * spacing * ((x % 2 === 0) ? 1 : -1),
          Math.ceil(y / 2) * spacing * ((y % 2 === 0) ? 1 : -1),
          Math.ceil(z / 2) * spacing * ((z % 2 === 0) ? 1 : -1)
        );
      }  
    }  
  }
}());



// camera.position.y = 3;
camera.position.z = 20;
// camera.lookAt(0, 0, 0);


function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  m1.makeRotationX(cameraSpeed.x);
  m2.makeRotationY(cameraSpeed.y);
  // m3.makeRotationZ(cameraSpeed.z);

  matrix.multiplyMatrices(m1, m2);
  // matrix.multiply(m3);

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