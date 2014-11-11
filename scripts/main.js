"use strict";

/**
 * Slider constructor
 * @return {[type]} [description]
 */
$(function() {
    $( "#slider" ).slider({
    	value:1,
    	min:0,
    	max:10,
    	step:1,
    	slide:function (event, ui) {
    		$('.value').html(ui.value);
    	}
    });
    // Shows default value
    $('.value').html($('#slider').slider('value'));
 });
/**
 * THREE.js example
 * @type {THREE}
 */

// data typed arrayhun!
// http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/

var origin = new THREE.Vector3(0,0,0);

// absolute scales for visualization; no effect on simulation
var maxSandHeight = 1;
var sandWidth = 10;
var sandLength = 10;

var initSandHeight = 0.5; // relative value in range [0, 1]
var heightMapWidth = 25; // horizontal vertex count
var heightMapLength = 25; // lengthwise vertex count
var hm = new Uint8ClampedArray(heightMapWidth * heightMapLength);

var scene, camera, renderer;
var geo;
var stats;

var clock = new THREE.Clock();

init();

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add(cube);

render();

function init() {
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 10;
  document.body.appendChild( stats.domElement );
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;
  camera.position.y = 6;
  camera.lookAt(origin);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  geo = new THREE.PlaneGeometry(sandWidth, sandLength, heightMapWidth-1, heightMapLength-1);
  geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  geo.computeFaceNormals();
  geo.computeVertexNormals();
  //var checkerBoardTexture = THREE.ImageUtils.loadTexture("images/white-gray-checkerboard.png");
  //checkerBoardTexture.wrapS = checkerBoardTexture.wrapT = THREE.RepeatWrapping;
  //checkerBoardTexture.repeat.set(5,5);
  var sandMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
  var mesh = new THREE.Mesh(geo, sandMaterial);
  scene.add(mesh);
  initHeightmap();
  updateMesh();
  poke(0,0,2);
  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function render() {
  var delta = clock.getDelta();
  var time = clock.getElapsedTime() * 10;
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	stats.update();
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

function poke(centerx, centerz, fingerRadius) {
  // btw: will we sanitize the inputs so touches
  // close to sandbox edge are not allowed?

  //-sandWidth/2
  //   |                     |
  //   |     leftX           |
  //   |       (    +    )   |
  //   |                     |
  //   i  i  i  i  i  i  i  i|
  var dx = sandWidth / (heightMapWidth-1);
  var dz = sandLength / (heightMapLength-1);
  var leftx = centerx - fingerRadius;
  var lefti = Math.ceil((leftx - sandWidth/2)/sandWidth * (heightMapWidth-1));
//  var rightX = centerX + fingerRadius;
  var rightx = centerx + fingerRadius;
  //for (var i = 0; i < )

}

function initHeightmap() {
  var level = initSandHeight * 255;
  for (var i = 0, len = hm.length; i < len; ++i) {
    hm[i] = level;
  }
}

function updateMesh() {
  hm[30] = 255; // one max height point for testing
  hm[2520] = 0; // and one min height point
  var multiplier = maxSandHeight / 255;

  for (var i = 0, len = hm.length; i < len; ++i) {
    geo.vertices[i].y = hm[i] * multiplier;
  }
  /*
  for (var i = 0; i < heightMapWidth; ++i) {
    for (var j = 0; j < heightMapLength; ++j) {
      var index = i + j * heightMapWidth;
      geo.vertices[index].y = hm[index] * multiplier;
    }
  }
  */
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
