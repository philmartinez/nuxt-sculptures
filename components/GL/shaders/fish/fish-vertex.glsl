precision mediump float;

varying vec2 vUv;


uniform float uAmp;
uniform float uTimeProg;
uniform float uMultiplier;
uniform float uPreview;
uniform float uPreviewTimeProg;
uniform float uTime;
uniform float uVelo;

void main() {

  vUv = uv;

  lowp float vWave = cos(uTime*10.0 + (position.x + position.y)*4.)*4.;

  lowp float swimDir = position.x + ((sin(uv.y * 3.141592653) * uVelo) * 0.15);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(swimDir, position.y, vWave*15.*uPreview, 1.0);
}