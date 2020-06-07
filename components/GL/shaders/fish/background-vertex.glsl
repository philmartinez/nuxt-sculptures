
uniform float uProg;
uniform float uTime;
uniform float uAmp;

varying vec3 vPos;
varying vec2 vUv;
varying float vWave;

void main() {

  vUv = uv;
  vPos = position;

  vWave = sin((position.x + position.y)*12. + uTime*2.5);
  vPos.z = vWave*10.*uAmp;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, vPos.z, 1.0);
}