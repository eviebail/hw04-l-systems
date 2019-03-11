#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec2 type;

out vec4 out_Col;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float interpNoise2D(float x, float y) {
  float intX = floor(x);
  float fractX = fract(x);
  float intY = floor(y);
  float fractY = fract(y);

  float v1 = rand(vec2(intX, intY));
  float v2 = rand(vec2(intX + 1.f, intY));
  float v3 = rand(vec2(intX, intY + 1.f));
  float v4 = rand(vec2(intX + 1.f, intY + 1.f));

  float i1 = mix(v1, v2, fractX);
  float i2 = mix(v3, v4, fractX);

  return mix(i1, i2, fractY);
}

float fbm(float x, float y) {
  float roughness = 1.f;
  float total = 0.f;
  float persistence = 0.5f;
  int octaves = 8;

  for (int i = 0; i < octaves; i++) {
    float freq = pow(2.f, float(i));
    float amp = pow(persistence, float(i));

    total += interpNoise2D(x * freq, y * freq) * amp * roughness;
    roughness *= interpNoise2D(x*freq, y*freq);
  }
  return total;
}

void main()
{
    //lets do lambert shading!
    //float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    //out_Col = /*vec4(dist) * */ fs_Col;

    float noise = smoothstep(0.0,0.5,fbm(fs_Pos.x, fs_Pos.y)) + smoothstep(0.0,0.7,fbm(fs_Pos.y, fs_Pos.x));
    float noise1 = smoothstep(0.0,0.5,fbm(fs_Pos.x, fs_Pos.y)) + smoothstep(0.0,0.7,fbm(fs_Pos.z, fs_Pos.x));


    vec4 diffuseColor = fs_Col;
    float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
    // Avoid negative lighting values
    diffuseTerm = clamp(diffuseTerm, 0.0, 1.0);
    vec3 lightColor = vec3(175.0 / 255.0, 126.0 / 255.0, 221.0 / 255.0);

    float ambientTerm = 0.2;

    float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                        //to simulate ambient lighting. This ensures that faces that are not
                                                        //lit by our point light are not completely black.

    // Compute final shaded color
    if (type.x == 0.0) {
      out_Col = vec4(vec3(diffuseColor.rgb * lightIntensity * lightColor * noise), 1);
    } else {
      out_Col = vec4(vec3(diffuseColor.rgb * lightIntensity * lightColor * noise1), 1);
    }
    

}
