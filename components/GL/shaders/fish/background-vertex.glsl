precision mediump float;

varying vec2 vUv;

void main() {

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, 1, 1.0);
}