precision mediump float; // or highp, lowp

// varying float vRandom; // set via setVarying
uniform vec3 uColor; // set via uniform
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElavation;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElavation + 0.5;
  gl_FragColor = textureColor;
}
