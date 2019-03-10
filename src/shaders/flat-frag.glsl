#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

in vec2 fs_Pos;
out vec4 out_Col;

float random(vec2 ab) 
{
	float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
	return fract(f);
}

float noise(in vec2 xy) 
{
	vec2 ij = floor(xy);
	vec2 uv = xy-ij;
	uv = uv*uv*(3.0-2.0*uv);
	

	float a = random(vec2(ij.x, ij.y ));
	float b = random(vec2(ij.x+1., ij.y));
	float c = random(vec2(ij.x, ij.y+1.));
	float d = random(vec2(ij.x+1., ij.y+1.));
	float k0 = a;
	float k1 = b-a;
	float k2 = c-a;
	float k3 = a-b-c+d;
	return (k0 + k1*uv.x + k2*uv.y + k3*uv.x*uv.y);
}

vec3 myLerp (vec3 color1, vec3 color2, float percent) {
 	vec3 result = (color2 - color1) * percent + color1;
    return result;
}

void main() {

  vec3 skyColor = vec3(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0);
  vec3 horizonColor = vec3(70.0 / 255.0, 0.0 / 255.0, 160.0 / 255.0);

  out_Col = vec4(myLerp(horizonColor, skyColor, fs_Pos.y), 1.0); //vec4(0.5 * (fs_Pos + vec2(1.0)), 0.0, 1.0);
}
