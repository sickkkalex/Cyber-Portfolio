import { ContactShadows, Grid, MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import { COLORS } from '@/lib/theme';
import { LedStrip, NeonPath, circlePoints } from './Neon';

/** Diorama: pavimento a specchio bagnato, due pareti, strisce LED, pilastro neon, polvere sospesa. */
export function Room() {
  return (
    <group>
      {/* Base opaca + piano riflettente (i neon si specchiano sul pavimento bagnato) */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[10, 0.3, 10]} />
        <meshStandardMaterial color={COLORS.floor} roughness={0.95} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <MeshReflectorMaterial
          resolution={768}
          blur={[400, 120]}
          mixBlur={1}
          mixStrength={1.6}
          mirror={0.6}
          roughness={0.85}
          depthScale={0.8}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0c0d16"
          metalness={0.6}
        />
      </mesh>

      {/* Pareti */}
      <mesh position={[0, 2, -5.1]} receiveShadow>
        <boxGeometry args={[10.4, 4, 0.2]} />
        <meshStandardMaterial color={COLORS.wall} roughness={0.9} metalness={0.15} />
      </mesh>
      <mesh position={[-5.1, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 10]} />
        <meshStandardMaterial color={COLORS.wall} roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Pannelli verticali sulla parete di fondo (ritmo + ombre) */}
      {[-4, -2.6, 0.9, 3.2, 4.3].map((x) => (
        <mesh key={x} position={[x, 1.6, -4.96]}>
          <boxGeometry args={[0.5, 3.2, 0.06]} />
          <meshStandardMaterial color="#151829" roughness={0.5} metalness={0.6} />
        </mesh>
      ))}

      {/* Strisce LED: soffitto, battiscopa, spigolo */}
      <LedStrip position={[0, 3.2, -4.98]} size={[9.6, 0.035, 0.02]} color={COLORS.cyan} />
      <LedStrip position={[-4.98, 3.75, 0]} size={[0.02, 0.035, 9.6]} color={COLORS.magenta} />
      <LedStrip position={[0, 0.06, -4.98]} size={[9.8, 0.04, 0.02]} color={COLORS.magenta} intensity={2} />
      <LedStrip position={[-4.98, 0.06, 0]} size={[0.02, 0.04, 9.8]} color={COLORS.cyan} intensity={2} />
      <LedStrip position={[-4.97, 2, -4.97]} size={[0.05, 4, 0.05]} color={COLORS.violet} intensity={3} />

      {/* Pilastro neon d'angolo (lampada da terra) */}
      <group position={[-4.2, 0, 3.6]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.08, 24]} />
          <meshStandardMaterial color="#10121c" metalness={0.7} roughness={0.35} />
        </mesh>
        <NeonPath points={[[0, 0.1, 0], [0, 2.6, 0]]} color={COLORS.magenta} radius={0.035} intensity={3.5} flicker phase={2} />
        <pointLight position={[0.2, 1.4, 0.2]} color={COLORS.magenta} intensity={9} distance={6} />
      </group>

      {/* Anelli luminosi a terra: segnano la zona dell'ologramma e della workstation */}
      <group position={[1.8, 0.012, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <NeonPath points={circlePoints(0.95, 56)} color={COLORS.cyan} radius={0.012} intensity={2.6} smooth closed />
        <NeonPath points={circlePoints(1.2, 64)} color={COLORS.violet} radius={0.008} intensity={2.2} smooth closed />
      </group>
      <group position={[-1.8, 0.012, -1.2]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <NeonPath points={[[-1.5, -0.95, 0], [1.5, -0.95, 0], [1.5, 0.95, 0], [-1.5, 0.95, 0]]} color={COLORS.violet} radius={0.01} intensity={2.2} closed />
      </group>

      <Grid
        position={[0, 0.01, 0]}
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#262a4a"
        sectionSize={2.5}
        sectionThickness={1.2}
        sectionColor="#6d3bd6"
        fadeDistance={14}
        fadeStrength={1.5}
      />
      <ContactShadows position={[0, 0.012, 0]} opacity={0.65} scale={10} blur={2.4} far={3} color="#000000" />

      {/* Polvere / particelle in sospensione */}
      <Sparkles count={90} scale={[9, 4, 9]} position={[0, 2, 0]} size={2.2} speed={0.25} opacity={0.6} color={COLORS.cyan} noise={0.6} />
      <Sparkles count={50} scale={[9, 4, 9]} position={[0, 2, 0]} size={2.8} speed={0.2} opacity={0.55} color={COLORS.magenta} noise={0.8} />
    </group>
  );
}
