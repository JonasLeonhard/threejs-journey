import * as THREE from "three";

// Canvas
const canvas = document.querySelector("#webgl");

// Scene
const scene = new THREE.Scene();
/**
 * Groups
 */
const group = new THREE.Group();
scene.add(group);

/**
 * Objects
 */
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube2.position.x = -2;

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube3.position.x = 2;

group.add(cube1);
group.add(cube2);
group.add(cube3);
group.rotation.y = Math.PI * 0.25;

// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.z = 3
camera.position.set(0, 0, 3);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
