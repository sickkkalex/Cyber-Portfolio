import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

const ABERRATION = new THREE.Vector2(0.0007, 0.0009);

/**
 * Post-processing: il Bloom è ciò che trasforma i materiali emissivi (valori > 1)
 * in veri neon. Aberrazione cromatica, grana e vignettatura danno la resa "lente".
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={1.5} luminanceThreshold={0.75} luminanceSmoothing={0.35} radius={0.8} />
      <ChromaticAberration offset={ABERRATION} radialModulation={false} modulationOffset={0} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
