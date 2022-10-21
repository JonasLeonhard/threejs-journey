import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// import imageSource from "../../static/textures/door/color.jpg";

// manual TextureLoader
// const image = new Image();
// image.onload = () => {
//   const texture = new THREE.Texture(image);
//   // would have to move mesh material here to use texture...
// };
// image.src = "/assets/textures/door/color.jpg";

// manual TextureLoader
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.onload = () => {
//   texture.needsUpdate = true;
// };
// image.src = "/assets/textures/door/color.jpg";

// Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// const alphaMap = textureLoader.load("/assets/textures/door/alpha.jpg");
// const ambientOcclusionTexture = textureLoader.load(
//   "/assets/textures/door/ambientOcclusion.jpg"
// );
const colorTexture = textureLoader.load("/assets/textures/minecraft.png");
// const bumpMap = textureLoader.load("/assets/textures/door/height.jpg");
// const metalnessMap = textureLoader.load("/assets/textures/door/metalness.jpg");
// const normalMap = textureLoader.load("/assets/textures/door/normal.jpg");
// const roughnessMap = textureLoader.load("/assets/textures/door/roughness.jpg");

// Texture modifications
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping; // MirrorRepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
// colorTexture.rotation = Math.PI / 4; // 1/8 rotation in Radians
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

// Loading Events
loadingManager.onStart = (e) => console.log("onStart", e);
loadingManager.onLoaded = (e) => console.log("onLoaded", e);
loadingManager.onError = (e) => console.error("onError", e);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
// uv-cords for unwrapping in: geometry.attributes.uv
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
