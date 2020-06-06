
uniform float uProg;
uniform float uTime;
uniform float uAmp;
varying vec2 vUv;

void main() {

  vUv = uv;
  float wave = cos(uProg*3. + (position.x + position.y)*8.);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, wave*20.*uAmp, 1.0);
}