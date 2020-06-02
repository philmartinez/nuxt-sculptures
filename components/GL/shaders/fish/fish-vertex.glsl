precision mediump float;

varying vec2 vUv;


uniform float uAmp;
uniform float uTimeProg;
uniform float uMultiplier;
uniform float uPreview;
uniform float uTime;

void main() {

  vUv = uv;

  lowp float vWave = cos(uTimeProg + (position.x + position.y)*5.);

  lowp float vWavePreview = cos( uTimeProg *0.8 + (position.x + position.y)*3.5);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, vWave*(uMultiplier*uAmp) + vWavePreview*6.* uPreview, 1.0);
}