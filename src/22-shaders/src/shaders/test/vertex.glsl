// |-> ShaderMaterial already declares the below attributes / uniforms:
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;

// attribute vec3 position;
// attribute vec2 uv; // buildin attribute (see console.log(geometry.attributes))

// |-> provided by three.js

// float exampleFunction(float a, float b) {
//   return a + b;
// }

attribute float aRandom; // set via setAttribute

uniform vec2 uFrequency; // set via uniform
uniform float uTime;

varying vec2 vUv; // this will be set in the vertex shader, and send to the fragment shader?
varying float vElavation;

void main() {
  // float someFloat = -0.123; // + - * /
  // int someInt = 1;
  // vec2 someVec = vec2(0.0, 1.0); // access via someVec.x someVec.y
  // vec3 someVec3 = vec3(0.0, 1.0, 2.0);
  // vec2 someVec2CreatedFromOther = someVec3.xy; // <- creates a vec2 from other attributes
  // vec4 someVec4 = vec4(0.0, 1.0, 2.0, 3.0); // access via someVec4.w
  // bool a = false;

  // float result = exampleFunction(1.0, 2.0);

  // INFO: builtin functions are:
  // sin, cos, amx, min, pow, exp, mod, sclamp, cross, dot, mix, step, smoothstep, length, distance, reflect, refract, normalize ...
  // good learning resources: Shaderific, Book of Shaders glossary, Kronos Group registery

  // |-> gl position already exists in glsl, it could be accesses as gl_Position.x = 1.0 - which is the wrong way, but would work.
  // |          |-> transform coordinates into the final clip space coordinates
  // |          |                  |-> apply transformations relative to the camera (position, rotation, fov, near, far)
  // |          |                  |            |-> transform relative to the mesh
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

  modelPosition.z = elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // vRandom = aRandom;
  vUv = uv;
  vElavation = elevation;
}
