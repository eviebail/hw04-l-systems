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
in vec2 vs_UV; // Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Nor;
out vec4 fs_LightVec;

void main()
{
    fs_Col = vs_Col;
    fs_Pos = vs_Pos;
    fs_Nor = normalize(vec4(vec3(u_ViewProj * vs_Nor), 0));
    fs_LightVec = vec4(0,1,0,1);

    vec3 offset = vs_Translate;
    //offset.z = (sin((u_Time + offset.x) * 3.14159 * 0.1) + cos((u_Time + offset.y) * 3.14159 * 0.1)) * 1.5;

    //vec3 billboardPos = offset + vs_Pos.x * u_CameraAxes[0] + vs_Pos.y * u_CameraAxes[1];
    //gl_Position = O*T * gl_Position;
    mat3 O = mat3(vs_Forward,
                  vs_Right,
                  vs_Up);
    mat3 rotation = mat3(vec3(cos(-90.0 * 3.14159 / 180.0), -sin(-90.0 
    * 3.14159 / 180.0), 0.0),
                         vec3(sin(90.0 * 3.14159 / 180.0), cos(90.0 * 3.14159 / 180.0), 0.0),
                         vec3(0.0,0.0,1.0));
    //gl_Position = O * T * vec4(vec3(gl_Position), 0.0);
    gl_Position = u_ViewProj * vec4(transpose(O) * vec3(vs_Pos) + offset, 1.0);//vec4(billboardPos, 1.0);
    
}
