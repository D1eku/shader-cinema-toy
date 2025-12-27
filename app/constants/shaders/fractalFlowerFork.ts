export const fractalFlowerFork = `
const float iter    = 64.,
            divAng  = 24. * 6.2831853/360.,
            circRad = .23, 
    \t    rat     = .045/circRad;

float nearestMult(float v, float of) {
\tfloat m = mod(v, of);
\tv -= m * sign(of/2. - m);
\treturn v - mod(v,of);
}

//Color palette function taken from iq's shader @ https://www.shadertoy.com/view/ll2GD3
#define  pal(t) ( .5 + .5* cos( 6.283*( t + vec4(0,1,2,0)/3.) ) )




void mainImage( out vec4 o, vec2 uv ) {
    vec2 R = iResolution.xy,
         center = vec2(0.), p;
    float M = max(R.x, R.y);
    uv = ( uv -.5*R) / M / .7;
    float l = length(uv);
    float sl = texture(iChannel0, vec2(0.)).x ;
    float sl2 = texture(iChannel0, vec2(0.25)).x * .5 ;
    float sm = texture(iChannel0, vec2(0.5)).x * .2 ;
    float sm2 = texture(iChannel0, vec2(0.75)).x * .2 ;
    float sh = texture(iChannel0, vec2(1.)).x * .2;
    float st = (sl+sl2+sm+sm2+sh);// / 5.;
\tfloat time = iTime,
          sCircRad = circRad*rat, 
          ds = (2.+ 1.4*((st)) /*abs(sin(time/10.))*/) * rat,
          ang, dist;
    
 \t
    o = vec4(0.1);
\tfor(float i=0.;i< iter;i+=1.) {
        p = uv-center;
\t\tang =  atan(p.y,p.x);\t\t
        ang = nearestMult(ang, divAng);     
\t\tcenter += sCircRad/rat* vec2(cos(ang), sin(ang));
\t\tdist = distance( center, uv);

\t\tif( dist <=sCircRad )
             o += 30.*dist * pal( fract(dist/sCircRad + st+l/*+ abs(sin(time/2.))*/) );
   
  \t\tsCircRad *= ds;
\t}
}

`