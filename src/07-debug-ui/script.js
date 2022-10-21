/*
  Creates Debug ui using lil-gui. Alternatives could be:
  - control-panel
  - ControlKit
  - Guify
  - Oui
  - dat.GUI
*/
import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// Globals
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const parameters = {
  spin: () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 1 });
  },
};

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Events
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Debug
const gui = new GUI({ width: 400 });
// gui.close();
const positionFolder = gui.addFolder("Position");
positionFolder
  .add(mesh.position, "x")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("x - horizontal");
positionFolder
  .add(mesh.position, "y")
  .min(-3)
  .max(3)
  .step(0.01)
  .name("y - verical");
positionFolder.add(mesh.position, "z").min(-3).max(3).step(0.01);

const displayFolder = gui.addFolder("Display");
displayFolder.add(mesh, "visible").name("Box Visible");
displayFolder.add(material, "wireframe").name("Box Wireframe");
displayFolder
  .addColor(material, "color")
  .onChange((data) => console.log("Color changed! ", data));

displayFolder.add(parameters, "spin");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
