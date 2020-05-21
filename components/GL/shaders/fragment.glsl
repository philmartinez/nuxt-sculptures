precision mediump float;

varying vec2 vUv;

uniform sampler2D uCurrTex;
uniform sampler2D uNextTex;
uniform sampler2D uDisp;
uniform vec2 uMeshSize;
uniform vec2 uImageSize;
uniform float uTime;
uniform float uProg;

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

void main() {
  vec2 uv = vUv;
  vec2 texUv = backgroundCoverUv(uv, uMeshSize, uImageSize);
  
  vec4 disp = texture2D(uDisp, uv);
 
  //vec4 currTex = texture2D(uCurrTex, texUv - vec2(disp.r * uProg, 0.));
  //vec4 nextTex = texture2D(uNextTex, texUv + vec2(disp.r * (1. - uProg), 0 ));
  vec4 currTex = texture2D(uCurrTex, texUv );
  vec4 nextTex = texture2D(uNextTex, texUv );

  vec4 finalTex = mix(currTex, nextTex, uProg);
  
  gl_FragColor = finalTex;
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