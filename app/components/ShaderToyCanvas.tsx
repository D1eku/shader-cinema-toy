import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ShaderPlaneProps {
    shaderCode: string;
    useCamera?: boolean;
}

const ShaderPlane = ({ shaderCode, useCamera = false }: ShaderPlaneProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();
    const frameRef = useRef(0);

    // Referencias para Audio y Video
    const audioDataRef = useRef<Uint8Array>(null);
    const analyserRef = useRef<AnalyserNode>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [textures, setTextures] = useState<{
        audio: THREE.DataTexture | null;
        video: THREE.VideoTexture | null;
    }>({ audio: null, video: null });

    // 1. Definición de Uniformes Estándar de ShaderToy
    const uniforms = useMemo(() => ({
        iResolution: { value: new THREE.Vector3(size.width, size.height, 1.0) },
        iTime: { value: 0 },
        iTimeDelta: { value: 0 },
        iFrameRate: { value: 60 },
        iFrame: { value: 0 },
        iChannelTime: { value: [0, 0, 0, 0] },
        iChannelResolution: { value: [
                new THREE.Vector3(512, 1, 1),   // Audio (iChannel0)
                new THREE.Vector3(640, 480, 1), // Video (iChannel1)
                new THREE.Vector3(1, 1, 1),
                new THREE.Vector3(1, 1, 1)
            ] },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iDate: { value: new THREE.Vector4(0, 0, 0, 0) },
        iChannel0: { value: new THREE.Texture() },
        iChannel1: { value: new THREE.Texture() },
        iChannel2: { value: new THREE.Texture() },
        iChannel3: { value: new THREE.Texture() },
    }), []);

    useEffect(() => {
        let audioContext: AudioContext;
        let currentStream: MediaStream | null = null;

        async function setupMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: useCamera ? { width: 640, height: 480 } : false
                });
                currentStream = stream;

                // Audio Setup
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyserRef.current = audioContext.createAnalyser();
                analyserRef.current.fftSize = 1024; // 512 bins
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
                audioDataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

                const audioTex = new THREE.DataTexture(audioDataRef.current, audioDataRef.current.length, 1, THREE.RedFormat);

                // Video Setup
                let videoTex = null;
                if (useCamera) {
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.muted = true;
                    await video.play();
                    videoRef.current = video;
                    videoTex = new THREE.VideoTexture(video);
                }

                setTextures({ audio: audioTex, video: videoTex });
            } catch (err) {
                console.warn("Media access denied or not available", err);
            }
        }
        setupMedia();
        return () => {
            audioContext?.close();
            currentStream?.getTracks().forEach(t => t.stop());
        };
    }, [useCamera]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        const mat = meshRef.current.material as THREE.ShaderMaterial;
        const time = state.clock.getElapsedTime();

        // Actualizar Uniformes Básicos
        mat.uniforms.iTime.value = time;
        mat.uniforms.iTimeDelta.value = delta;
        mat.uniforms.iFrame.value = frameRef.current++;
        mat.uniforms.iFrameRate.value = 1 / delta;
        mat.uniforms.iResolution.value.set(size.width, size.height, 1);

        // Actualizar iDate (Year, Month, Day, Time in seconds)
        const now = new Date();
        mat.uniforms.iDate.value.set(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000
        );

        // Actualizar Canales (Audio y Video)
        if (textures.audio && analyserRef.current && audioDataRef.current) {
            analyserRef.current.getByteFrequencyData(audioDataRef.current);
            textures.audio.needsUpdate = true;
            mat.uniforms.iChannel0.value = textures.audio;
            mat.uniforms.iChannelTime.value[0] = time;
        }
        if (textures.video) {
            mat.uniforms.iChannel1.value = textures.video;
            mat.uniforms.iChannelTime.value[1] = time;
        }

        // Actualizar Mouse
        const { x, y } = state.pointer;
        const isDown = state.mouse.x !== 0 || state.mouse.y !== 0; // Simplificación
        mat.uniforms.iMouse.value.set(
            (x + 1) / 2 * size.width,
            (y + 1) / 2 * size.height,
            isDown ? 1 : 0,
            0
        );
    });

    const fullFragmentShader = useMemo(() => `
    uniform vec3 iResolution;
    uniform float iTime;
    uniform float iTimeDelta;
    uniform float iFrameRate;
    uniform int iFrame;
    uniform float iChannelTime[4];
    uniform vec3 iChannelResolution[4];
    uniform vec4 iMouse;
    uniform vec4 iDate;
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;
    uniform sampler2D iChannel2;
    uniform sampler2D iChannel3;

    ${shaderCode || 'void mainImage(out vec4 f, in vec2 c){f=vec4(0,0,0,1);}'}

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `, [shaderCode]);

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                key={shaderCode}
                fragmentShader={fullFragmentShader}
                vertexShader="void main(){gl_Position=vec4(position,1.);}"
                uniforms={uniforms}
            />
        </mesh>
    );
};

export const ShaderToyCanvas = ({ shaderCode, useCamera }: ShaderPlaneProps) => (
    <div className="w-full h-full min-h-screen bg-black">
        <Canvas camera={{ position: [0, 0, 1] }}>
            <ShaderPlane shaderCode={shaderCode} useCamera={useCamera} />
        </Canvas>
    </div>
);