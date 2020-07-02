precision mediump float;

varying vec2 vUv;

uniform sampler2D uTexture;
uniform sampler2D uDisp;

uniform vec2 uMeshSize;
uniform vec2 uImageSize;

uniform float uTime;
uniform float uProg;
uniform float uDistort;

vec2 backgroundCoverUv(vec2 uv, vec2 canvasSize, vec2 textureSize){
  vec2 ratio = vec2(
    min((canvasSize.x / canvasSize.y) / (textureSize.x / textureSize.y), 1.0),
    min((canvasSize.y / canvasSize.x) / (textureSize.y / textureSize.x), 1.0)
  );

  vec2 uvWithRatio = uv * ratio;

  return vec2(
    uvWithRatio.x + (1.0 - ratio.x) * 0.5,
    uvWithRatio.y  + (1.0 - ratio.y) * 0.5
  );
}

mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

const float PI = 3.1415;
const float angle1 = PI*0.1;
const float angle2 = -PI *0.75;

void main() {

  vec2 uv = vUv;
  vec2 texUv = backgroundCoverUv(uv, uMeshSize, uImageSize);
  
  
  vec4 texture = texture2D(uTexture, texUv);
  vec4 dispTexture = texture2D(uDisp, texUv);


  vec2 dispVec = vec2(dispTexture.r, dispTexture.g);

  vec2 distortedPosition1 = texUv * smoothstep(1.,1.5,dispVec / uDistort );
  vec4 t1 = texture2D(uTexture, distortedPosition1);

  //vec2 distortedPosition1 = dispVec;
  //vec2 t = mix(texUv,distortedPosition1,uDistort);
	//vec4 t1 = texture2D(uTexture, t);
 

  gl_FragColor = t1;

  //gl_FragColor = vec4(vec3(n), 1.);
}


/*

varying vec2 vUv;

uniform float dispFactor;
uniform float dpr;
uniform sampler2D disp;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float angle1;
uniform float angle2;
uniform float intensity1;
uniform float intensity2;
uniform vec4 res;
uniform vec2 parent;
mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}
void main() {
  vec4 disp = texture2D(disp, vUv);
  vec2 dispVec = vec2(disp.r, disp.g);
  vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy) ;
  vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
  vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;
  vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
  vec4 _texture1 = texture2D(texture1, distortedPosition1);
  vec4 _texture2 = texture2D(texture2, distortedPosition2);
  gl_FragColor = mix(_texture1, _texture2, dispFactor);
} */