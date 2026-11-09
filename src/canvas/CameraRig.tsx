import { useEffect, useRef, type ComponentRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { HOTSPOTS } from '@/data/hotspots';
import { useExplorer } from '@/store/useExplorer';

const HOME = {
  position: new THREE.Vector3(8, 6, 8),
  target: new THREE.Vector3(0, 0.8, 0),
};

/** Più alto = transizione più rapida. Esponenziale, quindi indipendente dal framerate. */
const SPEED = 3.2;
/** Volo d'ingresso dopo ENTER: più lento e scenografico. */
const INTRO_SPEED = 1.1;
const EPSILON = 0.01;

/**
 * Due modalità:
 * - overview: OrbitControls attivi (rotazione/zoom limitati, niente pan)
 * - focus: OrbitControls disattivati, la camera fa lerp verso la posa dell'hotspot
 *
 * Il lerp gira solo durante la transizione, così non "combatte" con l'utente
 * quando ruota liberamente la vista.
 */
export function CameraRig() {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const animating = useRef(true);
  const goalPos = useRef(HOME.position.clone());
  const goalTarget = useRef(HOME.target.clone());
  const selected = useExplorer((s) => s.selected);
  const introDone = useRef(false);
  const parallax = useRef(new THREE.Vector3());
  const desired = useRef(new THREE.Vector3());

  // Cambio selezione: aggiorna l'obiettivo e avvia l'animazione
  useEffect(() => {
    if (selected) {
      const { position, target } = HOTSPOTS[selected].camera;
      goalPos.current.set(...position);
      goalTarget.current.set(...target);
    } else {
      goalPos.current.copy(HOME.position);
      goalTarget.current.copy(HOME.target);
    }
    animating.current = true;
    // dopo l'intro, uscendo dal focus riparte il lerp veloce
    if (controls.current) controls.current.enabled = false;
  }, [selected]);

  useFrame((state, delta) => {
    const ctrl = controls.current;
    if (!ctrl) return;
    const { entered, selected: sel } = useExplorer.getState();
    if (!entered) return; // la boot screen è ancora aperta

    // Focus: la camera "respira" seguendo il puntatore (parallasse leggera)
    if (!animating.current) {
      if (sel) {
        parallax.current.set(state.pointer.x * 0.14, state.pointer.y * 0.07, 0);
        desired.current.copy(goalPos.current).add(parallax.current);
        state.camera.position.lerp(desired.current, 1 - Math.exp(-3 * delta));
        state.camera.lookAt(ctrl.target);
      }
      return;
    }

    const k = 1 - Math.exp(-(introDone.current ? SPEED : INTRO_SPEED) * delta);
    state.camera.position.lerp(goalPos.current, k);
    ctrl.target.lerp(goalTarget.current, k);
    ctrl.update();

    const arrived =
      state.camera.position.distanceTo(goalPos.current) < EPSILON &&
      ctrl.target.distanceTo(goalTarget.current) < EPSILON;

    if (arrived) {
      animating.current = false;
      introDone.current = true;
      // L'utente riprende il controllo solo nella vista d'insieme
      ctrl.enabled = useExplorer.getState().selected === null;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={1}
      maxDistance={24}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.2}
      minAzimuthAngle={-0.2}
      maxAzimuthAngle={Math.PI / 2 + 0.2}
      target={HOME.target.toArray()}
    />
  );
}
