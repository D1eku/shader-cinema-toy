import {abstractMusic} from "./shaders/abstractMusic"
import {gradientIris} from "@ShaderCinemaToy/app/constants/shaders/gradientIris";
import {fractalMicrophoneMove} from "@ShaderCinemaToy/app/constants/shaders/fractalMicrophoneMove";
import {spinningSoundWaves} from "@ShaderCinemaToy/app/constants/shaders/spinningSoundWaves";
import {tensionRings} from "@ShaderCinemaToy/app/constants/shaders/tensionRings";
import {nikolaErcerDisco} from "@ShaderCinemaToy/app/constants/shaders/nikolaErcerDisco";
import {fractalFlowerFork} from "@ShaderCinemaToy/app/constants/shaders/fractalFlowerFork";
import {discoBoxReactive} from "@ShaderCinemaToy/app/constants/shaders/discoBoxReactive";
import {spiralSpectrogram} from "@ShaderCinemaToy/app/constants/shaders/spiralSpectrogram";

export const SHADERS = {
    rainbow: `
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord/iResolution.xy;
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
        fragColor = vec4(col,1.0);
    }
  `,
    plasma: `
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord/iResolution.xy;
        float d = length(uv - 0.5);
        float c = sin(d * 10.0 - iTime * 3.0);
        fragColor = vec4(vec3(c * 0.5 + 0.5, 0.2, 0.8), 1.0);
    }
  `,
    abstractMusic: abstractMusic,
    //cameraAudioMix: cameraAudioMix,
    gradientIris: gradientIris,
    fractalMicrophoneMove: fractalMicrophoneMove,
    spinningSoundWaves: spinningSoundWaves,
    tensionRings: tensionRings,
    nikolaErcerDisco: nikolaErcerDisco,
    fractalFlowerFork: fractalFlowerFork,
    discoBoxReactive: discoBoxReactive,
    spiralSpectrogram: spiralSpectrogram
};

export type ShaderKey = keyof typeof SHADERS;