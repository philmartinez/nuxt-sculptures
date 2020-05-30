
varying vec2 vUv;
varying vec4 vPosition;

uniform vec3 uCurrColor;
uniform vec3 uNextColor;
uniform vec2 uMeshSize;
uniform float uTime;
uniform float uProg;
uniform float width;
uniform float scaleX;
uniform float scaleY;

// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


float parabola( float x, float k ) {
  return pow( 1. * x * ( 1. - x ), k );
}

float PI = 3.14159;

void main() {
/*
  vec2 uv = vUv;

  vec3 finalColor = mix(uCurrColor, uNextColor, uProg); 
  
  gl_FragColor = vec4(finalColor,1.0); */

	float dt = parabola(uProg,0.9);
	float w = width*dt;
	float border = 1.;
	
	vec2 newUV = (vUv - vec2(0.5)) + vec2(0.5);

	vec3 color1 = uCurrColor;
	vec3 color2 = uNextColor;

	float noise = sin(newUV.y*PI-0.);

	float maskvalue = smoothstep(1.-w, 1., vUv.x + mix(-w/2., 1. - w/2., uProg));

	float mask = maskvalue + maskvalue*noise+0.4;

	float final = smoothstep(border,border+.005,mask); 
	gl_FragColor = vec4(mix(color1,color2,final),1.);

}