import * as THREE from 'three';

/** Palette condivisa con la scena 3D (Three.js non legge le variabili CSS). */
export const COLORS = {
  void: '#07080c',
  floor: '#0a0b12',
  wall: '#10121b',
  surface: '#171926',
  violet: '#8b5cf6',
  cyan: '#22d3ee',
  magenta: '#ff2bd6',
  amber: '#ffb02e',
  lime: '#7dff6b',
} as const;

const WHITE = new THREE.Color('#ffffff');

/**
 * Colore "HDR" per tubi neon e superfici emissive: il nucleo vira al bianco
 * e il valore supera 1, così il Bloom lo trasforma in alone.
 */
export function neon(color: string, intensity = 3, core = 0.3): THREE.Color {
  return new THREE.Color(color).lerp(WHITE, core).multiplyScalar(intensity);
}
