import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { COLORS, neon } from '@/lib/theme';

/** Alpha map verticale (opaco in alto, trasparente in basso) per i fasci di luce volumetrici finti. */
function makeFade(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.25)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 256);
  // bordi morbidi sui lati
  const side = g.createLinearGradient(0, 0, 64, 0);
  side.addColorStop(0, 'rgba(0,0,0,1)');
  side.addColorStop(0.5, 'rgba(0,0,0,0)');
  side.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-out';
  g.fillStyle = side;
  g.fillRect(0, 0, 64, 256);
  return new THREE.CanvasTexture(c);
}

/** Fasci di luce additivi che entrano dalla finestra e scendono verso il pavimento. */
export function LightShafts() {
  const tex = useMemo(makeFade, []);
  useEffect(() => () => tex.dispose(), [tex]);

  const shafts = [
    { z: -1.8, w: 0.9, color: COLORS.magenta, op: 0.16 },
    { z: -0.2, w: 1.2, color: COLORS.cyan, op: 0.12 },
    { z: 1.4, w: 0.8, color: COLORS.violet, op: 0.16 },
  ];

  return (
    <group>
      {shafts.map((s) => (
        // il gruppo ruota verso la camera, il mesh interno inclina il fascio
        <group key={s.z} position={[-3.1, 1.9, s.z]} rotation={[0, Math.PI / 4, 0]}>
          <mesh rotation={[0, 0, -0.65]}>
            <planeGeometry args={[s.w, 4.2]} />
            <meshBasicMaterial
              color={neon(s.color, 1, 0)}
              alphaMap={tex}
              transparent
              opacity={s.op}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
