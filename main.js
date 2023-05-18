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

let player = {
  height: 5,
  turnSpeed: .1,
  speed: .1,
  jumpHeight: .3,
  gravity: .01,
  velocity: 0,
  
  playerJumps: false
};

camera.position.set(0, player.height, -5);
camera.lookAt(new THREE.Vector3(0, player.height, 0));

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
		plane.position.x = -90;
		plane.position.y = -25;
		plane.position.z = -24.2;
		plane.scale.x = 0.2;
		plane.scale.y = 0.2;
		plane.scale.z = 0.2;
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
		bus1.position.x = 10;
		bus1.position.y = 1;
		bus1.position.z = 150;
		bus1.scale.x = 3;
		bus1.scale.y = 3;
		bus1.scale.z = 3;
		// bus1.rotation.y = 150;
		bus1.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
		scene.add(bus1);
	}
);

// let bus2;
// loader.load(
// 	// resource URL
// 	"models/bus2.glb",
// 	function (gltf) {
// 		bus2 = gltf.scene;
// 		// bus2.castShadow = true;
// 		bus2.position.x = 10;
// 		bus2.position.y = 1;
// 		bus2.position.z = 120;
// 		bus2.scale.x = 0.55;
// 		bus2.scale.y = 0.55;
// 		bus2.scale.z = 0.55;
// 		bus2.rotation.y = 600;
// 		bus2.traverse( function( node ) { if ( node.isMesh) { node.castShadow = true; } } );
// 		scene.add(bus2);
// 	}
// );

// Controls

// let controls1 = new FlyControls(camera, renderer.domElement);
// controls1.movementSpeed = 10;
// controls1.rollSpeed = 0.05;
// controls1.autoForward = false;
// controls1.dragToLook = false;

// let controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = false;
// controls.target = new THREE.Vector3(2, 2, 2);

const pointerControls = new PointerLockControls(camera, renderer.domElement)
document.addEventListener( 'click', function () {

  pointerControls.lock();

},false );
scene.add(pointerControls.getObject());

// Event listener for PointerLockControls change
document.addEventListener('pointerlockchange', () => {
  pointerControls.isLocked ? pointerControls.lock() : pointerControls.unlock();
});

// WASD key controls for movement
const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false
};

document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      movement.forward = true;
      break;
    case 'KeyA':
      movement.left = true;
      break;
    case 'KeyS':
      movement.backward = true;
      break;
    case 'KeyD':
      movement.right = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      movement.forward = false;
      break;
    case 'KeyA':
      movement.left = false;
      break;
    case 'KeyS':
      movement.backward = false;
      break;
    case 'KeyD':
      movement.right = false;
      break;
  }
});

// Update camera position based on WASD movement
function updateMove() {

	const speed = 0.1;

	let forward = movement.forward ? 1 : 0;
	let backward = movement.backward ? 1 : 0;
	let left = movement.left ? 1 : 0;
	let right = movement.right ? 1 : 0;

	let stop = false;

	// console.log(forward + " " + backward + " " + right + " " + left);
	// console.log(movement);

	console.log();
	// if (stop) {
	// 	forward = 0;
	// 	backward = 0;
	// 	left = 0;
	// 	right = 0;
	// }


	const direction = new THREE.Vector3(right - left, 0, backward - forward);
	direction.normalize();

	const moveVector = new THREE.Vector3(direction.x, 0, direction.z);
	moveVector.applyQuaternion(camera.quaternion);
	moveVector.multiplyScalar(speed);

	// Check camera tembus bawah
	if (camera.position.y < 5) {
		camera.position.y = 5; // Set camera position to ground level
	}

	// Check camera terbang
	if (camera.position.y > 5) {
		camera.position.y = 5; // Set camera position to ground level
	}

	// console.log(parseInt(camera.position.x) + "," + parseInt(camera.position.y) + "," + parseInt(camera.position.z));

	// Check camera mentok Utara
	if (camera.position.z > 191) {
		camera.position.z = 191; // Set camera position to ground level
	}

	// Check camera mentok Barat
	if (camera.position.x > 193) {
		camera.position.x = 193; // Set camera position to ground level
	}

	// Check camera mentok Timur
	if (camera.position.x < -225) {
		camera.position.x = -225; // Set camera position to ground level
	}

	// Check camera mentok Utara
	if (camera.position.z < -227) {
		camera.position.z = -227; // Set camera position to ground level
	}

	console.log(parseInt(camera.position.x) + " , " + parseInt(camera.position.y) + " , " + parseInt(camera.position.z));

	// Building1
	// 23 , 5 , -58 kiri <-> 193 , 5 , -58 kanan <-> 23 , 5 , -227 atas
	if (camera.position.z < -58 && camera.position.z >= -227 && camera.position.x >= 23 && camera.position.x <= 23.5) {
		camera.position.x = 23;
	}
	if (camera.position.x >= 23.5 && camera.position.x <= 193 && camera.position.z <= -58) {
		console.log("kena kanan");
	}

	// Plane
	// A (-35,5,-14) (-35,5,-21)
	if (camera.position.x <= -35 && camera.position.x >= -35.5 && camera.position.z <= -14 && camera.position.z >= -21) {
		camera.position.x = -35;
	}
	// B (-35,5,-21) (-52,5,-21)
	if (camera.position.x <= -35 && camera.position.x >= -52.5 && camera.position.z >= -21 && camera.position.z <= -20.5) {
		camera.position.z = -21
	}
	// C (-35,5,-14) (-52,5,-14)
	if (camera.position.x <= -35 && camera.position.x >= -52.5 && camera.position.z <= -14 && camera.position.z >= -14.5) {
		camera.position.z = -14
	}
	// D (-52,5,-20) (-52,5,-28)
	if (camera.position.x <= -52 && camera.position.x >= -52.5 && camera.position.z <= -20 && camera.position.z >= -28) {
		camera.position.x = -52;
	}
	// E (-52,5,-28) (-63,5,-28)
	if (camera.position.x <= -52 && camera.position.x >= -63.5 && camera.position.z >= -28 && camera.position.z <= -27.5) {
		camera.position.z = -28;
	}
	// F (-52,5,-7) (-52,5,-14)
	if (camera.position.x <= -52 && camera.position.x >= -52.5 && camera.position.z <= -7 && camera.position.z >= -14) {
		camera.position.x = -52;
	}
	// G (-52,5,-7) (-63,5,-7)
	if (camera.position.x <= -52 && camera.position.x >= -63.5 && camera.position.z <= -7 && camera.position.z >= -7.5) {
		camera.position.z = -7
	}
	// H (-63,5,-28) (-63,5,-44) 
	if (camera.position.x <= -63 && camera.position.x >= -63.5 && camera.position.z <= -28 && camera.position.z >= -44) {
		camera.position.x = -63;
	}
	// I (-63,5,-44) (-75,5,-44)
	if (camera.position.x <= -63 && camera.position.x >= -75.5 && camera.position.z >= -44 && camera.position.z <= -43.5) {
		camera.position.z = -44;
	}
	// J (-63,5,8) (-63,5,-7)
	if (camera.position.x <= -63 && camera.position.x >= -63.5 && camera.position.z <= 8 && camera.position.z >= -7) {
		camera.position.x = -63;
	}
	// K (-63,5,8) (-75,5,8)
	if (camera.position.x <= -63 && camera.position.x >= -75.5 && camera.position.z <= 8 && camera.position.z >= 7.5) {
		camera.position.z = 8
	}
	// L (-75,5,-31) (-75,5,-44)
	if (camera.position.x >= -75 && camera.position.x <= -74.5 && camera.position.z <= -31.5 && camera.position.z >= -44) {
		camera.position.x = -75;
	}
	// M (-75,5,-32) (-87,5,-32)
	if (camera.position.x <= -75 && camera.position.x >= -87.5 && camera.position.z >= -32 && camera.position.z <= -31.5) {
		camera.position.z = -32;
	}
	// N (-75,5,8) (-75,5,-4)
	if (camera.position.x >= -75 && camera.position.x <= -74.5 && camera.position.z <= 8 && camera.position.z >= -4.5) {
		camera.position.x = -75;
	}
	// O (-75,5,-4) (-87,5,-4)
	if (camera.position.x <= -75 && camera.position.x >= -87.5 && camera.position.z <= -4 && camera.position.z >= -4.5) {
		camera.position.z = -4;
	}
	// P (-87,5,-4) (-87,5,-32)
	if (camera.position.x >= -87 && camera.position.x <= -86.5 && camera.position.z <= -3.5 && camera.position.z >= -32) {
		camera.position.x = -87;
	}

	// Building2
	// BOX DEPAN
	if(camera.position.x>=137 && camera.position.x<=138 && camera.position.z>=7 && camera.position.z<=55){
		camera.position.x = 137.60;
	}
	// BOX KIRI
	if(camera.position.x>=138 && camera.position.x<=194 && camera.position.z>=7 && camera.position.z<=9){
		camera.position.z = 8;
	}
	// // BOX BELAKANG
	// if(camera.position.x>=73 && camera.position.x<=74 && camera.position.z>=23 && camera.position.z<=33){
	// 	camera.position.x = 73.2696;
	// }
	// BOX KANAN
	if(camera.position.x>=139 && camera.position.x<=166 && camera.position.z>=55 && camera.position.z<=56){
		camera.position.z = 56;
	}
	// TOWER DEPAN
	if(camera.position.x>=165 && camera.position.x<=167 && camera.position.z>=55 && camera.position.z<=76){
		camera.position.x = 165;
	}
	// TOWER KANAN
	if(camera.position.x>=167 && camera.position.x<=194 && camera.position.z>=76 && camera.position.z<=77){
		camera.position.z = 76.5;
	}

	// Bus
	// BUS DEPAN
	if(camera.position.x>=40 && camera.position.x<=41 && camera.position.z>=23 && camera.position.z<=32){
		camera.position.x = 40.69;
	}
	// BUS KIRI
	if(camera.position.x>=40 && camera.position.x<=73 && camera.position.z>=31 && camera.position.z<=33){
		camera.position.z = 32.05;
	}
	// BUS BELAKANG
	if(camera.position.x>=73 && camera.position.x<=74 && camera.position.z>=23 && camera.position.z<=33){
		camera.position.x = 73.2696;
	}
	// BUS KANAN
	if(camera.position.x>=40 && camera.position.x<=73 && camera.position.z>=23 && camera.position.z<=24){
		camera.position.z = 23.5;
	}

	camera.position.add(moveVector);

	if (
		heli!=undefined &&
		hot_air!=undefined &&
		bus1!=undefined &&
		plane!=undefined &&
		airport_building1!=undefined &&
		airport_building2!=undefined &&
		car_pack!=undefined
	) {
		let boundingBoxHeli = new THREE.Box3().setFromObject(heli);

		let boundingBoxHotAir = new THREE.Box3().setFromObject(hot_air);
		
		let boundingBoxBus1 = new THREE.Box3().setFromObject(bus1);
		
		let boundingBoxPlane = new THREE.Box3().setFromObject(plane);

		// let boundingBoxBus2 = new THREE.Box3().setFromObject(bus2);

		let boundingBoxAirportBuilding1 = new THREE.Box3().setFromObject(airport_building1);
		let boundingBoxAirportBuilding2 = new THREE.Box3().setFromObject(airport_building2);
		let boundingBoxCarPack = new THREE.Box3().setFromObject(car_pack);
	
		if (boundingBoxHeli.containsPoint(camera.position)) {
			console.log("kena heli");
		}
		if (boundingBoxHotAir.containsPoint(camera.position)) {
			console.log("kena hot air");
		}
		if (boundingBoxBus1.containsPoint(camera.position)) {
			console.log("kena bus1");
		}
		// if (boundingBoxBus2.containsPoint(camera.position)) {
		// 	console.log("kena bus2");
		// 	console.log(camera.position);
		// }

		if (boundingBoxPlane.containsPoint(camera.position)) {
			// console.log("kena plane");
		}
		if (boundingBoxAirportBuilding1.containsPoint(camera.position)) {
			console.log("kena building1");
		}
		if (boundingBoxAirportBuilding2.containsPoint(camera.position)) {
			console.log("kena building2");
		}
		if (boundingBoxCarPack.containsPoint(camera.position)) {
			console.log("kena car");
		}
	}
}

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
			heli.position.y += 0.062;
		} else if (turnHeli == 0 && clockHeli.elapsedTime > 8 && clockHeli.elapsedTime < 60) {
			heli.position.y -= 0.062;
			let tempHeliPosY = heli.position.y;
			if (tempHeliPosY < 5.3) {
				heli.position.y = 5.3;
			}
		}

		// console.log(clockHeli.elapsedTime + " - " + heli.position.y);

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
	
	camera.rotation.y = pointerControls.getObject().rotation.y;

	updateMove();

	renderer.render(scene, camera);
}

const container = document.querySelector("#container3D");
container.append(renderer.domElement);
renderer.render(scene, camera);
// composer.render();
animate();
