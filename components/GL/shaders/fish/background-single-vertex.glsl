uniform float uProg;
uniform float uTime;
uniform float uAmp;
uniform float uTimeProg;
uniform float uVelo;
uniform vec2 uMeshScale;
uniform vec2 uViewSize;
uniform vec2 uMeshPosition;

varying vec3 vPos;
varying vec2 vUv;
varying float vWave;

void main() {

  vUv = uv;
  vPos = position;

  // Activation for left-to-right
  float activation = uv.x;
  float latestStart = 0.5;
  float startAt = activation * latestStart;

  float vertexProgress = smoothstep(startAt,1.,uAmp);
		
  vec2 scaleToViewSize = uViewSize / uMeshScale - 1.;
  vec2 scale = vec2(
    1. + scaleToViewSize * vertexProgress
  );
  vPos.xy *= scale;

  vWave = -vPos.x;
  //vPos.z = vWave*10.;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPos.x, vPos.y, vPos.z, 1.0);
}