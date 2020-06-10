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

  lowp float vWave = cos(uTimeProg + (position.x + position.y)*5.);

  lowp float vWavePreview = cos( uTime*12. + (position.x + position.y)*4.5) *uVelo;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, vWave*(uMultiplier*uAmp) + vWavePreview*20. *uVelo, 1.0);
}