precision mediump float;

varying vec2 vUv;

uniform float uTime;
uniform float uAmp;

void main() {

  vUv = uv;

  lowp float vWave = sin(uTime*9.0 + (position.x + position.y)*5.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, vWave*(7.0*uAmp), 1.0);
}