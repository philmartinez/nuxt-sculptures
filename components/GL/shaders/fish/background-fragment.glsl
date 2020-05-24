precision mediump float;

varying vec2 vUv;

uniform vec3 uCurrColor;
uniform vec3 uNextColor;
uniform vec2 uMeshSize;
uniform float uTime;
uniform float uProg;

void main() {

  vec2 uv = vUv;

  vec3 finalColor = mix(uCurrColor, uNextColor, uProg); 
  
  gl_FragColor = vec4(finalColor,1.0);
}