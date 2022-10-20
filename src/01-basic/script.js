import * as THREE from "three";

const config = {
  width: 800,
  height: 600,
};

const scene = new THREE.Scene();

// ? Camera
const camera = new THREE.PerspectiveCamera(75, config.width / config.height);
camera.position.z = 3;
scene.add(camera);

// ? Box
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "purple" });
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.y = 1;
mesh.rotation.x = 0.5;
scene.add(mesh);

// ? Renderer
const canvas = document.getElementById("webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(config.width, config.height);

renderer.render(scene, camera);
