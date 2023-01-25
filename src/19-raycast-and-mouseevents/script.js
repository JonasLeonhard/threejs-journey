import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
 * Mouse
 */
const mouse = new THREE.Vector2();
let currentIntersect = null;

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
  if (currentIntersect) {
    currentIntersect.object.material.color.set("#194d33");

    // you can also check for specific objects:
    // switch (currentIntersect.object) {
    //   case object1:
    //     console.log("click on object 1");
    //     object1.material.color.set("#194d33");
    //     break;

    //   case object2:
    //     console.log("click on object 2");
    //     object2.material.color.set("#194d33");
    //     break;

    //   case object3:
    //     console.log("click on object 3");
    //     object3.material.color.set("#194d33");
    //     break;
    // }
  }
});

/**
 * Model
 */
const gltfLoader = new GLTFLoader();

let duckModel = null;
gltfLoader.load("assets/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  console.log("loaded");
  duckModel = gltf.scene;
  duckModel.position.y = -1.2;
  scene.add(duckModel);
});

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 0.7);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// returns an array, because you could intersect with an object multiple times.
// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

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
camera.position.z = 3;
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

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // // Cast a ray
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();

  // raycaster.set(rayOrigin, rayDirection);

  // const objectsToTest = [object1, object2, object3];
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const object of objectsToTest) {
  //   object.material.color.set("#ff0000");
  // }

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }
  //

  // mouse:hover
  // raycaster.setFromCamera(mouse, camera);

  // const objectsToTest = [object1, object2, object3];
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");
  // }

  // for (const object of objectsToTest) {
  //   if (!intersects.find((intersect) => intersect.object === object)) {
  //     object.material.color.set("#ff0000");
  //   }
  // }

  raycaster.setFromCamera(mouse, camera);
  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  // mouse-enter & mouse-leave
  if (intersects.length) {
    if (!currentIntersect) {
      console.log("mouse enter", intersects[0]);
      intersects[0].object.material.color.set("#0000ff");
    }

    currentIntersect = intersects[0];
  } else {
    if (currentIntersect) {
      console.log("mouse leave", currentIntersect);

      currentIntersect.object.material.color.set("#ff0000");
    }

    currentIntersect = null;
  }

  // Test intersect with a model
  if (duckModel) {
    const RECURSIVLY_CHECK_ALL_IN_GROUP = true; // this is the default
    const modelIntersects = raycaster.intersectObject(
      duckModel,
      RECURSIVLY_CHECK_ALL_IN_GROUP
    );
    console.log("hovering duck?:", modelIntersects.length > 0);
    if (modelIntersects.length) {
      duckModel.scale.set(1.2, 1.2, 1.2);
    } else {
      duckModel.scale.set(1, 1, 1);
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
