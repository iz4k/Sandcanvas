"use strict";

/**
 * Slider constructor
 * @return {[type]} [description]
 */
$(function() {
    $( "#slider" ).slider({
    	value:5,
    	min:0,
    	max:10,
    	step:1,
    	slide:function (event, ui) {
    		$('.value').html(ui.value);
        // maxSandHeight = ui.value;
        pokeWidth = ui.value / 10;
        needsUpdate = true;
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
var pokeWidth = 0.5;

// simulation heightmap
var cellsPerUnit = 10;
var heightMapWidth = sandWidth * cellsPerUnit;
var heightMapLength = sandLength * cellsPerUnit;
var hm = new Float32Array(heightMapWidth * heightMapLength);


var needsUpdate;


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
	camera.position.z = 0;
	camera.position.y = 6;
	camera.lookAt(origin);

	controls = new THREE.OrbitControls(camera);
	controls.damping = 0.2;
	controls.enabled = false;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	geo = new THREE.PlaneGeometry(sandWidth, sandLength, heightMapWidth-1, heightMapLength-1);
	geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	geo.computeFaceNormals();
	geo.computeVertexNormals();

	//var checkerBoardTexture = THREE.ImageUtils.loadTexture("images/white-gray-checkerboard.png");
	//checkerBoardTexture.wrapS = checkerBoardTexture.wrapT = THREE.RepeatWrapping;
	//checkerBoardTexture.repeat.set(5,5);


	// LIGHTS

	var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( 10, 50, 0 );
	spotLight.castShadow = true;
	scene.add( spotLight );
	var ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );

//	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); directionalLight.position.set( 0, 1, 0 ); scene.add( directionalLight );



	//SAND
//	var normalmap = THREE.ImageUtils.loadTexture( "images/normal_map.png");
//	normalmap.wrapS = normalmap.wrapT = THREE.RepeatWrapping;
//	normalmap.repeat.set(10,10);
	var bumpmap = THREE.ImageUtils.loadTexture( "images/bump_map.jpg");
	bumpmap.wrapS = bumpmap.wrapT = THREE.RepeatWrapping;
	bumpmap.repeat.set(30,30);

	//sand = new THREE.MeshLambertMaterial({color:0xC2B280});
	sand = new THREE.MeshPhongMaterial({
		//map: THREE.ImageUtils.loadTexture('hiekka.jpg'),
//		normalMap: normalmap,
//		normalScale: {x:0,y:1,z:0},
		bumpMap: bumpmap,
		bumpScale: 0.2,
		color: 0xC2B280,   //diffuse

		specular: 0x6D6C6B,
		ambient: 0x050505,
		shininess: 1,
		reflectivity: 0.1
		});
	var mesh = new THREE.Mesh(geo, sand);


	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);


//	var ambient = 0x050505, diffuse = 0x331100, specular = 0xffffff, shininess = 10, scale = 1;

//	// normal map shader

//	var shader = THREE.ShaderLib[ "normalmap" ];
//	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

//	//uniforms[ "enableAO" ].value = true;
//	uniforms[ "enableDiffuse" ].value = false;
//	uniforms[ "enableSpecular" ].value = false;
//	//uniforms[ "enableReflection" ].value = true;
//	//uniforms[ "enableDisplacement" ].value = true;

//	uniforms[ "tNormal" ].value = normalmap;
//	//uniforms[ "tAO" ].value = THREE.ImageUtils.loadTexture( "textures/normal/ninja/ao.jpg" );

//	//uniforms[ "tDisplacement" ].value = THREE.ImageUtils.loadTexture( "textures/normal/ninja/displacement.jpg" );
//	//uniforms[ "uDisplacementBias" ].value = - 0.428408;
//	//uniforms[ "uDisplacementScale" ].value = 2.436143;

//	uniforms[ "uNormalScale" ].value.y = -1;

//	uniforms[ "diffuse" ].value.setHex( diffuse );
//	uniforms[ "specular" ].value.setHex( specular );
//	uniforms[ "ambient" ].value.setHex( ambient );

//	uniforms[ "shininess" ].value = shininess;

//	//uniforms[ "tCube" ].value = reflectionCube;
//	uniforms[ "reflectivity" ].value = 0.1;

//	uniforms[ "diffuse" ].value.convertGammaToLinear();
//	uniforms[ "specular" ].value.convertGammaToLinear();
//	uniforms[ "ambient" ].value.convertGammaToLinear();


//	var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: false };
//	var material1 = new THREE.ShaderMaterial( parameters );

//	var material2 = new THREE.MeshPhongMaterial( {
//		color: diffuse,
//		specular: specular,
//		ambient: ambient,
//		shininess: shininess,
//		normalMap: uniforms[ "tNormal" ].value,
//		normalScale: uniforms[ "uNormalScale" ].value,
//		combine: THREE.MixOperation,
//		reflectivity: 0.1
//	} );

//	//

//
//	var mesh1 = new THREE.Mesh( geo, material1 );
//	//mesh1.position.x = - scale * 12;
//	mesh1.scale.set( scale, scale, scale );
//	mesh1.castShadow = true;
//	mesh1.receiveShadow = true;
//	scene.add( mesh1 );

//	var mesh2 = new THREE.Mesh( geo, material2 );
//	//mesh2.position.x = scale * 12;
//	mesh2.scale.set( scale, scale, scale );
//	mesh2.castShadow = true;
//	mesh2.receiveShadow = true;
//	scene.add( mesh2 );


	//OTHER STUFF

	initHeightmap();

	needsUpdate = true;


	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	document.addEventListener("mousedown", function(){
		document.onmousemove = function(e){
		  	onMouseDown(e, 'mouse');
		}
		this.onmouseup = function() {
		  	document.onmousemove = null
	}
	}, false);

  document.addEventListener("touchmove", function(e){
    onMouseDown(e, 'touch');
    console.log(e.touches[0].pageX);
  }, false);



  // document.addEventListener("drag", onMouseDown, false);

	$(document).keyup(function(evt) {
		if (evt.keyCode == 32) {
	  		controls.enabled = false;
		}
	}).keydown(function(evt) {
		if (evt.keyCode == 32) {
		  controls.enabled = true;
		} else if (evt.keyCode == 13) {
      // Ykän debugit enterillä
      console.log("mousedown: " + debugmousedown + " extrapokes: " + debugpokes);
    }
	});
}

function debugModeToggle(){
	sand.wireframe = (sand.wireframe == false ? true : false);
}

var normalTickInterval = 1 / 30; // max 30 times/s
var normalTickCounter = 0;

function render() {
  normalTickCounter += clock.getDelta();
  // var time = clock.getElapsedTime(); // seconds since clock started

  erode();

 	if (needsUpdate && normalTickCounter > normalTickInterval){
    normalTickCounter -= normalTickInterval;
 		updateMesh();
	 	geo.computeFaceNormals();
		geo.computeVertexNormals();

	}

	stats.update();
	controls.update();
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

function erode() {
  needsUpdate = true;

  // sand erosion from Sumner (1999)

  // could probably get better quality with 8-way neighbors,
  // but this is already murder for performance... any
  // real optimizations available?

  var outAngle = 0.436; // Sumner: ~25 degrees
  outAngle = 0.8; // randomtuning
  var stopAngle = 0.8;  // Sumner: ~46 degrees; Sumner calls this "liquidity"
  stopAngle = 1.0; // randomtuning
  var roughness = 0.2;

  // for every cell:
  //   select neighbors lower than out-threshold
  //   take average of differences with those neighbors
  //   move (average * roughness) from current cell to those neighbors
  //   repeat all of the above as long as there are neighbors lower than stop-threshold

  var delta = 1 / cellsPerUnit;
  var outThres = delta * Math.tan(outAngle);
  var stopThres = delta * Math.tan(stopAngle);

  // hax: for now, just skip the edge indices
  for (var i=1; i<heightMapWidth-1; ++i) {
    for (var j=1; j<heightMapLength-1; ++j) {
      var index = i + j * heightMapWidth;
      var leftIndex = index-1;
      var rightIndex = index+1;
      var upIndex = index-heightMapWidth;
      var downIndex = index+heightMapWidth;

      var lowerN, diffSum;
      do {
        lowerN = 0;
        diffSum = 0;
        var height = hm[index];
        var diffLeft = height - hm[leftIndex];
        var diffRight = height - hm[rightIndex];
        var diffUp = height - hm[upIndex];
        var diffDown = height - hm[downIndex];
        if (diffLeft > outThres) {
          ++lowerN;
          diffSum += diffLeft;
        }
        if (diffRight > outThres) {
          ++lowerN;
          diffSum += diffRight;
        }
        if (diffUp > outThres) {
          ++lowerN;
          diffSum += diffUp;
        }
        if (diffDown > outThres) {
          ++lowerN;
          diffSum += diffDown;
        }
        if (lowerN > 0) {
          var averageDiff = diffSum / lowerN;
          var volumeIncrement = averageDiff * roughness;
          hm[index] -= volumeIncrement * lowerN;
          if (diffLeft > outThres) {
            hm[leftIndex] += volumeIncrement;
          }
          if (diffRight > outThres) {
            hm[rightIndex] += volumeIncrement;
          }
          if (diffUp > outThres) {
            hm[upIndex] += volumeIncrement;
          }
          if (diffDown > outThres) {
            hm[downIndex] += volumeIncrement;
          }
        }
        height = hm[index];
      } while (height - hm[leftIndex] > stopThres  ||
               height - hm[rightIndex] > stopThres ||
               height - hm[upIndex] > stopThres    ||
               height - hm[downIndex] > stopThres);
    }
  }
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

  var y0 = 0; // sphere center height for now

  var indexXRight, indexXLeft, indexYTop, indexYBottom;
  indexXRight = heightMapPos(x0+r, z0);
  indexXLeft = heightMapPos(x0-r, z0);
  indexYTop = heightMapPos(x0, z0+r);
  indexYBottom = heightMapPos(x0, z0-r);
  for (var i = indexXLeft[1]-5; i < indexXRight[1]+5; ++i) {
    for (var j = indexYBottom[2]-5; j < indexYTop[2]+5; ++j) {
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
  for (var rad = 0; rad <= 2*Math.PI; rad += step) {

    // console.log('in for');
    var cx = x0 + r * Math.cos(rad);
    var cz = z0 + r * Math.sin(rad);
    //index in sand
    var index = heightMapPos(cx, cz);
    // console.log(displacedVolume + ' jonka displacedVolume pitäis olla: ' + (displacedVolume / circumferenceSteps)+' indexissä : '+index);
    hm[index[0]] += (displacedVolume / circumferenceSteps);
  }
}
function heightMapPos(x,y){
  var ix = (2*x)/sandWidth;
  ix = Math.round((ix+1)/2*heightMapWidth);
  var iy = (2*y)/sandLength;
  iy = Math.round((iy+1)/2*heightMapLength);
  var index = ix + iy * heightMapWidth;
  return [index, ix, iy];
}

var lastPokePosition = new THREE.Vector2();

var lastPokeTime;
var debugmousedown = 0;
var debugpokes = 0;

function onMouseDown( event , device) {
  if (controls.enabled) return false;
  var vector = new THREE.Vector3();
  if (device === 'mouse'){
    // console.log('mouse here: '+event.clientX + ' x - y ' + event.clientY);
    vector.set(

        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5 );
  }
  else{
    // console.log('touch here: '+event.touches[0].pageX + ' x - y ' + event.touches[0].pageY);
    vector.set(
      (event.touches[0].pageX/window.innerWidth)*2 -1,
      - (event.touches[0].pageY/window.innerHeight)*2 +1 ,
      0.5 );
  }
  vector.unproject( camera );

  var dir = vector.sub( camera.position ).normalize();

  var distance = - camera.position.y / dir.y;

  var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );

  // we don't always get inputs smoothly from the browser
  // (at least mouse -- what happens with touch/multitouch???)
  // so we have to check if the browser skipped over a too-large
  // interval and generate virtual inputs to keep appearance of
  // continuous digging

  var pokePosition = new THREE.Vector2(pos.x, pos.z);

  var extraPokeTriggerTime = 0.1; // seconds
  var extraPokeDensity = pokeWidth / 3;
  var extraPokeTriggerDistance = extraPokeDensity;

  var pokeTime = clock.getElapsedTime();
  debugmousedown += 1;

  // no virtual inputs on very first input
  if (lastPokePosition.lengthSq() > 0.000001) {
    debugpokes += 1;

    var posDelta = new THREE.Vector2();
    posDelta.subVectors(pokePosition, lastPokePosition);
    var pokeDistance = posDelta.length();
    // TODO: adjust multiplier, optimize with lengthSqr, adjust extrapokes
    if (pokeDistance > extraPokeTriggerDistance) {
      if (pokeTime - lastPokeTime < extraPokeTriggerTime) {
        var extraPokes = Math.floor(pokeDistance / extraPokeDensity);
        posDelta.multiplyScalar(1 / extraPokes);
        for (var i = 1; i < extraPokes; ++i) {
          var newPos = posDelta.clone();
          newPos.multiplyScalar(i);
          newPos.add(lastPokePosition);
          poke(newPos.x, newPos.y, pokeWidth);
        }
      }
    }
  }

  poke(pos.x, pos.z, pokeWidth);

  lastPokeTime = pokeTime;
  lastPokePosition = pokePosition;
  needsUpdate = true;


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
  geo.normalsNeedUpdate = true;
  needsUpdate = false;
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

$('.toggleUi').click(function(event) {
  var txt = $(".ui .controls").hasClass('closed') ? 'Hide controls' : 'Show controls';
   $(".toggleUi").text(txt);
  $('.ui .controls').toggleClass('closed');
}); 
