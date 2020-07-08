uniform float uProg;
uniform float uTime;
uniform float uAmp;
uniform float uTimeProg;
uniform float uVelo;

uniform vec2 uResolution;
uniform vec2 uMeshScale;
uniform float uViewHeight;
uniform vec2 uEndSize;
uniform vec2 uPlaneCenter;
uniform vec2 uMeshPosition;

varying vec3 vPos;
varying vec2 vUv;
varying float vWave;

void main() {

  vUv = uv;
  //vPos = position;
  vec3 pos = position.xyz;


  float activation = 1.- uv.y;
  
  // delayed activation
  float latestStart = 0.5;
  float startAt = activation * latestStart;
  float vertexProgress = smoothstep(startAt,1.,uAmp);

  // flip
  //float flippedX = -pos.x;
  //pos.x = mix(pos.x,flippedX, vertexProgress);
	//pos.z += vertexProgress;

	// Alter size
  vec2 scaleToViewSize = uEndSize / uMeshScale - 1.;
  vec2 scale = vec2(
    1. + scaleToViewSize * vertexProgress
  );
  pos.xy *= scale;


  //pos.y += -uPlaneCenter.y * vertexProgress;


  // Move towards top
  //os.y += ((uViewHeight / uResolution.y)/2. - (uEndSize.y/ uResolution.y)/2.) * vertexProgress;

//pos.y += (uViewHeight/ uResolution.y)  * vertexProgress;
  vWave = pos.x;
  //vPos.z = vWave*10.;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}