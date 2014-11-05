/**
 * THREE.js example
 * @type {THREE}
 */

var heightMapWidth = 128;
var heightMapLength = 128;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );

var geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
var material2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

var cube2 = new THREE.Mesh( geometry2, material2 );

scene.add(cube);

scene.add(cube2);

camera.position.z = 5;

function init() {
}

function render() {
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
  cube2.position.y = -0.7;
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

init();
render();
