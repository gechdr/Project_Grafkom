import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { FlyControls } from "./FlyControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { EffectComposer } from "./EffectComposer.js";
import { RenderPass } from "./RenderPass.js";
import { UnrealBloomPass } from "./UnrealBloomPass.js";
import { FirstPersonControls } from './FirstPersonControls.js';
import { PointerLockControls } from './PointerLockControls.js';

let width = window.innerWidth;
let height = window.innerHeight;

const backgroundLoader = new THREE.TextureLoader();

const texture = backgroundLoader.load("textures/Sky1.jpg");

// Scene
const scene = new THREE.Scene();
scene.background = texture;

// Light
const ambientLight = new THREE.AmbientLight(0xFFFFFFF);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// scene.add(directionalLight);

// const light = new THREE.PointLight(0xffffff, 12);
const light = new THREE.PointLight(0xffffff, 8);
// (,ketinggian,)
light.position.set(0, 1000, 0);

// light.intensity = 10;
light.angle = 5;
// light.penumbra = 0.3;
light.shadow.focus = 5;

// light.shadow.camera.left = -1000000
// light.shadow.camera.right = 1000000
// light.shadow.camera.bottom = -1000000
// light.shadow.camera.top = 1000000
light.castShadow = true;
light.shadow.mapSize.width = width;
light.shadow.mapSize.height = height;
light.shadow.camera.near = 0.001;
light.shadow.camera.far = 10000;
scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
// camera.position.set(50, 20, 150);
// camera.lookAt(0, 0, 0);

// First Person Controls
let firstControls = [];
let player = {
  height: 5,
  turnSpeed: .1,
  speed: .1,
  jumpHeight: .2,
  gravity: .01,
  velocity: 0,
  
  playerJumps: false
};

camera.position.set(0, player.height, -5);
camera.lookAt(new THREE.Vector3(0, player.height, 0));


// .. 

// Controls:Listeners
document.addEventListener('keydown', ({ keyCode }) => { firstControls[keyCode] = true });
document.addEventListener('keyup', ({ keyCode }) => { firstControls[keyCode] = false });

function control() {
  // Controls:Engine 
  if(firstControls[87]){ // w
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(firstControls[83]){ // s
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if(firstControls[65]){ // a
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if(firstControls[68]){ // d
    camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }
  if(firstControls[37]){ // la
    camera.rotation.y -= player.turnSpeed;
  }
  if(firstControls[39]){ // ra
    camera.rotation.y += player.turnSpeed;
  }
  if(firstControls[32]) { // space
    if(player.jumps) return false;
    player.jumps = true;
    player.velocity = -player.jumpHeight;
  }
}

function ixMovementUpdate() {
  player.velocity += player.gravity;
  camera.position.y -= player.velocity;
  
  if(camera.position.y < player.height) {
    camera.position.y = player.height;
    player.jumps = false;
  }
}

function update() {
  control();
  ixMovementUpdate();
  // ixLightcubeAnimation();
}

// Models

const loader = new GLTFLoader();

let land;
loader.load(
	// resource URL
	"models/land2.glb",
	function (gltf) {
		land = gltf.scene;
		// land.castShadow = true;
		land.receiveShadow = true;
		land.position.x = 0;
		land.position.y = 0;
		land.position.z = 0;
		land.scale.x = 0.1;
		land.scale.y = 0.1;
		land.scale.z = 0.1;
		// console.log(land);
		land.traverse(function (node) {
			if (node.isMesh) { node.receiveShadow = true; }
		})

		scene.add(land);
	}
);

// const geometry = new THREE.BoxGeometry( 500, 0, 500 ); 
// // const material = new THREE.ShadowMaterial({color: 0x000000});
// // material.opacity = 0.2;
// const material = new THREE.MeshBasicMaterial({color: 0x999999});
// const cube = new THREE.Mesh( geometry, material ); 
// cube.receiveShadow = true;
// cube.traverse(function (node) {
// 	if (node.isMesh) { node.receiveShadow = true; }
// })
// scene.add( cube );

// const geometry1 = new THREE.BoxGeometry( 500, 1, 500 ); 
// const material1 = new THREE.ShadowMaterial({color: 0x000000});
// material1.opacity = 0.2;
// const cube1 = new THREE.Mesh( geometry1, material1 ); 
// cube1.receiveShadow = true;
// cube1.traverse(function (node) {
// 	if (node.isMesh) { node.receiveShadow = true; }
// })
// scene.add( cube1 );


let airport_building1;
loader.load(
	// resource URL
	"models/airport_building1.glb",
	function (gltf) {
		airport_building1 = gltf.scene;
		// airport_building1.castShadow = true;
		airport_building1.position.x = 110;
		airport_building1.position.y = 0;
		airport_building1.position.z = -138;
		airport_building1.scale.x = 1000;
		airport_building1.scale.y = 1000;
		airport_building1.scale.z = 1000;
		airport_building1.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		// console.log(plane);
		scene.add(airport_building1);
	}
);

let airport_building2;
loader.load(
	// resource URL
	"models/airport_building2.glb",
	function (gltf) {
		airport_building2 = gltf.scene;
		// airport_building2.castShadow = true;
		airport_building2.position.x = 130;
		airport_building2.position.y = 0;
		airport_building2.position.z = 55;
		airport_building2.scale.x = 0.04;
		airport_building2.scale.y = 0.04;
		airport_building2.scale.z = 0.04;
		airport_building2.rotation.y = -300;
		airport_building2.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		// console.log(plane);
		scene.add(airport_building2);
	}
);

// loader.load(
// 	// resource URL
// 	"models/airport_building2.glb",
// 	function (gltf) {
// 		airport_building2 = gltf.scene;
// 		// airport_building2.castShadow = true;
// 		airport_building2.position.x = 130;
// 		airport_building2.position.y = 0;
// 		airport_building2.position.z = 135;
// 		airport_building2.scale.x = 0.04;
// 		airport_building2.scale.y = 0.04;
// 		airport_building2.scale.z = 0.04;
// 		airport_building2.rotation.y = -300;
// 		airport_building2.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
// 		// console.log(plane);
// 		scene.add(airport_building2);
// 	}
// );

let helipad;
loader.load(
	// resource URL
	"models/helipad.glb",
	function (gltf) {
		helipad = gltf.scene;
		helipad.receiveShadow = true;
		// helipad.castShadow = true;
		helipad.position.x = -125;
		helipad.position.y = 1;
		helipad.position.z = -120;
		helipad.scale.x = 5;
		helipad.scale.y = 5;
		helipad.scale.z = 5;
		// console.log(helipad);

		scene.add(helipad);
	}
);


// GANTI PESAWAT
let mixerPlane;
let plane;
loader.load(
	// resource URL
	"models/plane.glb",
	function (gltf) {
		plane = gltf.scene;
		// plane.castShadow = true;
		plane.position.x = -15;
		plane.position.y = 3;
		plane.position.z = -20;
		plane.scale.x = 3;
		plane.scale.y = 3;
		plane.scale.z = 3;
		plane.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		mixerPlane = new THREE.AnimationMixer(plane);
		const clips = gltf.animations;
		// console.log("plane");
		// console.log(clips);
		const clip = THREE.AnimationClip.findByName(clips, "Animation");
		const action = mixerPlane.clipAction(clip);
		// action.play();

		// console.log(plane);
		scene.add(plane);
	}
);

let mixerHeli;
let heli;
let tempHeliClip;
loader.load(
	// resource URL
	"models/heli.glb",
	function (gltf) {
		heli = gltf.scene;
		// heli.castShadow = true;
		heli.position.x = -125;
		heli.position.y = 5.3;
		heli.position.z = -110;
		heli.scale.x = 3;
		heli.scale.y = 3;
		heli.scale.z = 3;
		heli.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		mixerHeli = new THREE.AnimationMixer(heli);
		const clips = gltf.animations;
		// console.log(clips);
		const clip = THREE.AnimationClip.findByName(clips, "Animation");
		tempHeliClip = clip;
		const action = mixerHeli.clipAction(clip);
		action.play();

		// console.log(heli);
		scene.add(heli);
	}
);

let hot_air;
loader.load(
	// resource URL
	"models/steampunk_hot_air_balloon.glb",
	function (gltf) {
		hot_air = gltf.scene;
		// hot_air.castShadow = true;
		hot_air.position.x = -125;
		hot_air.position.y = 0;
		hot_air.position.z = 100;
		hot_air.scale.x = 3;
		hot_air.scale.y = 3;
		hot_air.scale.z = 3;

		hot_air.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		// hot_air.traverse( function( node ) { if ( node instanceof THREE.Mesh ) { node.castShadow = true; } } );
		// console.log(hot_air);
		scene.add(hot_air);
	}
);

let car_pack;
loader.load(
	// resource URL
	"models/car_pack.glb",
	function (gltf) {
		car_pack = gltf.scene;
		// car_pack.castShadow = true;
		car_pack.position.x = -125;
		car_pack.position.y = 0;
		car_pack.position.z = 99;
		car_pack.scale.x = 3;
		car_pack.scale.y = 3;
		car_pack.scale.z = 3;
		car_pack.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		scene.add(car_pack);
	}
);

let bus1;
loader.load(
	// resource URL
	"models/bus1.glb",
	function (gltf) {
		bus1 = gltf.scene;
		// bus1.castShadow = true;
		bus1.position.x = -40;
		bus1.position.y = 1;
		bus1.position.z = 150;
		bus1.scale.x = 3;
		bus1.scale.y = 3;
		bus1.scale.z = 3;
		bus1.rotation.y = 150;
		bus1.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		scene.add(bus1);
	}
);

let bus2;
loader.load(
	// resource URL
	"models/bus2.glb",
	function (gltf) {
		bus2 = gltf.scene;
		// bus2.castShadow = true;
		bus2.position.x = 70;
		bus2.position.y = 1;
		bus2.position.z = 52;
		bus2.scale.x = 0.55;
		bus2.scale.y = 0.55;
		bus2.scale.z = 0.55;
		bus2.rotation.y = -400;
		bus2.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		scene.add(bus2);
	}
);

// .

// renderer
const renderer = new THREE.WebGL1Renderer({ antialias: true, powerPreference: "high-performance", logarithmicDepthBuffer: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.shadowMap.type = THREE.BasicShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
	// update display width and height
	width = window.innerWidth;
	height = window.innerHeight;
	// console.log(width + " " + height);
	// update camera aspect
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	// update renderer
	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

// Controls
// let controls1 = new FlyControls(camera, renderer.domElement);
// controls1.movementSpeed = 10;
// controls1.rollSpeed = 0.05;
// controls1.autoForward = false;
// controls1.dragToLook = false;

// let controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = false;
// controls.target = new THREE.Vector3(2, 2, 2);

const controls3 = new PointerLockControls(camera, renderer.domElement)
document.addEventListener( 'click', function () {

  controls3.lock();

},false );

// controls.keys = {
// 	LEFT: "KeyA",
// 	UP: "KeyW",
// 	RIGHT: "KeyD",
// 	BOTTOM: "KeyS"
// };
// controls.listenToKeyEvents(window);
// controls.addEventListener(window);

let turnHeli = 1;
let turnHotAir = 1;

const clockHeli = new THREE.Clock();
function animate() {
	// Heli
	if (heli != undefined) {
		// console.log(tempHeliClip.duration);
		// heli.position.x += 0.09;
		// heli.position.y += 0.09;

		if (turnHeli == 1 && clockHeli.elapsedTime > 8) {
			heli.position.y += 0.3;
		} else if (turnHeli == 0 && clockHeli.elapsedTime > 8 && clockHeli.elapsedTime < 60) {
			heli.position.y -= 0.2;
			let tempHeliPosY = heli.position.y;
			if (tempHeliPosY < 5.3) {
				heli.position.y = 5.3;
			}
		}

		console.log(clockHeli.elapsedTime);

		if (heli.position.y > 165 && turnHeli == 1) {
			turnHeli = 0;
			// heli.rotation.y = 600;
		} else if (heli.position.y <= 5.3 && turnHeli == 0) {
			if (clockHeli.elapsedTime > 60) {
				turnHeli = 1;
				clockHeli.elapsedTime = 0;
			}
		}
	}

	if (hot_air != undefined) {
		// heli.position.x += 0.09;
		// heli.position.y += 0.09;

		if (turnHotAir == 1) {
			hot_air.position.y += 0.02;
		} else {
			hot_air.position.y -= 0.02;
		}

		if (hot_air.position.y > 50) {
			turnHotAir = 0;
			// heli.rotation.y = 600;
		} else if (hot_air.position.y < 1) {
			turnHotAir = 1;
			// heli.rotation.y = 0;
		}

		// camera.lookAt(shark.position)
	}

	if (mixerHeli) {
		mixerHeli.update(clockHeli.getDelta());
	}

	// console.log(cube.position.x)

	//For FlyControls
	// controls1.update(0.05);
	// controls.update();

	requestAnimationFrame(animate);
	update();

	renderer.render(scene, camera);
}

const container = document.querySelector("#container3D");
container.append(renderer.domElement);
renderer.render(scene, camera);
// composer.render();
animate();
