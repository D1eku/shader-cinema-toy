export const fractalMicrophoneMove = `

#define pi 3.14159265359

//#define iTime tan(iTime*.1)+iTime*.1

float bassBoostLow = 0.0;
float bassBoostHigh = 0.0;
float time = 0.0;

vec3 hsv(in float h, in float s, in float v)
{
\treturn mix(vec3(1.0), clamp((abs(fract(h + vec3(3, 2, 1) / 3.0) * 6.0 - 3.0) - 1.0), 0.0 , 1.0), s) * v;
}

vec3 formula(in vec2 p, in vec2 c)
{
\tconst float n = 2.0;
\tconst int iters = 5;

\t//float time = iTime*0.1;
\tvec3 col = vec3(0);
\tfloat t = 1.0;
\tfloat dpp = dot(p, p);
\tfloat lp = sqrt(dpp);
\tfloat r = smoothstep(0.0, 0.2, lp);
\t
\tfor (int i = 0; i < iters; i++) {
\t\t// The transformation
        //p+=vec2(sin(c.x+p.x)*.01,
        //        cos(c.y+p.y)*.01);
        float to = bassBoostHigh;
        float index = mod(float(i)*1234.1234, 2.0);
        
        
        if(index < .1)
        {
        \tp = p*mat2(cos(cos(time+to)+time+to), -sin(cos(time+to)+time+to),
                   sin(cos(time+to)+time+to), cos(cos(time+to)+time+to));
\t\t\tp = abs(mod(p*(1.0) + c, n) - (n)/2.0);
        }
        else if(index < 1.1)
\t\t\tp = abs(mod(p*(1.0) + c, n) - (n)/2.0);//mod(p/dpp + c, n) - n/2.0;
        else if(index < 2.1)
\t\t\tp = p+to;
\t\t
\t\tdpp = dot(p, p);
        p /= dpp;
\t\tlp = pow(dpp, 1.5);
        
        
        //if(int(14.0*sin(iTime))+iters < i) break;

\t\t//Shade the lines of symmetry black
#if 0
\t\t// Get constant width lines with fwidth()
\t\tfloat nd = fwidth(dpp);
\t\tfloat md = fwidth(lp);
\t\tt *= smoothstep(0.0, 0.5, abs((n/2.0-p.x)/nd*n))
\t\t   * smoothstep(0.0, 0.5, abs((n/2.0-p.y)/nd*n))
\t\t   * smoothstep(0.0, 0.5, abs(p.x/md))
\t\t   * smoothstep(0.0, 0.5, abs(p.y/md));
#else
\t\t// Variable width lines
\t\tt *= smoothstep(0.0, 0.01, abs(n/2.0-p.x)*lp)
\t\t   * smoothstep(0.0, 0.01, abs(n/2.0-p.y)*lp)
\t\t   * smoothstep(0.0, 0.01, abs(p.x)*2.0) 
\t\t   * smoothstep(0.0, 0.01, abs(p.y)*2.0);
#endif

\t\t// Fade out the high density areas, they just look like noise
\t\tr *= smoothstep(0.0, 0.2, lp);
\t\t
\t\t// Add to colour using hsv
\t\tcol += lp+bassBoostHigh;
\t\t
\t}
\t
    col = vec3(sin(col.x+time*.125),
               sin(col.y+time*.125+4.0*pi/3.0),
               sin(col.z+time*.125+2.0*pi/3.0))*.5+.5;
    
\treturn col*t;
}

float lowAverage()
{
    const int iters = 32;
    float sum = 0.0;
    
    float last = length(texture(iChannel0, vec2(0.0)));
    float next;
    for(int i = 1; i < iters/2; i++)
    {
        next = length(texture(iChannel0, vec2(float(i)/float(iters), 0.0)));
        sum += last;//pow(abs(last-next), 1.0);
        last = next;
    }
    return sum/float(iters)*2.0;
}

float highAverage()
{
    const int iters = 32;
    float sum = 0.0;
    
    float last = length(texture(iChannel0, vec2(0.0)));
    float next;
    for(int i = 17; i < iters; i++)
    {
        next = length(texture(iChannel0, vec2(float(i)/float(iters), 0.0)));
        sum += last;//pow(abs(last-next), 1.0);
        last = next;
    }
    return sum/float(iters)*2.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
\tvec2 p = -1.0 + 2.0 * fragCoord.xy / iResolution.xy;
    
    bassBoostLow += lowAverage()*1.0;
    bassBoostHigh += highAverage()*1.0;
    time = iTime+bassBoostLow*8.0*pi;
    
    p += .125;
    
    p += .5*vec2(cos(time), sin(time));
    
\tp.x *= iResolution.x / iResolution.y;
\tp *= 1.5+1.125*sin(time*.25);
    
\tconst vec2 e = vec2(0.06545465634, -0.05346356485);
\tvec2 c = time*e;
\t//c = 8.0*iMouse.xy/iResolution.xy;
\tfloat d = 1.0;
\tvec3 col = vec3(0.0);
\tconst float blursamples = 4.0;
\tfloat sbs = sqrt(blursamples);
\tfloat mbluramount = 1.0/iResolution.x/length(e)/blursamples*2.0;
\tfloat aabluramount = 1.0/iResolution.x/sbs*4.0;
\tfor (float b = 0.0; b < blursamples; b++) {
\t\tcol += formula(
\t\t\tp + vec2(mod(b, sbs)*aabluramount, b/sbs*aabluramount), 
\t\t\tc + e*mbluramount*b);
\t}
\tcol /= blursamples;
\tfragColor = vec4(col, 1.0);
}

`