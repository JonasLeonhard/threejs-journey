import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("assets/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("assets/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "assets/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("assets/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("assets/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "assets/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "assets/textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("assets/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("assets/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentTexture = cubeTextureLoader.load([
  "assets/textures/environmentMaps/0/px.jpg",
  "assets/textures/environmentMaps/0/nx.jpg",
  "assets/textures/environmentMaps/0/py.jpg",
  "assets/textures/environmentMaps/0/ny.jpg",
  "assets/textures/environmentMaps/0/pz.jpg",
  "assets/textures/environmentMaps/0/nz.jpg",
]);
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects, it is better to have the same material on all objects for performance reasons
 */
// const sphereMaterial = new THREE.MeshBasicMaterial(); // could also pass map directly MeshBasicMaterial({ map: doorColorTexture })
// sphereMaterial.map = doorColorTexture;
// material.opacity = 0.5;
// sphereMaterial.transparent = true;
// sphereMaterial.alphaMap = doorAlphaTexture;
// sphereMaterial.side = THREE.DoubleSide; // also show inside of meshes, but at computation cost. Better use FrontSide or BackSide instead.

// const sphereMaterial = new THREE.MeshNormalMaterial();
// sphereMaterial.flatShading = true; // have no color smoothing between verticies/polygons

// const sphereMaterial = new THREE.MeshMatcapMaterial();
// sphereMaterial.matcap = matcapTexture;
const doorMaterial = new THREE.MeshStandardMaterial(); // pbr rendering material
doorMaterial.roughness = 0.2; // dont combine with metalnessMap
doorMaterial.metalness = 0.7; // dont combine with roughnessMap
doorMaterial.side = THREE.DoubleSide;
doorMaterial.map = doorColorTexture;
doorMaterial.aoMap = doorAmbientOcclusionTexture;
doorMaterial.transparent = true;
doorMaterial.alphaMap = doorAlphaTexture;
doorMaterial.aoMapIntensity = 1;
doorMaterial.displacementMap = doorHeightTexture;
doorMaterial.displacementScale = 0.05;
// doorMaterial.metalnessMap = doorMetalnessTexture;
// doorMaterial.roughnessMap = doorRoughnessTexture;
doorMaterial.normalMap = doorNormalTexture;
doorMaterial.normalScale.set(0.5, 0.5);
doorMaterial.envMap = environmentTexture;

gui.add(doorMaterial, "metalness").min(0).max(1).step(0.0001);
gui.add(doorMaterial, "roughness").min(0).max(1).step(0.0001);
gui.add(doorMaterial, "aoMapIntensity").min(0).max(1).step(0.0001);
gui.add(doorMaterial, "displacementScale").min(0).max(1).step(0.0001);

// const torusMaterial = new THREE.MeshDepthMaterial();
// const torusMaterial = new THREE.MeshLambertMaterial(); // very perfomant, but strange light patterns
// const torusMaterial = new THREE.MeshPhongMaterial(); // less performant, but no light patterns, has light reflections
// torusMaterial.shininess = 100;
// torusMaterial.specular = new THREE.Color(0x1188ff);
const torusMaterial = new THREE.MeshToonMaterial();
torusMaterial.gradientMap = gradientTexture;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  doorMaterial
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 64, 64),
  doorMaterial
);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  torusMaterial
);

torus.position.x = 1.5;

scene.add(sphere);
scene.add(plane);
scene.add(torus);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(ambientLight);
scene.add(pointLight);
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
camera.position.z = 2;
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

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
