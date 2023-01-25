/**
 * GLFT
 * default:
 * .gltf json data about the model
 * .bin vertex data etc.
 *
 * binary:
 * usually lighter, but not customizable.
 *
 * draco:
 * compressed
 *
 * embedded:
 * json with .bin embedded
 *
 * If you want to be able to alter the textures or the coordinates of the lights after exporting, you better go for the glTF-default. It also presents the advantage of loading the different files separately, resulting in a load speed improvement.
 *
 * If you want only one file per model and don't care about modifying the assets, you better go for glTF-Binary.
 *
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as dat from "lil-gui";
import "./style.css";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader(); // instanciate before gltfLoader
dracoLoader.setDecoderPath("assets/draco/"); // get this from node_modules/three/examples/js/libs

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
// gltfLoader.load(
//     '/models/Duck/glTF/Duck.gltf', // Default glTF
// // Or
// gltfLoader.load(
//     '/models/Duck/glTF-Binary/Duck.glb', // glTF-Binary
// // Or
// gltfLoader.load(
//     '/models/Duck/glTF-Embedded/Duck.gltf', // glTF-Embedded
//
//     Duck:
// gltfLoader.load(
//   "assets/models/Duck/glTF/Duck.gltf",
//   (gltf) => {
//     console.log("success");
//     console.log(gltf);

//     // only add the model, not the rest of the scene (PerspectiveCamera ...)
//     scene.add(gltf.scene.children[0]);
//   },
//   (progress) => {
//     console.log("progress");
//     console.log(progress);
//   },
//   (error) => {
//     console.log("error");
//     console.log(error);
//   }
// );

// gltfLoader.load("assets/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//   // while (gltf.scene.children.length) {
//   // scene.add(gltf.scene.children[0]); // scene.add removes the child from the loaded model. Thats why for-each would not work here.
//   // }

//   // alternative: spread copy the original:
//   // const children = [...gltf.scene.children];
//   // for (const child of children) {
//   //   scene.add(child);
//   // }

//   // or the whole scene:
//   scene.add(gltf.scene);
// });

// With Draco:
gltfLoader.load("assets/models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
  console.log("success");
  console.log(gltf);

  // only add the model, not the rest of the scene (PerspectiveCamera ...)
  const duck = gltf.scene.children[0];
  duck.scale.set(0.001, 0.001, 0.001);
  scene.add(duck);
});

let mixer = null;
// Fox:
gltfLoader.load("assets/models/Fox/glTF/Fox.gltf", (gltf) => {
  // Animations:
  mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[1]); // [0] = looking around animation, [1] = walking, [2] = running
  action.play(); // make sure to muxer.update() each frame

  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update animation mixer
  mixer?.update(deltaTime);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
