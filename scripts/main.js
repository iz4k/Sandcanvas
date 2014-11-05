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

var heightMapWidth = 128;
var heightMapLength = 128;
var origin = new THREE.Vector3(0,0,0);

var scene, camera, renderer;
var geo;

var clock = new THREE.Clock();

init();

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add(cube);

render();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;
  camera.position.y = 6;
  camera.lookAt(origin);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  geo = new THREE.PlaneGeometry(10, 10, heightMapWidth-1, heightMapLength-1);
  geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  geo.computeFaceNormals();
  geo.computeVertexNormals();
  //var checkerBoardTexture = THREE.ImageUtils.loadTexture("images/white-gray-checkerboard.png");
  //checkerBoardTexture.wrapS = checkerBoardTexture.wrapT = THREE.RepeatWrapping;
  //checkerBoardTexture.repeat.set(5,5);
  var sandMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
  var mesh = new THREE.Mesh(geo, sandMaterial);
  scene.add(mesh);
  morphMesh();
  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function render() {
  var delta = clock.getDelta();
  var time = clock.getElapsedTime() * 10;
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

function morphMesh() {
  geo.vertices[30].y = 10; // + 1 * (heightMapLength-1)].y = 10;
  for (var i = 0; i < heightMapWidth; ++i) {
    for (var j = 0; j < heightMapLength; ++j) {
      geo.vertices[i + j * heightMapWidth].y = Math.max(0.2 * (1 + Math.sin(i)), 0.2 * (1 + Math.cos(j)));

    }
  }
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}