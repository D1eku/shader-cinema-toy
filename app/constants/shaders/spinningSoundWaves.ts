export const spinningSoundWaves = `

#define PI 3.141592654
#define FLIP_POINT 2. // For old version use 4.

// TODO: convert to floats and remove later div by 255
const vec3[] colors = vec3[](vec3(255,   0,   0), vec3(255, 127,   0),
                             vec3(255, 255,   0), vec3(  0, 255,   0),
                             vec3(  0,   0, 255), vec3( 75,   0, 130),
                             vec3(148,   0, 211));

mat2 rotate(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat2(
        c, -s,
        s, c
    );
}
    
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/iResolution.xy;
    uv *= 4.; uv.y -= 2.;
\t
    fragColor = vec4(0, 0, 0, 1);
    
\tfor (int i = 0; i < 7; i++)
    {
        vec2 r = rotate(float(i) * PI / 7. - iTime / 2.) * (uv - vec2(2, 0)) + vec2(2,0);
        
    \tfloat a = texture(iChannel0, vec2( r.x, 0.25)).x;
        
        float c = r.x < FLIP_POINT ? abs(r.y - a) : abs(-r.y - a) ;
        c = c < .02 ? pow(1. - c * 50., .75) : 0.;
        
    \tfragColor.rgb += c * colors[i] / 255.;
    }
}

`