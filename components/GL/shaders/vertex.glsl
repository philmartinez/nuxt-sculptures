precision mediump float;

varying vec2 vUv;


uniform float uAmp;
uniform float uTimeProg;

void main() {

  vUv = uv;

  lowp float vWave = cos(uTimeProg + (position.x + position.y)*5.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, vWave*(10.0*uAmp), 1.0);
}