export const gradientIris = `
const float PI = 3.1415926535;

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    float res = 60.;
    vec2 uvc = vec2(floor(mod(atan((uv.x-.5)*iResolution.x/iResolution.y,(uv.y-.5)),2.*PI)/(2.*PI)*res)/res/5.,.25);
    
    float len = (length(vec2((uv.x-.5)/iResolution.y*iResolution.x,uv.y-.5))-.1)*2.;
    
    float vol = 1.5;
    float base = .16;
    float height = max(base,texture(iChannel0,uvc).r*vol);
    vec3[] cols = vec3[](
        vec3(.026,.126,2.75),
        vec3(.211,.292,.77),
        vec3(.095,.793,.295),
        vec3(.843,.624,.134),
        vec3(1,.235,.11)
    );
    
    vec3 col = vec3(cols[int(clamp(height,0.,1.)*4.)]+mod(clamp(height,0.,1.),.25)*4.*(cols[int(clamp(height,0.,1.)*4.)+1]-cols[int(clamp(height,0.,1.)*4.)]))*2.;
    
    float width = .5;
    float radius = .15;
    col *= float(radius < len && len < height && abs(mod(mod(atan((uv.x-.5)*iResolution.x/iResolution.y,(uv.y-.5)),2.*PI),PI/res))<PI*width/res)*len;

    // Output to screen
    fragColor = vec4(col,1.0);
}
`