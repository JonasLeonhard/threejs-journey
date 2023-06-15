// attribute vec2 uv; // <-- this would throw an error, because three shader material already sends this data to the shader

varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv; // send vUv to fragment shader
}
