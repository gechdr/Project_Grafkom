import * as THREE from "three";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { FlyControls } from "./FlyControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { EffectComposer } from "./EffectComposer.js";
import { RenderPass } from "./RenderPass.js";
import { UnrealBloomPass } from "./UnrealBloomPass.js";

let width = window.innerWidth;
let height = window.innerHeight;

const backgroundLoader = new THREE.TextureLoader();

const texture = backgroundLoader.load("textures/Sky1.jpg");

// Scene
const scene = new THREE.Scene();
scene.background = texture;

// coba
// const earthLoader = new THREE.TextureLoader();

// const earthTexture = earthLoader.load('textures/earth.jpg')

// var earthGeometry = new THREE.PlaneGeometry();

// const earthMaterial = new THREE.MeshPhysicalMaterial();
// earthMaterial.bumpMap = earthTexture;
// earthMaterial.bumpScale = 1;
// earthMaterial.map = earthTexture;

// const earth = new THREE.Mesh(earthGeometry, earthMaterial)
// earth.receiveShadow = false;
// earth.castShadow = true;
// scene.add(earth)

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

const light = new THREE.PointLight(0xffffff, 10);
// (,ketinggian,)
light.position.set(0, 10000, 0);

light.castShadow = true;
light.shadow.mapSize.width = width;
light.shadow.mapSize.height = height;
light.shadow.camera.near = 1;
light.shadow.camera.far = 1000;
scene.add(light);

// light.position.set(10, 10, 10);

// light.castShadow = true;
// light.shadow.mapSize.width = width;
// light.shadow.mapSize.height = height;
// light.shadow.camera.near = 1;
// light.shadow.camera.far = 1000;
// scene.add(light);

// camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
camera.position.set(50, 20, 150);
camera.lookAt(0, 0, 0);

const loader = new GLTFLoader();

let land;
loader.load(
	// resource URL
	"models/land2.glb",
	function (gltf) {
		land = gltf.scene;
		// land.castShadow = true;
		land.position.x = 0;
		land.position.y = 0;
		land.position.z = 0;
		land.scale.x = 0.1;
		land.scale.y = 0.1;
		land.scale.z = 0.1;
		// console.log(land);

		scene.add(land);
	}
);

let airport_building;
loader.load(
	// resource URL
	"models/airport_building1.glb",
	function (gltf) {
		airport_building = gltf.scene;
		airport_building.castShadow = true;
		airport_building.position.x = 110;
		airport_building.position.y = 0;
		airport_building.position.z = -138;
		airport_building.scale.x = 1000;
		airport_building.scale.y = 1000;
		airport_building.scale.z = 1000;

		// console.log(plane);
		scene.add(airport_building);
	}
);

let helipad;
loader.load(
	// resource URL
	"models/helipad.glb",
	function (gltf) {
		helipad = gltf.scene;
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

let mixerPlane;
let plane;
loader.load(
	// resource URL
	"models/plane.glb",
	function (gltf) {
		plane = gltf.scene;
		plane.castShadow = true;
		plane.position.x = -15;
		plane.position.y = 6;
		plane.position.z = 0;
		plane.scale.x = 3;
		plane.scale.y = 3;
		plane.scale.z = 3;

		mixerPlane = new THREE.AnimationMixer(plane);
		const clips = gltf.animations;
		// console.log("plane");
		// console.log(clips);
		const clip = THREE.AnimationClip.findByName(clips, "Animation");
		const action = mixerPlane.clipAction(clip);
		action.play();

		// console.log(plane);
		scene.add(plane);
	}
);

// let ballon;
// loader.load(
// 	// resource URL
// 	"models/zeppelin_air_balloon.glb",
// 	function (gltf) {
// 		ballon = gltf.scene;
// 		ballon.castShadow = true;
// 		ballon.position.x = 70;
// 		ballon.position.z = -90;
// 		ballon.scale.x = 1;
// 		ballon.scale.y = 1;
// 		ballon.scale.z = 1;
// 		ballon.rotation.y = 30;

// 		// console.log(plane);
// 		scene.add(ballon);
// 	}
// );

let mixerHeli;
let heli;
let tempHeliClip;
loader.load(
	// resource URL
	"models/heli.glb",
	function (gltf) {
		heli = gltf.scene;
		heli.castShadow = true;
		heli.position.x = -125;
		heli.position.y = 5.3;
		heli.position.z = -110;
		heli.scale.x = 3;
		heli.scale.y = 3;
		heli.scale.z = 3;

		mixerHeli = new THREE.AnimationMixer(heli);
		const clips = gltf.animations;
		// console.log(clips);
		const clip = THREE.AnimationClip.findByName(clips, "Animation");
		// console.log("Clip heli");
		// console.log(clip);
		// console.log("Clip end");
		tempHeliClip = clip;
		const action = mixerHeli.clipAction(clip);
		action.play();

		// console.log(heli);
		scene.add(heli);
	}
);

// let mixerRocket;
// let rocket;
// loader.load(
// 	// resource URL
// 	"models/rocket_ship.glb",
// 	function (gltf) {
// 		rocket = gltf.scene;
// 		rocket.castShadow = true;
// 		rocket.position.x = 0;
// 		rocket.position.z = 40;
// 		rocket.scale.x = 0.1;
// 		rocket.scale.y = 0.1;
// 		rocket.scale.z = 0.1;

// 		mixerRocket = new THREE.AnimationMixer(rocket);
// 		const clips = gltf.animations;
// 		// console.log(clips);
// 		const clip = THREE.AnimationClip.findByName(clips, "Take 001");
// 		const action = mixerRocket.clipAction(clip);
// 		action.play();
// 		// console.log(rocket);
// 		scene.add(rocket);
// 	}
// );

let mixerDrone;
let drone;
loader.load(
	// resource URL
	"models/s9_mini_drone.glb",
	function (gltf) {
		drone = gltf.scene;
		drone.castShadow = true;
		drone.position.x = 0;
		drone.position.z = 40;
		drone.scale.x = 0.1;
		drone.scale.y = 0.1;
		drone.scale.z = 0.1;
		// console.log("drone");f

		mixerDrone = new THREE.AnimationMixer(drone);
		const clips = gltf.animations;
		// console.log(clips);
		const clip = THREE.AnimationClip.findByName(clips, "Take 01");
		const action = mixerDrone.clipAction(clip);
		action.play();

		// console.log(drone);
		scene.add(drone);
	}
);

let hot_air;
loader.load(
	// resource URL
	"models/steampunk_hot_air_balloon.glb",
	function (gltf) {
		hot_air = gltf.scene;
		hot_air.castShadow = true;
		hot_air.position.x = -125;
		hot_air.position.y = 0;
		hot_air.position.z = 100;
		hot_air.scale.x = 3;
		hot_air.scale.y = 3;
		hot_air.scale.z = 3;

		// console.log(hot_air);
		scene.add(hot_air);
	}
);

// .

// renderer
const renderer = new THREE.WebGL1Renderer({ antialias: true, powerPreference: "high-performance", logarithmicDepthBuffer: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
let controls1 = new FlyControls(camera, renderer.domElement);
controls1.movementSpeed = 10;
controls1.rollSpeed = 0.05;
controls1.autoForward = false;
controls1.dragToLook = false;

let controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.target = new THREE.Vector3(2, 2, 2);

// controls.keys = {
// 	LEFT: "KeyA",
// 	UP: "KeyW",
// 	RIGHT: "KeyD",
// 	BOTTOM: "KeyS"
// };
// controls.listenToKeyEvents(window);
// controls.addEventListener(window);

let turnPlane = 1;
let turnHeli = 1;
// let turnBallon = 1;
let turnHotAir = 1;

const clockHeli = new THREE.Clock();
const clockRocket = new THREE.Clock();
const clockDrone = new THREE.Clock();
const clockPlane = new THREE.Clock();
function animate() {
	// if (plane != undefined) {
	// 	// plane.position.x += 0.09;
	// 	// plane.position.y += 0.09;

	// 	if (turnPlane == 1) {
	// 		plane.position.z += 0.09;
	// 	} else {
	// 		plane.position.z -= 0.09;
	// 	}

	// 	if (plane.position.z > 100) {
	// 		turnPlane = 0;
	// 		plane.rotation.y = 600;
	// 	} else if (plane.position.z < -100) {
	// 		turnPlane = 1;
	// 		plane.rotation.y = 0;
	// 	}

	// 	// console.log(plane.rotation.z);
	// 	// camera.lookAt(shark.position)
	// }

	// Heli
	if (heli != undefined) {
		// console.log(tempHeliClip.duration);
		// heli.position.x += 0.09;
		// heli.position.y += 0.09;

		if (turnHeli == 1 && clockHeli.elapsedTime > 8) {
			heli.position.y += 0.2;
		} else if (turnHeli == 0 && clockHeli.elapsedTime > 8 && clockHeli.elapsedTime < 60) {
			heli.position.y -= 0.2;
			let tempHeliPosY = heli.position.y;
			if (tempHeliPosY < 5.3) {
				heli.position.y = 5.3;
			}
		}

		if (heli.position.y > 160 && turnHeli == 1) {
			turnHeli = 0;
			// heli.rotation.y = 600;
		} else if (heli.position.y <= 5.3 && turnHeli == 0) {
			if (clockHeli.elapsedTime > 60) {
				turnHeli = 1;
				clockHeli.elapsedTime = 0;
			}
		}
	}

	// if (ballon != undefined) {
	// 	// heli.position.x += 0.09;
	// 	// heli.position.y += 0.09;

	// 	// y 70 z -90

	// 	if (turnBallon == 1) {
	// 		ballon.position.y -= 0.5;
	// 		ballon.position.x -= 1;
	// 	} else {
	// 		ballon.position.y += 0.5;
	// 		ballon.position.x += 1;
	// 	}

	// 	// console.log(ballon);
	// 	// if (ballon.position.y > 60) {
	// 	// 	turnBallon = 1;
	// 	// 	// ballon.rotation.x = 600;
	// 	// 	// ballon.rotation.y = 600;
	// 	// 	// ballon.rotation.z = 0;
	// 	// 	// ballon.rotation._y = 500;
	// 	// } else if (ballon.position.y < -100) {
	// 	// 	turnBallon = 0;
	// 	// 	// ballon.rotation.x = 100;
	// 	// 	// ballon.rotation.y = 200;
	// 	// 	// ballon.rotation.z = 100;
	// 	// }

	// 	// camera.lookAt(shark.position)
	// }

	// if (rocket != undefined) {
	// 	if (rocket.position.y < 600) {
	// 		rocket.position.y += 0.5;
	// 		rocket.position.x -= 1;

	// 		// rocket.rotation.y += 0.01;
	// 		// rocket.rotation.z += 0.1;
	// 		// rocket.rotation.x += 0.1;
	// 	} else {
	// 		// rocket.position.y = -50;
	// 		// rocket.position.x = 0;
	// 		rocket.position.y = -300;
	// 		rocket.position.x = 400;

	// 		// ballon/.rotation.y = 0;
	// 	}

	// 	// camera.lookAt(shark.position)
	// }

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
	// if (mixerRocket) {
	// 	mixerRocket.update(clockRocket.getDelta());
	// }
	if (mixerDrone) {
		mixerDrone.update(clockDrone.getDelta());
	}
	if (mixerPlane) {
		mixerPlane.update(clockPlane.getDelta());
	}

	// console.log(cube.position.x)

	//For FlyControls
	controls1.update(0.05);
	controls.update();

	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

const container = document.querySelector("#container3D");
container.append(renderer.domElement);
renderer.render(scene, camera);
// composer.render();
animate();
