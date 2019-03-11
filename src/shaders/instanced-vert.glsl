#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor; // Non-instanced, and presently unused
in vec4 vs_Col; // An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec3 vs_Forward;
in vec3 vs_Right;
in vec3 vs_Up;
in vec3 vs_Scale;
in vec3 vs_Type;
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

out vec4 fs_Col;
out vec2 type;
out vec4 fs_Pos;
out vec4 fs_Nor;
out vec4 fs_LightVec;

void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;
    fs_Nor = normalize(vec4(vec3(u_ViewProj * vs_Nor), 0));
    fs_LightVec = vec4(0,2,-1,1);

    vec3 offset = vs_Translate;
    //offset.z = (sin((u_Time + offset.x) * 3.14159 * 0.1) + cos((u_Time + offset.y) * 3.14159 * 0.1)) * 1.5;

    //vec3 billboardPos = offset + vs_Pos.x * u_CameraAxes[0] + vs_Pos.y * u_CameraAxes[1];
    //gl_Position = O*T * gl_Position;
    mat3 O = mat3(vs_Forward,
                  vs_Right,
                  vs_Up);
    mat3 scaleMatrix = mat3(vec3(vs_Scale.x, 0.0, 0.0),
                            vec3(0.0, vs_Scale.y, 0.0),
                            vec3(0.0, 0.0, vs_Scale.z));
    //gl_Position = O * T * vec4(vec3(gl_Position), 0.0);

    if (offset.x == 0.0 && offset.y == -32.0 && offset.z == 0.0) {
        type = vec2(1,0);
        gl_Position = u_ViewProj * vec4( (O * scaleMatrix * (vec3(vs_Pos))) + offset, 1.0 );
    } else {
        type = vec2(0,1);
        vec3 move = vec3(0.0,0.0,0.0);
        if (vs_Type.x == 1.0 && vs_Type.z == 1.0) {
            move = vec3(0.2*sin(0.1*u_Time), 0.0, 0.0);
        }
        gl_Position = u_ViewProj * vec4( (transpose(O) * scaleMatrix * (vec3(vs_Pos))) + offset - move, 1.0 );
    }

     
    
}
