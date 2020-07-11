
varying vec2 vUv;

varying vec3 vPos;
varying float vWave;

uniform vec3 uColor;

uniform float uVelo;
uniform vec2 uMeshSize;
uniform float uTime;
uniform float uProg;
uniform float uShadowAmp;
uniform float width;
uniform float scaleX;
uniform float scaleY;
uniform float uAmp;
uniform vec2 uResolution;



float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


float PI = 3.14159;

void main() {
  /*
  float wave = vWave;
  wave = map(wave, -1., 1., 0.53, 0.);
  float shadow = 1. - (wave*uShadowAmp);
  */

  vec2 uv = vUv;
  float shadow = smoothstep(0., 0.35, length(vec2(uv.x,uv.y*2.8) - vec2( (uVelo*-0.1)+0.45,0.9) ) );

 // vec3 finalColor = mix(uCurrColor*shadow, uNextColor*shadow, uProg); 
  vec3 shadowColor =uColor*shadow;
  vec3 mixedColor = mix(uColor,shadowColor,0.3*uShadowAmp);
  gl_FragColor = vec4(mixedColor,1.0); 
  
/*
	float dt = parabola(uProg,0.9);
	float w = width*dt;
	float border = 1.;
	
	vec2 newUV = (vUv - vec2(0.5)) + vec2(0.5);

	vec3 color1 = uCurrColor*shadow;
	vec3 color2 = uNextColor*shadow;

	float noise = sin(newUV.y*PI-0.);

	float maskvalue = smoothstep(1.-w, 1., vUv.x + mix(-w/2., 1. - w/2., uProg));

	float mask = maskvalue + maskvalue*noise+0.4;

	float final = smoothstep(border,border+.005,mask); 
	gl_FragColor = vec4(mix(color1,color2,final),1.);  */

}