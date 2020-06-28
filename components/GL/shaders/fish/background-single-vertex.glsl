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
  //vPos = position;
  vec3 pos = position.xyz;


  float activation = (+uv.x-uv.y+1.)/2.;
  
  // delayed activation
  float latestStart = 0.5;
  float startAt = activation * latestStart;
  float vertexProgress = smoothstep(startAt,1.,uAmp);

  // flip
  float flippedX = -pos.x;
  pos.x = mix(pos.x,flippedX, vertexProgress);
	pos.z += vertexProgress;

		
  vec2 scaleToViewSize = uViewSize / uMeshScale - 1.;
  vec2 scale = vec2(
    1. + scaleToViewSize * vertexProgress
  );
  pos.xy *= scale;

  vWave = pos.x;
  //vPos.z = vWave*10.;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}