# Shader Cinema Toy

Visualizador de shaders a pantalla completa que reacciona al sonido. Toma el audio del micrófono, lo analiza en tiempo real (FFT) y se lo pasa a una colección de shaders estilo [ShaderToy](https://www.shadertoy.com/), que cambian de forma, color y movimiento según la música o el ruido del ambiente.

Está pensado como "cine" de fondo: pones música, abres la página y los shaders van rotando solos.

## Qué hace

- Renderiza shaders GLSL a pantalla completa con [Three.js](https://threejs.org/) y [React Three Fiber](https://r3f.docs.pmnd.rs/).
- Expone los uniforms estándar de ShaderToy (`iTime`, `iResolution`, `iMouse`, `iDate`, `iFrame`, `iChannel0..3`, etc.), así que la mayoría de los shaders de ShaderToy se pueden pegar casi sin cambios.
- Captura el micrófono y entrega el espectro de frecuencias (512 bandas) en `iChannel0`.
- Soporta la cámara web en `iChannel1` para los shaders que la usan (hoy desactivado en la lista).
- Cambia de shader automáticamente cada 5 segundos.

### Shaders incluidos

`rainbow`, `plasma`, `abstractMusic`, `gradientIris`, `fractalMicrophoneMove`, `spinningSoundWaves`, `tensionRings`, `nikolaErcerDisco`, `fractalFlowerFork`, `discoBoxReactive`, `spiralSpectrogram`.

Hay más shaders en `app/constants/shaders/` (`cameraAudioMix`, `argonArgyle`, `echevPanguinMicrophone`) que no están activos. Para activarlos hay que agregarlos al objeto `SHADERS` en `app/constants/shaders.ts`.

## Requisitos

- **Node.js 20.9 o superior** (lo exige Next.js 16) y npm.
- **Un navegador con WebGL 2**: Chrome, Edge, Firefox o Safari en versiones recientes.
- **Un micrófono**, para que los shaders reaccionen al sonido. Sin micrófono (o si niegas el permiso), los shaders igual se ven, pero no reaccionan al audio.
- **Una GPU con soporte razonable de WebGL.** Algunos shaders (fractales, raymarching) son pesados y pueden ir lentos en equipos integrados o antiguos.

## Cómo iniciarlo

```bash
npm install
npm run dev
```

Luego abre [http://localhost:3000](http://localhost:3000).

Para una build de producción:

```bash
npm run build
npm start
```

## Cómo se usa

1. Abre la página y **acepta el permiso del micrófono** cuando el navegador lo pida.
2. Pon música cerca del micrófono (o directamente en el mismo equipo, si el micrófono capta el sonido de los parlantes).
3. Los shaders cambian solos cada 5 segundos. El nombre del shader actual aparece al centro de la pantalla.
4. Pulsa **"Siguiente Shader"** para saltar al siguiente sin esperar.
5. Algunos shaders reaccionan a la posición del mouse (`iMouse`), así que muévelo sobre la pantalla.

## Compatibilidad

| Plataforma | Estado |
| --- | --- |
| Chrome / Edge (escritorio) | Funciona |
| Firefox (escritorio) | Funciona |
| Safari (macOS) | Debería funcionar; puede pedir interactuar con la página antes de activar el audio |
| Navegadores móviles | Funciona con limitaciones: los shaders pesados pueden ir lentos y la batería se gasta rápido |

**Importante:** el navegador solo da acceso al micrófono y a la cámara en `localhost` o por **HTTPS**. Si lo abres desde otro dispositivo usando la IP de la red local (`http://192.168.x.x:3000`), el audio no va a funcionar. En ese caso hay que desplegarlo con HTTPS (por ejemplo en Vercel) o usar un túnel HTTPS.

## Agregar un shader nuevo

1. Crea un archivo en `app/constants/shaders/`, que exporte un string con una función `mainImage` al estilo ShaderToy:

   ```ts
   export const miShader = `
       void mainImage(out vec4 fragColor, in vec2 fragCoord) {
           vec2 uv = fragCoord / iResolution.xy;
           float bass = texture(iChannel0, vec2(0.05, 0.0)).r; // audio
           fragColor = vec4(uv, bass, 1.0);
       }
   `;
   ```

2. Impórtalo y agrégalo al objeto `SHADERS` en `app/constants/shaders.ts`.

## Stack

Next.js 16 · React 19 · Three.js · React Three Fiber · Tailwind CSS 4 · TypeScript
