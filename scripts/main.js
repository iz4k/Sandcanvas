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

var heightMapWidth = 128;
var heightMapLength = 128;

var scene, camera, renderer;
var sandGeometry;


init();

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add(cube);

var geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
var material2 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var cube2 = new THREE.Mesh( geometry2, material2 );
scene.add(cube2);

render();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 5;
  camera.position.y = 2;
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  sandGeometry = new THREE.PlaneGeometry(10, 10, heightMapWidth-1, heightMapLength-1);
  sandGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  sandGeometry.computeFaceNormals();
  sandGeometry.computeVertexNormals();
  var checkerBoardTexture = THREE.ImageUtils.loadTexture("images/white-gray-checkerboard.png");
  checkerBoardTexture.wrapS = checkerBoardTexture.wrapT = THREE.RepeatWrapping;
  checkerBoardTexture.repeat.set(5,5);
  var sandMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
  var mesh = new THREE.Mesh(sandGeometry, sandMaterial);
  scene.add(mesh);
  document.body.appendChild( renderer.domElement );
}

function render() {
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
  cube2.position.y = -0.7;
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

