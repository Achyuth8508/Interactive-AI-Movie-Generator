export type StoryModeId = 'cyberpunk' | 'scifi' | 'darkfantasy' | 'noir';
export type RenderStyleId = 'realistic' | 'anime' | 'pixel' | 'sketch';
export type AppThemeId = 'onyx' | 'alabaster' | 'matrix' | 'sunset';

export interface Character {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  traits: string[];
  stats: {
    relationship: number; // 0-100 trust/friendship
    influence: number;    // 0-100 power in the story
    danger: number;       // 0-100 risk of death or betrayal
    energy: number;       // 0-100 energy or willpower
  };
}

export interface DirectorControlsState {
  cameraAngle: 'close-up' | 'panoramic' | 'dolly-zoom' | 'birds-eye' | 'low-angle';
  colorGrading: 'neon-cyber' | 'obsidian-black' | 'teal-orange' | 'vintage-sepia' | 'emerald-fog';
  lightingMode: 'high-contrast' | 'ambient-glow' | 'lens-flare' | 'shadow-heavy';
  pacing: 'dramatic-slow' | 'balanced' | 'action-fast';
  audioReverb: 'hall' | 'space' | 'dry';
  grainIntensity: number; // 0 to 100
}

export interface ScriptLine {
  id: string;
  type: 'action' | 'dialogue' | 'transition' | 'heading';
  speaker?: string;
  text: string;
  framePrompt?: string; // Prompt for the visual canvas/renderer simulation
  cameraCue?: string;
}

export interface StoryNode {
  id: string;
  title: string;
  sceneHeading: string;
  script: ScriptLine[];
  choices: StoryChoice[];
  graphicSeed: string; // Used to drive the canvas visual layout
  graphicSeed_override?: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  nextNodeId: string;
  requiredStat?: {
    statName: string;
    value: number;
  };
  consequences: {
    votersFavorability: number; // impact on simulated audience
    statImpact: {
      charId: string;
      stat: 'relationship' | 'influence' | 'danger' | 'energy';
      amount: number;
    }[];
    ambientShift: {
      tensionGain: number;       // -100 to 100
      energyGain: number;        // -100 to 100
    };
  };
}

export interface NarrativeState {
  currentMode: StoryModeId;
  currentNodeId: string;
  visitedNodeIds: string[];
  tension: number;       // 0-100 global tension level
  stability: number;     // 0-100 plot stability
  discoveryTokens: string[]; // Key clues unlocked
  characters: Character[];
}

export interface Voter {
  id: string;
  username: string;
  avatarColor: string;
  votedChoiceId: string | null;
  opinion: string;
}

export interface TimelineTrackSegment {
  id: string;
  label: string;
  startPercent: number;
  endPercent: number;
  type: 'video' | 'dialogue' | 'audio' | 'render';
  color: string;
}
