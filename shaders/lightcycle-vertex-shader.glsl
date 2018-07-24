attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
attribute vec2 a_TexCoord;

uniform mat4 u_projViewMatrix;
uniform mat4 u_ModelMatrix;    // Model matrix
uniform mat4 u_NormalMatrix;   // Transformation matrix of the normal

varying vec4 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
varying vec2 v_TexCoord;


void main() {
    gl_Position = u_projViewMatrix * u_ModelMatrix * a_Position;

     // Calculate the vertex position in the world coordinate
    v_Position = vec3(u_ModelMatrix * a_Position);
    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
    v_Color = a_Color;
    v_TexCoord =  a_TexCoord;

}




//attribute vec4 a_Position;
//attribute vec4 a_Color;
//attribute vec4 a_Normal;
//attribute vec2 a_TexCoord;
//
//uniform mat4 u_projViewMatrix;
//uniform mat4 u_SMatrix;
//uniform mat4 u_ModelMatrix;    // Model matrix
////uniform mat4 u_NormalMatrix;   // Transformation matrix of the normal
//
//varying vec4 v_Color;
////varying vec3 v_Normal;
////varying vec3 v_Position;
//varying vec2 v_TexCoord;
//
//uniform vec3 u_LightColor;     // Directional Light color
//uniform vec3 u_LightDirection; // Light direction (in the world coordinate, normalized)
//uniform vec3 u_AmbientLight;   // Color of an ambient light
//
//void main() {
//    gl_Position = u_projViewMatrix * u_ModelMatrix * u_SMatrix * a_Position;
//
//     // Calculate the vertex position in the world coordinate
////    v_Position = vec3(u_ModelMatrix * a_Position);
////    v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
//
//
//    // Make the length of the normal 1.0
//    vec3 normal = normalize(a_Normal.xyz);
//    // Dot product of the light direction and the orientation of a surface (the normal)
//    float nDotL = max(dot(u_LightDirection, normal), 0.0);
//    // Calculate the color due to diffuse reflection
//    vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;
//   // Calculate the color due to ambient reflection
//    vec3 ambient = u_AmbientLight * a_Color.rgb;
//   // Add the surface colors due to diffuse reflection and ambient reflection
//    v_Color = vec4(diffuse + ambient, a_Color.a);
////    v_Color = a_Color;
//
//
//    v_TexCoord =  a_TexCoord;
//}
//
