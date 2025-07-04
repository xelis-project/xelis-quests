#ifdef GL_ES
precision highp float;
#endif

// Uniforms: supplied by your WebGL or ShaderToy environment
uniform vec2 u_resolution;// viewport size (width, height)
uniform float u_time;// time in seconds for animation

// Main color: hex #02FFCF converted to normalized RGB
vec3 primaryColor=vec3(.0078,1.,.8118);

// ---------------------------------------------------------------
// Random & Noise Functions
// ---------------------------------------------------------------

// Generates a pseudo-random value [0,1] from 2D coordinate
float rand(vec2 co){
    return fract(sin(dot(co,vec2(12.9898,78.233)))*43758.5453);
}

// Value noise: interpolates smooth randomness on a grid
float noise(vec2 p){
    vec2 i=floor(p);
    vec2 f=fract(p);
    // corner samples
    float a=rand(i);
    float b=rand(i+vec2(1.,0.));
    float c=rand(i+vec2(0.,1.));
    float d=rand(i+vec2(1.,1.));
    // smoothstep-like interpolation factor
    vec2 u=f*f*(3.-2.*f);
    // bilinear interpolation
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

// ---------------------------------------------------------------
// Fractal Brownian Motion (fBM)
// Adds multiple octaves of noise to create cloud-like structures
float fbm(vec2 p){
    float v=0.;
    float amp=.5;// starting amplitude
    for(int i=0;i<5;i++){
        v+=amp*noise(p);// add current octave
        p*=3.;// increase frequency
        amp*=.3;// reduce amplitude (self-similarity) :contentReference[oaicite:1]{index=1}
    }
    return v;
}

float pattern(vec2 p){
    vec2 q=vec2(fbm(p+vec2(0.,0.)),fbm(p+vec2(1,1)));
    vec2 r=vec2(fbm(p+10.*q+vec2(1,1)),
    fbm(p+4.*q+vec2(1,2.8)));
    return fbm(p+10.*r);
}

// ---------------------------------------------------------------
// Main Shader Logic
// ---------------------------------------------------------------

void main(){
    // Normalize coordinates: center origin (0,0), adjust aspect
    vec2 uv=(gl_FragCoord.xy*1.-u_resolution.xy)
    /min(u_resolution.x,u_resolution.y);
    
    float r=length(uv);// radial distance from center
    float angle=atan(uv.y,uv.x);// polar angle
    
    // Warp effect: spiral + radial motion
    //float radial=pow(r,1.3)+u_time*1.2;
    float twist=sin(angle*1.+u_time*.5)*.5;
    uv+=normalize(uv);//*twist;
    
    // Core glow: smooth fade toward center
    float glow=smoothstep(1.,0.1,r);
    
    // Base color starts as glow × primaryColor
    vec3 col=primaryColor*glow;
    
    // Nebula-like gas: add fractal noise
    float nebula=pattern(uv*10.+u_time*0.1);
    col+=primaryColor*nebula*.5;
    
    // Edge fade-out for smooth vignette
    //col*=smoothstep(1.8,.1,r);
    
    gl_FragColor=vec4(col,1.);
}
