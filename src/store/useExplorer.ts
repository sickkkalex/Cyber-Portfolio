import { create } from 'zustand';
import type { HotspotId } from '@/data/hotspots';
import { sfx, setMuted, startAudio } from '@/lib/audio';

/**
 * Unico punto di contatto tra mondo 3D e UI React.
 * Il Canvas scrive (hover/click), la HUD e il pannello leggono.
 */
interface ExplorerState {
  selected: HotspotId | null;
  hovered: HotspotId | null;
  /** false finché l'utente non preme ENTER sulla boot screen */
  entered: boolean;
  sound: boolean;
  select: (id: HotspotId) => void;
  clear: () => void;
  setHovered: (id: HotspotId | null) => void;
  enter: (withSound: boolean) => void;
  toggleSound: () => void;
}

export const useExplorer = create<ExplorerState>((set, get) => ({
  selected: null,
  hovered: null,
  entered: false,
  sound: false,
  select: (id) => {
    sfx.select();
    set({ selected: id, hovered: null });
  },
  clear: () => {
    if (get().selected) sfx.back();
    set({ selected: null });
  },
  setHovered: (id) => {
    if (id && id !== get().hovered) sfx.hover();
    set({ hovered: id });
  },
  enter: (withSound) => {
    if (withSound) {
      startAudio();
      setMuted(false);
      sfx.boot();
    }
    set({ entered: true, sound: withSound });
  },
  toggleSound: () => {
    const next = !get().sound;
    if (next) startAudio();
    setMuted(!next);
    set({ sound: next });
  },
}));
