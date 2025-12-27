"use client";

import {useEffect, useState} from "react";
import { ShaderToyCanvas } from "./components/ShaderToyCanvas";
import { SHADERS, ShaderKey } from "./constants/shaders";

export default function Home() {
    const [currentShader, setCurrentShader] = useState<ShaderKey>("rainbow");
    const [nextIn] = useState(5000); // Tiempo en milisegundos (ej. 5 segundos)

    const shaderKeys = Object.keys(SHADERS) as ShaderKey[];

    const nextShader = () => {
        const currentIndex = shaderKeys.indexOf(currentShader);
        const nextIndex = (currentIndex + 1) % shaderKeys.length;

        setCurrentShader(shaderKeys[nextIndex]);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextShader();
        }, nextIn);

        return () => clearInterval(interval);
    }, [currentShader, nextIn]);

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center bg-black">
            <div className="absolute inset-0 z-0">
                {/* Aquí pasamos si queremos usar la cámara o no */}
                <ShaderToyCanvas
                    shaderCode={SHADERS[currentShader]}
                    useCamera={currentShader === "cameraAudioMix"}
                />
            </div>

            <div className=" rounded-xl backdrop-blur-md">
                <h1 className="text-white text-xl font-bold uppercase tracking-widest">
                    Shader: {currentShader}
                </h1>

            </div>

            <button
                onClick={nextShader}
                className=" px-6 py-2 rounded-xl backdrop-blur-md"
            >
                Siguiente Shader
            </button>
        </main>
    );
}
