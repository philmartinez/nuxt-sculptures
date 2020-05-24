precision mediump float;

varying vec2 vUv;


uniform float uAmp;
uniform float uTimeProg;

void main() {

  vUv = uv;

  lowp float vWave = cos(uTimeProg*2.0 + (position.x + position.y)*35.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 1, 1.0);
}