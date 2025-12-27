export const cameraAudioMix = `
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord/iResolution.xy;
        
        // Leer cámara
        vec3 cam = texture(iChannel1, uv).rgb;
        
        // Leer audio (frecuencias bajas)
        float fft = texture(iChannel0, vec2(0.1, 0.25)).r;
        
        // Mezclar: la cámara se vuelve roja con el bajo
        vec3 col = cam + vec3(fft, 0.0, 0.0);
        
        fragColor = vec4(col, 1.0);
    }
  `