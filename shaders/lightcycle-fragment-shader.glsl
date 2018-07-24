#ifdef GL_ES
precision mediump float;
#endif
uniform vec3 u_LightColor;       // Light color
uniform vec3 u_LightDirection;  // Position of the light source
uniform vec3 u_AmbientLight;   // Ambient light color
uniform vec3 u_LightPosition;
//uniform vec3 u_LightSpecular;

varying vec3 v_Normal;
varying vec3 v_Position;
varying vec4 v_Color;

uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;


void main() {
     // Normalize the normal because it is interpolated and not 1.0 in length any more
    vec3 normal = normalize(v_Normal);
     // Calculate the light direction and make its length 1.
    vec3 lightDirection = normalize(u_LightPosition - v_Position);
     // The dot product of the light direction and the orientation of a surface (the normal)
    float nDotL = max(dot(lightDirection, normal), 0.0);
     // Calculate the final color from diffuse reflection and ambient reflection
    vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;
    vec3 ambient = u_AmbientLight * v_Color.rgb;

    gl_FragColor = vec4(diffuse + ambient, v_Color.a)* normalize(texture2D(u_Sampler, v_TexCoord));
    gl_FragColor.w = 1.0;

}


//#ifdef GL_ES
//precision mediump float;
//#endif
//
//varying vec4 v_Color;
//varying vec2 v_TexCoord;
//
//uniform sampler2D u_Sampler;
//void main() {
//  gl_FragColor = v_Color * normalize(texture2D(u_Sampler, v_TexCoord));
//  gl_FragColor.w = 1.0;
//}