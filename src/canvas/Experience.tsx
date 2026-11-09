import { CameraRig } from './CameraRig';
import { Desk } from './objects/Desk';
import { ServerRack } from './objects/ServerRack';
import { Hologram } from './objects/Hologram';
import { Room } from './objects/Room';
import { CityWindow } from './objects/CityWindow';
import { LightShafts } from './objects/LightShafts';
import { WallDecor } from './objects/WallDecor';
import { Arcade } from './objects/Arcade';
import { Drone } from './objects/Drone';
import { Cables } from './objects/Cables';
import { Effects } from './effects/Effects';
import { COLORS } from '@/lib/theme';

/** Luci, diorama e oggetti. Bloom e post-processing chiudono la pipeline. */
export function Experience() {
  return (
    <>
      <CameraRig />

      {/* Luci: poca ambiente, una key light con ombre, accenti colorati */}
      <ambientLight intensity={0.28} color="#5a5790" />
      <directionalLight
        position={[6, 9, 5]}
        intensity={0.85}
        color="#a9a3ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-radius={6}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <pointLight position={[-3.5, 3, 2]} color={COLORS.violet} intensity={30} distance={14} />
      <pointLight position={[3.5, 2.5, -1]} color={COLORS.cyan} intensity={22} distance={12} />

      <Room />
      <CityWindow />
      <LightShafts />
      <WallDecor />
      <Arcade />
      <Cables />
      <Drone />

      {/* Oggetti interattivi */}
      <Desk />
      <ServerRack />
      <Hologram />

      <Effects />
    </>
  );
}
