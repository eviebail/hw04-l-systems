#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;
in vec4 fs_LightVec;

out vec4 out_Col;

void main()
{
    //lets do lambert shading!
    //float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    //out_Col = /*vec4(dist) * */ fs_Col;

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
    out_Col = vec4(vec3(diffuseColor.rgb * lightIntensity * lightColor), 1);

}
