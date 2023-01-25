/**
Ammo.js
Website: http://schteppe.github.io/ammo.js-demos/
Git repository: https://github.com/kripken/ammo.js/
Documentation: No documentation
Direct JavaScript port of Bullet (a physics engine written in C++)
A little heavy
Still updated by a community
Cannon.js
Website: https://schteppe.github.io/cannon.js/
Git repository: https://github.com/schteppe/cannon.js
Documentation: http://schteppe.github.io/cannon.js/docs/
Lighter than Ammo.js
More comfortable to implement than Ammo.js
Mostly maintained by one developer
Hasn't been updated for many years
There is a maintained fork
Oimo.js
Website: https://lo-th.github.io/Oimo.js/
Git repository: https://github.com/lo-th/Oimo.js
Documentation: http://lo-th.github.io/Oimo.js/docs.html
Lighter than Ammo.js
Easier to implement than Ammo.js
Mostly maintained by one developer
Hasn't been updated for 2 years
2D Physics
For 2D physics, there are many libraries, but here's the most popular:

Matter.js
Website: https://brm.io/matter-js/
Git repository: https://github.com/liabru/matter-js
Documentation: https://brm.io/matter-js/docs/
Mostly maintained by one developer
Still kind of updated
P2.js
Website: https://schteppe.github.io/p2.js/
Git repository: https://github.com/schteppe/p2.js
Documentation: http://schteppe.github.io/p2.js/docs/
Mostly maintained by one developer (Same as Cannon.js)
Hasn't been update for 2 years
Planck.js
Website: https://piqnt.com/planck.js/
Git repository: https://github.com/shakiba/planck.js
Documentation: https://github.com/shakiba/planck.js/tree/master/docs
Mostly maintained by one developer
Still updated nowadays
Box2D.js
Website: http://kripken.github.io/box2d.js/demo/webgl/box2d.html
Git repository: https://github.com/kripken/box2d.js/
Documentation: No documentation
Mostly maintained by one developer (same as Ammo.js)
Still updated nowadays
We won't use a 2D library in this lesson, but the 2D library code would be very similar to a 3D library code. The main difference is the axes you have to update.

There are already solutions that try to combine Three.js with libraries like Physijs. Still, we won't use any of those solutions to get a better learning experience and better understand what's going on.

While Ammo.js is the most used library and particularly with Three.js, as you can see in the examples, we will go for Cannon.js. The library is more comfortable to implement in our project and easier to use.
*/
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es"; // cannon is outdated!
import "./style.css";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 * Physics
 */
const world = new CANNON.World();
const EARTH_GRAVITY_CONSTANT = -9.82;
world.gravity.set(0, EARTH_GRAVITY_CONSTANT, 0);
// There are 3 broadphase algorithms available in Cannon.js:

// NaiveBroadphase: Tests every Bodies against every other Bodies
// GridBroadphase: Quadrilles the world and only tests Bodies against other Bodies in the same grid box or the neighbors' grid boxes.
// SAPBroadphase (Sweep and prune broadphase): Tests Bodies on arbitrary axes during multiples steps.
world.broadphase = new CANNON.SAPBroadphase(world); // be careful about very fast moving objects with grid & sap broadphase
/**
 * When the Body speed gets incredibly slow (at a point where you can't see it moving), the Body can fall asleep and won't be tested unless a sufficient force is applied to it by code or if another Body hits it.
 * */
world.allowSleep = true;

const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");

// define what happens when both materials collide.
const defaultContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7, // how much the ridgitbody gets repelled.
  }
);
world.defaultContactMaterial = defaultContactMaterial;
world.addContactMaterial(defaultContactMaterial);

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Sounds
 */
const hitSound = new Audio("assets/sounds/hit.mp3");

const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

// /**
//  * sphere
//  */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

// /**
//  * Sphere Rigidbody composed of shapes.
//  */
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   material: plasticMaterial,
// });
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );
// world.addBody(sphereBody);

/**
 * Utils
 */
const objectsToUpdate = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Sphere(radius);

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultContactMaterial,
  });
  body.position.copy(position);

  body.addEventListener("collide", playHitSound);

  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({
    mesh,
    body,
  });
};

// add to gui
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createSphere");

// createSphere(0.5, { x: 0, y: 3, z: 0 });

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js ridgidbody composed of shapes
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultContactMaterial,
  });
  body.position.copy(position);

  body.addEventListener("collide", playHitSound);

  world.addBody(body);

  // Save in objects
  objectsToUpdate.push({ mesh, body });
};

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });

// add to gui
debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createBox");

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Floor Rigidbody composed of Shapes.
 */
const floorShape = new CANNON.Plane(); // infinite plane
const floorBody = new CANNON.Body({
  material: concreteMaterial,
  mass: 0,
});
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // rotate the floor plane
world.addBody(floorBody);

// Reset
debugObject.reset = () => {
  for (const object of objectsToUpdate) {
    // Remove body
    object.body.removeEventListener("collide", playHitSound);
    world.removeBody(object.body);

    // Remove mesh
    scene.remove(object.mesh);
  }

  // clear array
  objectsToUpdate.splice(0, objectsToUpdate.length);
};
gui.add(debugObject, "reset");

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

  // Apply physics
  const PHYSICS_FPS = 1 / 60;
  const PHYSICS_SUBSTEPS = 3;
  world.step(PHYSICS_FPS, deltaTime, PHYSICS_SUBSTEPS);

  // sphere.position.x = sphereBody.position.x;
  // sphere.position.y = sphereBody.position.y;
  // sphere.position.z = sphereBody.position.z;
  // sphere.position.copy(sphereBody.position);
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Going Further:
 */

// Constraints
// Constraints, as the name suggests, enable constraints between two bodies. We won't cover those in this lesson, but here's the list of constraints:

// HingeConstraint: acts like a door hinge.
// DistanceConstraint: forces the bodies to keep a distance between each other.
// LockConstraint: merges the bodies like if they were one piece.
// PointToPointConstraint: glues the bodies to a specific point.
//
// Workers
// Running the physics simulation takes time. The component of your computer doing the work is the CPU. When you run Three.js, Cannon.js, your code logic, etc. everything is done by the same thread in your CPU. That thread can quickly overload if there is too much to do (like too many objects in the physics simulation), resulting in a frame rate drop.

// The right solution is to use workers. Workers let you put a part of your code in a different thread to spread the load. You can then send and receive data from that code. It can result in a considerable performance improvement.

// The problem is that the code has to be distinctly separated. You can find a good and simple example here in the page source code.
