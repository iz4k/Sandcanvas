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
        maxSandHeight = ui.value;
        updateMesh();
    	}
    });

    $("#debug").on("click", function(){
    	debugModeToggle();
    	$("#debug").blur();

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

// world space measurements; sand surface resets to y=0
var sandWidth = 10;
var sandLength = 10;

// simulation heightmap
var cellsPerUnit = 10;
var heightMapWidth = sandWidth * cellsPerUnit;
var heightMapLength = sandLength * cellsPerUnit;
var hm = new Float32Array(heightMapWidth * heightMapLength);

var scene, camera, controls, renderer, sand;
var geo;
var stats;

var clock = new THREE.Clock();

init();

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

  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.enabled = false;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  var spotLight = new THREE.SpotLight( 0xffffff ); spotLight.position.set( 10, 10, 0 ); spotLight.castShadow = true; spotLight.shadowMapWidth = 1; spotLight.shadowMapHeight = 1; spotLight.shadowCameraNear = 5; spotLight.shadowCameraFar = 40; spotLight.shadowCameraFov = 30; scene.add( spotLight );


  geo = new THREE.PlaneGeometry(sandWidth, sandLength, heightMapWidth-1, heightMapLength-1);
  geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
  geo.computeFaceNormals();
  geo.computeVertexNormals();
  //var checkerBoardTexture = THREE.ImageUtils.loadTexture("images/white-gray-checkerboard.png");
  //checkerBoardTexture.wrapS = checkerBoardTexture.wrapT = THREE.RepeatWrapping;
  //checkerBoardTexture.repeat.set(5,5);

  //sand = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe:true});
  sand = new THREE.MeshPhongMaterial({wireframe:true, map: THREE.ImageUtils.loadTexture('hiekka.jpg')});
  var mesh = new THREE.Mesh(geo, sand);

  // mesh.castShadow = true;
  // mesh.receiveShadow = true;
  scene.add(mesh);
  initHeightmap();

  updateMesh();

  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );

  document.addEventListener("mousedown", function(){
    document.onmousemove = function(e){
      onMouseDown(e);
    }
    this.onmouseup = function() {
      document.onmousemove = null
    }

  }, false);

  // document.addEventListener("drag", onMouseDown, false);

	$(document).keyup(function(evt) {
		if (evt.keyCode == 32) {
	  		controls.enabled = false;
		}
	}).keydown(function(evt) {
		if (evt.keyCode == 32) {
		  controls.enabled = true;
		}
	});

}

function debugModeToggle(){
	sand.wireframe = (sand.wireframe == false ? true : false);
}

function render() {
  var delta = clock.getDelta();
  var time = clock.getElapsedTime() * 10;

	stats.update();
	controls.update();
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

function erode() {
  var liquidity = 0.8;
  var roughness = 0.2;
}

// takes world coordinates
function poke(x0, z0, r) {

  // btw: will we sanitize the inputs so touches
  // close to sandbox edge are not allowed?

  //-sandWidth/2
  //   |                     |
  //   |     leftX           |
  //   |       (    +    )   |
  //   |                     |
  //   i  i  i  i  i  i  i  i|

  var displacedVolume = 0;

  var dx = sandWidth / (heightMapWidth-1);
  var dz = sandLength / (heightMapLength-1);

  // TODO: optimization: only process the neighborhood block
  //var leftx = centerx - fingerRadius;
  //var lefti = Math.ceil((leftx - sandWidth/2)/sandWidth * (heightMapWidth-1));
  //var rightx = centerx + fingerRadius;

  var y0 = 0; // sphere center height for now

  for (var i = 0; i < heightMapWidth; ++i) {
    for (var j = 0; j < heightMapLength; ++j) {
      var index = i + j * heightMapWidth;
      var x = -sandWidth/2 + i * dx;
      var z = -sandLength/2 + j * dz;
      // lower half-sphere point height with quadratic formula
      // var a = 1;
      var b = -2 * y0;
      var c = Math.pow(y0,2) - Math.pow(r,2) + Math.pow(x - x0, 2) + Math.pow(z - z0, 2);
      var y = (-b - Math.sqrt(Math.pow(b,2) - 4*c)) / 2;

      var oldY = hm[index];
      if (y < oldY) {
        hm[index] = y;
        displacedVolume += oldY - y;
      }
    }
  }
  var circumferenceSteps = 40;
  var step = 2*Math.PI / circumferenceSteps;
  console.log('before for;'+step);
  for (var rad = 0; rad <= 2*Math.PI; rad += step) {

    // console.log('in for');
    var cx = x0 + r * Math.cos(rad);
    var cz = z0 + r * Math.sin(rad);
    //index in sand
    var index = heightMapPos(cx, cz);
    // console.log(displacedVolume + ' jonka displacedVolume pitäis olla: ' + (displacedVolume / circumferenceSteps)+' indexissä : '+index);
    hm[index] += (displacedVolume / circumferenceSteps);
  }
}
function heightMapPos(x,y){
  var ix = (2*x)/sandWidth;
  ix = Math.round((ix+1)/2*heightMapWidth);
  var iy = (2*y)/sandLength;
  iy = Math.round((iy+1)/2*heightMapLength);
  var index = ix + iy * heightMapWidth;
  return index;
}

function onMouseDown( event ) {
  if (controls.enabled) return false;
  var vector = new THREE.Vector3();

  vector.set(
      ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5 );

  vector.unproject( camera );

  var dir = vector.sub( camera.position ).normalize();

  var distance = - camera.position.y / dir.y;

  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  poke(pos.x, pos.z, 0.5);
  updateMesh();

  //console.log("X: "+pos.x.toFixed(4)+" Z: "+pos.z.toFixed(4));
//  var hmpos = heightMapPos(pos.x, pos.z);
//  //console.log(hmpos);
//  if (25*25 > hmpos >= 0){
//    hm[hmpos] = 255; //yankee
//    updateMesh();
//  }
//

}

function initHeightmap() {
  for (var i = 0, len = hm.length; i < len; ++i) {
    hm[i] = 0;
  }
}


function updateMesh() {
  for (var i = 0, len = hm.length; i < len; ++i) {
    geo.vertices[i].y = hm[i];

  }
  geo.verticesNeedUpdate = true;
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
