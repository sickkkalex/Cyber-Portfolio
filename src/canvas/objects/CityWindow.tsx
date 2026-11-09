import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, neon } from '@/lib/theme';

/** PRNG deterministico: lo skyline è identico a ogni caricamento. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Disegna su canvas 2D uno skyline cyberpunk con finestre accese e insegne. */
function makeSkyline(): THREE.CanvasTexture {
  const W = 1280;
  const H = 600;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d')!;
  const rand = rng(7);

  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0b0626');
  sky.addColorStop(0.45, '#3a0f6b');
  sky.addColorStop(0.8, '#b3207f');
  sky.addColorStop(1, '#ff5a9c');
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);

  // Luna / sole
  const sun = g.createRadialGradient(900, 250, 10, 900, 250, 150);
  sun.addColorStop(0, 'rgba(255,230,250,1)');
  sun.addColorStop(0.25, 'rgba(255,120,220,0.85)');
  sun.addColorStop(1, 'rgba(255,60,180,0)');
  g.fillStyle = sun;
  g.fillRect(600, 0, 600, 520);

  const layer = (base: string, minH: number, maxH: number, minW: number, maxW: number, winDensity: number, tint: string[]) => {
    let x = -20;
    while (x < W) {
      const w = minW + rand() * (maxW - minW);
      const h = minH + rand() * (maxH - minH);
      g.fillStyle = base;
      g.fillRect(x, H - h, w, h);
      // finestre
      for (let wy = H - h + 10; wy < H - 8; wy += 14) {
        for (let wx = x + 6; wx < x + w - 8; wx += 12) {
          if (rand() < winDensity) {
            g.fillStyle = tint[Math.floor(rand() * tint.length)];
            g.fillRect(wx, wy, 5, 7);
          }
        }
      }
      // antenna con luce rossa
      if (rand() < 0.3) {
        g.fillStyle = base;
        g.fillRect(x + w / 2, H - h - 40, 3, 40);
        g.fillStyle = '#ff2040';
        g.fillRect(x + w / 2 - 1, H - h - 44, 5, 5);
      }
      // insegna neon verticale
      if (rand() < 0.18 && h > 220) {
        const col = [COLORS.cyan, COLORS.magenta, COLORS.amber][Math.floor(rand() * 3)];
        g.fillStyle = col;
        g.fillRect(x + w - 10, H - h + 30, 6, 90);
        g.fillStyle = 'rgba(255,255,255,0.7)';
        g.fillRect(x + w - 8, H - h + 34, 2, 82);
      }
      x += w + 2 + rand() * 6;
    }
  };

  layer('#1c0d3d', 160, 360, 50, 110, 0.12, ['#ff6fd8', '#6ee7ff', '#ffd27a']);
  layer('#0a0818', 90, 280, 60, 130, 0.18, ['#22d3ee', '#ff2bd6', '#ffb02e', '#ffffff']);

  // Cartello orizzontale grande
  g.fillStyle = COLORS.cyan;
  g.fillRect(180, 300, 120, 10);
  g.fillStyle = COLORS.magenta;
  g.fillRect(560, 250, 90, 10);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const RAIN = 220;
const W = 5;
const H = 2.4;

/**
 * Finestra sulla parete sinistra: skyline texturizzato (emissivo, quindi in Bloom),
 * montanti scuri, pioggia animata e fasci di luce che entrano nella stanza.
 */
export function CityWindow() {
  const tex = useMemo(makeSkyline, []);
  useEffect(() => () => tex.dispose(), [tex]);

  const rain = useRef<THREE.InstancedMesh>(null);
  const drops = useMemo(() => {
    const r = rng(99);
    return Array.from({ length: RAIN }, () => ({ x: (r() - 0.5) * W, y: (r() - 0.5) * H, v: 1.6 + r() * 1.6, l: 0.08 + r() * 0.16 }));
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    const m = rain.current;
    if (!m) return;
    drops.forEach((d, i) => {
      d.y -= d.v * delta;
      if (d.y < -H / 2) {
        d.y = H / 2;
        d.x = (Math.random() - 0.5) * W;
      }
      dummy.position.set(d.x, d.y, 0.03);
      dummy.rotation.z = 0.12;
      dummy.scale.set(1, d.l, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  const frame = '#0b0c14';
  return (
    <group position={[-4.99, 2.2, -0.2]} rotation={[0, Math.PI / 2, 0]}>
      {/* Skyline */}
      <mesh>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} color={neon('#ffffff', 1.35, 0)} toneMapped={false} />
      </mesh>

      {/* Pioggia sul vetro */}
      <instancedMesh ref={rain} args={[undefined, undefined, RAIN]} frustumCulled={false}>
        <boxGeometry args={[0.006, 1, 0.002]} />
        <meshBasicMaterial color={neon(COLORS.cyan, 1.6)} transparent opacity={0.55} toneMapped={false} depthWrite={false} />
      </instancedMesh>

      {/* Montanti e cornice */}
      {[-W / 2, W / 2].map((x) => (
        <mesh key={x} position={[x, 0, 0.05]}>
          <boxGeometry args={[0.12, H + 0.12, 0.12]} />
          <meshStandardMaterial color={frame} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      {[-H / 2, H / 2].map((y) => (
        <mesh key={y} position={[0, y, 0.05]}>
          <boxGeometry args={[W + 0.12, 0.12, 0.12]} />
          <meshStandardMaterial color={frame} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      {[-W / 4, 0, W / 4].map((x) => (
        <mesh key={`m${x}`} position={[x, 0, 0.04]}>
          <boxGeometry args={[0.05, H, 0.05]} />
          <meshStandardMaterial color={frame} roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[W, 0.04, 0.05]} />
        <meshStandardMaterial color={frame} roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Davanzale */}
      <mesh position={[0, -H / 2 - 0.1, 0.18]}>
        <boxGeometry args={[W + 0.3, 0.08, 0.4]} />
        <meshStandardMaterial color="#151722" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Luce rosa/ciano che entra dalla città */}
      <pointLight position={[0.8, 0, 1.2]} color={COLORS.magenta} intensity={22} distance={9} />
      <pointLight position={[-1.4, -0.3, 1.0]} color={COLORS.cyan} intensity={10} distance={7} />
    </group>
  );
}
