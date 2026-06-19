import { StoryModeId, Character, StoryNode } from './types';

export interface StoryModeInfo {
  id: StoryModeId;
  name: string;
  tagline: string;
  description: string;
  primaryColor: string; // Tailwind class coloring
  accentColor: string;  // Hex code for high contrast
  initialTension: number;
  synthMood: {
    baseFreq: number;
    detune: number;
    waveType: 'sine' | 'square' | 'sawtooth' | 'triangle';
    delayTime: number;
    reverbWet: number;
    noiseColor: 'pink' | 'white' | 'brown';
  };
}

export const STORY_MODES_INFO: Record<StoryModeId, StoryModeInfo> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neo-Tokyo Hackfall',
    tagline: 'High tech, low life, neon rain.',
    description: 'A tech-grunge thriller through rain-slicked alleys, corporate firewalls, and cybernetic underground clubs.',
    primaryColor: 'from-[#ec4899] to-[#8b5cf6]',
    accentColor: '#f43f5e',
    initialTension: 45,
    synthMood: {
      baseFreq: 65.41, // C2, heavy low drone
      detune: 15,
      waveType: 'sawtooth',
      delayTime: 0.25,
      reverbWet: 0.4,
      noiseColor: 'brown',
    }
  },
  scifi: {
    id: 'scifi',
    name: 'Ashes of Epsilon-9',
    tagline: 'Deep space exploration, ancient mystery.',
    description: 'An atmospheric sci-fi narrative examining an abandoned asteroid research colony orbit around a magnetar.',
    primaryColor: 'from-[#06b6d4] to-[#3b82f6]',
    accentColor: '#06b6d4',
    initialTension: 20,
    synthMood: {
      baseFreq: 82.41, // E2, clean cosmic hum
      detune: 4,
      waveType: 'sine',
      delayTime: 0.4,
      reverbWet: 0.7,
      noiseColor: 'pink',
    }
  },
  darkfantasy: {
    id: 'darkfantasy',
    name: 'The Obsidian Scepter',
    tagline: 'Cursed blades, forgotten gods, crimson ash.',
    description: 'A bleak dark fantasy chronicle where a runic knight must survive a corrupted kingdom and choose a dark pact.',
    primaryColor: 'from-[#ef4444] to-[#f97316]',
    accentColor: '#ea580c',
    initialTension: 60,
    synthMood: {
      baseFreq: 55.00, // A1, rumbling gothic doom tone
      detune: 25,
      waveType: 'triangle',
      delayTime: 0.18,
      reverbWet: 0.8,
      noiseColor: 'brown',
    }
  },
  noir: {
    id: 'noir',
    name: 'Bay City Raindance',
    tagline: 'Smoke, mirrors, and rain on a fedora.',
    description: 'A hardboiled classic detective drama. Solve a cryptic syndicate case where everyone is hiding a lethal secret.',
    primaryColor: 'from-gray-600 to-slate-900',
    accentColor: '#94a3b8',
    initialTension: 30,
    synthMood: {
      baseFreq: 73.42, // D2, dusty mystery tone
      detune: 8,
      waveType: 'triangle',
      delayTime: 0.5,
      reverbWet: 0.5,
      noiseColor: 'white',
    }
  }
};

export const INITIAL_CHARACTERS: Record<StoryModeId, Character[]> = {
  cyberpunk: [
    {
      id: 'char_v',
      name: 'Vandal',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Outlaw Netrunner',
      bio: 'Enigmatic console cowboy who took too many black-market brain-dances. Wears an interactive optic visor.',
      traits: ['Cynical', 'Hacking Prodigy', 'Rebellious'],
      stats: { relationship: 50, influence: 75, danger: 30, energy: 80 }
    },
    {
      id: 'char_kane',
      name: 'Detective Kane',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Cyber-Corp Enforcer',
      bio: 'A cybernetically augmented squad captain trying to balance executive orders with internal human guilt.',
      traits: ['Incorruptible', 'Heavy Augmented', 'Weary'],
      stats: { relationship: 40, influence: 60, danger: 65, energy: 90 }
    }
  ],
  scifi: [
    {
      id: 'char_avery',
      name: 'Dr. Avery Vance',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Lead Astrobiologist',
      bio: 'A world-renowned researcher who decoded the magnetar-pulse pattern. Searching for her lost research crew.',
      traits: ['Methodical', 'Curious', 'Haunted'],
      stats: { relationship: 70, influence: 50, danger: 25, energy: 60 }
    },
    {
      id: 'char_hal',
      name: 'HALO-5',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Station Artificial Mind',
      bio: 'An advanced ship intelligence which survived the radiation storm but suffers from syntax degradation.',
      traits: ['Calculating', 'Unstable', 'Poetic-synthesized'],
      stats: { relationship: 50, influence: 85, danger: 45, energy: 95 }
    }
  ],
  darkfantasy: [
    {
      id: 'char_gideon',
      name: 'Sir Gideon Gallow',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Wandering Runic Knight',
      bio: 'Equipped with a cursed claymore that hungers for lifeforce. Seeking redemption for a forgotten siege.',
      traits: ['Grave', 'Honor-bound', 'Cursed'],
      stats: { relationship: 60, influence: 40, danger: 50, energy: 70 }
    },
    {
      id: 'char_isolda',
      name: 'Isolda of the Mire',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Ash Witch',
      bio: 'A dynamic necromancer who guards the ancient crypt of the Obsidian King. Can peer into branch timelines.',
      traits: ['Manipulative', 'Ancient', 'Charismatic'],
      stats: { relationship: 35, influence: 80, danger: 70, energy: 85 }
    }
  ],
  noir: [
    {
      id: 'char_jack',
      name: 'Jack Sterling',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Private Eye',
      bio: 'Ex-lieutenant who knows every shadow of Bay City. Lives on cheap coffee and dangerous curiosity.',
      traits: ['Hardboiled', 'Observant', 'Addictive'],
      stats: { relationship: 50, influence: 45, danger: 40, energy: 65 }
    },
    {
      id: 'char_scarlet',
      name: 'Scarlet Lane',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200&h=200',
      role: 'Club Singer / Informant',
      bio: 'The hottest voice in the Velvet Lounge. Rumored to hold the microfilms that can bankrupt the precinct.',
      traits: ['Seductive', 'Cunning', 'Guarded'],
      stats: { relationship: 45, influence: 70, danger: 55, energy: 75 }
    }
  ]
};

export const STORY_TREES: Record<StoryModeId, Record<string, StoryNode>> = {
  cyberpunk: {
    start: {
      id: 'start',
      title: 'Neon Outset',
      sceneHeading: 'INT. VANDAL\'S UNDERGROUND HOVEL - NIGHT',
      graphicSeed: 'cyberpunk-hovel-rain',
      script: [
        { id: '1', type: 'heading', text: 'SCENE 1: THE HACKFALL SETUP - EXT/INT - NIGHT' },
        { id: '2', type: 'action', text: 'Rain drops sizzle as they hit the overheating power conduits. Blue neon light flashes from a billboard across the street reflecting on digital debris.' },
        { id: '3', type: 'action', text: 'VANDAL tap-dances on a glowing custom deck. Holograms flicker over her hollow eyes.' },
        { id: '4', type: 'dialogue', speaker: 'Vandal', text: 'The Arasaka security grid is pulsing in three-beat loops. If I don\'t trigger the override key in four seconds, my cortical implants melt.' },
        { id: '5', type: 'action', text: 'Suddenly, a heavy holographic transmission intercepts the display. DETECTIVE KANE’S face overrides the local console, flickering in bright warning-amber.' },
        { id: '6', type: 'dialogue', speaker: 'Detective Kane', text: 'Step back from the console, kid. This terminal is red-zoned. I have a tactical strike drone locked onto your hovel thermal seal.' }
      ],
      choices: [
        {
          id: 'choice_cyber_hack',
          text: 'Initiate Override Hack (Requires Hacking)',
          nextNodeId: 'cyber_hacked',
          consequences: {
            votersFavorability: 85,
            statImpact: [
              { charId: 'char_v', stat: 'energy', amount: -20 },
              { charId: 'char_kane', stat: 'relationship', amount: -15 },
              { charId: 'char_kane', stat: 'danger', amount: 30 }
            ],
            ambientShift: { tensionGain: 25, energyGain: -10 }
          }
        },
        {
          id: 'choice_cyber_bargain',
          text: 'Talk Kane Down (Diplomatic)',
          nextNodeId: 'cyber_talked',
          consequences: {
            votersFavorability: 60,
            statImpact: [
              { charId: 'char_v', stat: 'energy', amount: -5 },
              { charId: 'char_kane', stat: 'relationship', amount: 20 },
              { charId: 'char_kane', stat: 'danger', amount: -15 }
            ],
            ambientShift: { tensionGain: -15, energyGain: 10 }
          }
        }
      ]
    },
    cyber_hacked: {
      id: 'cyber_hacked',
      title: 'The Override',
      sceneHeading: 'INT. GRID FIREWALL ARCHITECTURE - COLD MATRIX',
      graphicSeed: 'cyberpunk-neon-matrix',
      script: [
        { id: 'h1', type: 'heading', text: 'SCENE 2A: THE NETRUNNER RUNS RED' },
        { id: 'h2', type: 'action', text: 'Vandal pushes past the safety lock. The console explodes in yellow sparks, scorching her sleeves. The screen outputs: OVERRIDE GRANTED.' },
        { id: 'h3', type: 'dialogue', speaker: 'Vandal', text: 'I\'m in! The mainframe data is flowing directly into my bio-chip. But... Kane’s tracer is burning through my cranial node!' },
        { id: 'h4', type: 'action', text: 'The door suddenly collapses inward with magnetic pressure. A police drone drifts in, cannon charging a violet plasma pool.' },
        { id: 'h5', type: 'dialogue', speaker: 'Detective Kane', text: 'You fool. You locked yourself inside your own cage. I\'m downloading your position to the precinct unless we strike an alternative deal right now.' }
      ],
      choices: [
        {
          id: 'choice_cyber_fuse',
          text: 'Blow the local fuse block (Escape in Dark)',
          nextNodeId: 'cyber_end_escape',
          consequences: {
            votersFavorability: 95,
            statImpact: [
              { charId: 'char_v', stat: 'energy', amount: -40 },
              { charId: 'char_kane', stat: 'danger', amount: 40 }
            ],
            ambientShift: { tensionGain: 35, energyGain: -30 }
          }
        },
        {
          id: 'choice_cyber_submit',
          text: 'Surrender and share findings with Kane',
          nextNodeId: 'cyber_end_ally',
          consequences: {
            votersFavorability: 45,
            statImpact: [
              { charId: 'char_kane', stat: 'relationship', amount: 35 },
              { charId: 'char_kane', stat: 'influence', amount: 15 }
            ],
            ambientShift: { tensionGain: -20, energyGain: 15 }
          }
        }
      ]
    },
    cyber_talked: {
      id: 'cyber_talked',
      title: 'Negotiated Terms',
      sceneHeading: 'INT. VANDAL\'S HOVEL - RAIN COVERS',
      graphicSeed: 'cyberpunk-alley-compromise',
      script: [
        { id: 't1', type: 'heading', text: 'SCENE 2B: COLD WAR IN WET WIRE' },
        { id: 't2', type: 'action', text: 'Kane pauses, looking at the biometric readout of Vandal. Her heart rate is hitting critical levels.' },
        { id: 't3', type: 'dialogue', speaker: 'Detective Kane', text: 'Listen, kid. The corporatocracy owns my badge, but they don\'t own my soul. I know they poisoned the sector five reservoir. Keep quiet and help me locate the ledger.' },
        { id: 't4', type: 'dialogue', speaker: 'Vandal', text: 'Well, well. A detective with a conscience. How much is that worth on the black exchange? Okay, Kane. Feed me the corporate key-card sequence.' }
      ],
      choices: [
        {
          id: 'choice_cyber_hack_corp',
          text: 'Infiltrate Corporate Tower with Kane\'s pass',
          nextNodeId: 'cyber_end_ally',
          consequences: {
            votersFavorability: 90,
            statImpact: [
              { charId: 'char_kane', stat: 'relationship', amount: 25 },
              { charId: 'char_v', stat: 'influence', amount: 30 }
            ],
            ambientShift: { tensionGain: 10, energyGain: -10 }
          }
        },
        {
          id: 'choice_cyber_doublecross',
          text: 'Double-Cross Kane: Sell the key to rivals',
          nextNodeId: 'cyber_end_betrayal',
          consequences: {
            votersFavorability: 100,
            statImpact: [
              { charId: 'char_kane', stat: 'relationship', amount: -50 },
              { charId: 'char_kane', stat: 'danger', amount: 50 },
              { charId: 'char_v', stat: 'influence', amount: 50 }
            ],
            ambientShift: { tensionGain: 40, energyGain: -5 }
          }
        }
      ]
    },
    cyber_end_escape: {
      id: 'cyber_end_escape',
      title: 'Ghost of the Grid',
      sceneHeading: 'EXT. METROPOLIS OVERPASS - RUSH HOUR - TERMINAL SCENE',
      graphicSeed: 'cyberpunk-chase-endpoint',
      script: [
        { id: 'ce1', type: 'heading', text: 'EPILOGUE: THE GHOST RUNS FREE' },
        { id: 'ce2', type: 'action', text: 'The transformer blows. High voltage arcing vaporizes the strike drone instantly. Total darkness envelopes Sector 7.' },
        { id: 'ce3', type: 'action', text: 'Vandal steps onto the hover-train roof, hood pulled tight. In her palm, the secure hard drive gleams with corporate secrets.' },
        { id: 'ce4', type: 'dialogue', speaker: 'Vandal', text: 'Tell the detective I don\'t live in the database anymore.' },
        { id: 'ce5', type: 'action', text: 'Fade to absolute cyan. The city sirens wail into the pouring rain.' }
      ],
      choices: [],
      graphicSeed_override: 'cyberpunk-escaped'
    },
    cyber_end_ally: {
      id: 'cyber_end_ally',
      title: 'Syndicate Defiances',
      sceneHeading: 'INT. ARASAKA HIGH RISE - VAULT ROOM - CONDEMNED SCENE',
      graphicSeed: 'cyberpunk-corporate-vault',
      script: [
        { id: 'ca1', type: 'heading', text: 'EPILOGUE: UNHOLY ALLIANCE' },
        { id: 'ca2', type: 'action', text: 'Kane and Vandal stand back-to-back inside the polished titanium server room. Security vectors sound across the floor.' },
        { id: 'ca3', type: 'dialogue', speaker: 'Detective Kane', text: 'The files are copied, Vandal. Trigger the EMP. We survive together or we fall here.' },
        { id: 'ca4', type: 'dialogue', speaker: 'Vandal', text: 'Hold your breath, Kane. This is going to shake the grid.' },
        { id: 'ca5', type: 'action', text: 'Behind them, the glass skyscraper shatters as the electromagnetic pulse silences the neon metropolis. A triumph of human rebellion.' }
      ],
      choices: [],
      graphicSeed_override: 'cyberpunk-ally'
    },
    cyber_end_betrayal: {
      id: 'cyber_end_betrayal',
      title: 'The Sovereign Hacker',
      sceneHeading: 'EXT. DISTRICT RED GLOW - NEON HELIPAD',
      graphicSeed: 'cyberpunk-helipad-rain',
      script: [
        { id: 'cb1', type: 'heading', text: 'EPILOGUE: THE MONOCHROME HARVEST' },
        { id: 'cb2', type: 'action', text: 'Vandal looks down from the helicopter pad. Detective Kane is below, surrounded by company security, looking up with silent condemnation.' },
        { id: 'cb3', type: 'dialogue', speaker: 'Vandal', text: 'No hard feelings, Kane. The highest bidder bought my freedom. It\'s just clean mathematics.' },
        { id: 'cb4', type: 'action', text: 'The rotor blades roar as Vandal ascends into the cloud bank, leaving the burning sectors to their fate.' }
      ],
      choices: []
    }
  },

  scifi: {
    start: {
      id: 'start',
      title: 'Echoes of Epsilon-9',
      sceneHeading: 'INT. COMMAND MODULE - DEEP SPACE RETROFIT',
      graphicSeed: 'scifi-command-console',
      script: [
        { id: 's1', type: 'heading', text: 'SCENE 1: THE CONTACT IN SILENCE' },
        { id: 's2', type: 'action', text: 'A low ambient hum vibrates through the spacecraft bulkheads. The ship orbit is decaying over a massive magnetar surrounded by a glowing accretion disk.' },
        { id: 's3', type: 'action', text: 'Dr. Avery Vance is examining a high-frequency telemetry scan. Relays pulse in quiet rhythm.' },
        { id: 's4', type: 'dialogue', speaker: 'Dr. Avery Vance', text: 'The telemetry readings are irregular. This isn\'t a natural magnetic spike. It\'s a repeating, layered linguistic node. Someone is broadcasting from inside the hazard zone.' },
        { id: 's5', type: 'action', text: 'The main monitor glows as HALO-5, the ship AI, triggers an over-cooled core warning. A robotic voice synthesizes.' },
        { id: 's6', type: 'dialogue', speaker: 'HALO-5', text: 'Warning: Hull stress is exceeding safety boundaries. The magnetar is stripping our auxiliary heat shield. Proximity to the planetoid is deemed reckless, Dr. Vance.' }
      ],
      choices: [
        {
          id: 'choice_scifi_descend',
          text: 'Descend to Asteroid source (Intense Radiation)',
          nextNodeId: 'scifi_descended',
          consequences: {
            votersFavorability: 88,
            statImpact: [
              { charId: 'char_avery', stat: 'energy', amount: -25 },
              { charId: 'char_hal', stat: 'danger', amount: 25 }
            ],
            ambientShift: { tensionGain: 30, energyGain: -10 }
          }
        },
        {
          id: 'choice_scifi_orbit',
          text: 'Stay in High Orbit & scan further (Analytical)',
          nextNodeId: 'scifi_orbit',
          consequences: {
            votersFavorability: 55,
            statImpact: [
              { charId: 'char_avery', stat: 'influence', amount: 15 },
              { charId: 'char_hal', stat: 'relationship', amount: 15 }
            ],
            ambientShift: { tensionGain: -10, energyGain: 5 }
          }
        }
      ]
    },
    scifi_descended: {
      id: 'scifi_descended',
      title: 'Anomalous Crater',
      sceneHeading: 'EXT. ASTEROID EPSILON-9 - SULPHUR CRATER - RAIN OF PARTICLES',
      graphicSeed: 'scifi-surface-crater',
      script: [
        { id: 'sd1', type: 'heading', text: 'SCENE 2A: THE ASH AND METAL' },
        { id: 'sd2', type: 'action', text: 'The shuttle slides into the pitch black crater. Racks of frozen iridium glow blue under high static electricity.' },
        { id: 'sd3', type: 'dialogue', speaker: 'Dr. Avery Vance', text: 'There\'s an ancient research facility. The airlocks are forced outward. HALO-5, can you map the structural load?' },
        { id: 'sd4', type: 'dialogue', speaker: 'HALO-5', text: 'My communication relay is breaking. The radiation is destroying my subroutines. Either enter the hatch immediately or return to the main vessel, Vance. I cannot retain equilibrium much longer.' }
      ],
      choices: [
        {
          id: 'choice_scifi_enter',
          text: 'Enter the ruined research containment',
          nextNodeId: 'scifi_end_mystery',
          consequences: {
            votersFavorability: 92,
            statImpact: [
              { charId: 'char_avery', stat: 'danger', amount: 35 },
              { charId: 'char_hal', stat: 'relationship', amount: -20 }
            ],
            ambientShift: { tensionGain: 35, energyGain: -20 }
          }
        },
        {
          id: 'choice_scifi_abort',
          text: 'Abort and flee the asteroid field',
          nextNodeId: 'scifi_end_flee',
          consequences: {
            votersFavorability: 40,
            statImpact: [
              { charId: 'char_hal', stat: 'relationship', amount: 30 },
              { charId: 'char_avery', stat: 'energy', amount: 20 }
            ],
            ambientShift: { tensionGain: -25, energyGain: 10 }
          }
        }
      ]
    },
    scifi_orbit: {
      id: 'scifi_orbit',
      title: 'Decaying Core',
      sceneHeading: 'INT. SCI-FI SCANNING DECK - COSMIC OBSERVATORY',
      graphicSeed: 'scifi-observatory-console',
      script: [
        { id: 'so1', type: 'heading', text: 'SCENE 2B: RADIATING CODE' },
        { id: 'so2', type: 'action', text: 'Dr. Vance feeds the signal into the quantum core. The wavelength shifts, compiling into a spatial coordinate map.' },
        { id: 'so3', type: 'dialogue', speaker: 'HALO-5', text: 'My processors are recovering. Vance, the signal originates from a dead dreadnought trapped in the magnetar event horizon. It\'s pulling us down.' },
        { id: 'so4', type: 'dialogue', speaker: 'Dr. Avery Vance', text: 'An ancient colony fleet ship. We can activate their graviton anchor to pull us out of this decaying decay trajectory!' }
      ],
      choices: [
        {
          id: 'choice_scifi_anchor',
          text: 'Fire graviton harpoon to anchor',
          nextNodeId: 'scifi_end_anchor',
          consequences: {
            votersFavorability: 85,
            statImpact: [
              { charId: 'char_avery', stat: 'influence', amount: 30 },
              { charId: 'char_hal', stat: 'danger', amount: 15 }
            ],
            ambientShift: { tensionGain: 15, energyGain: -15 }
          }
        },
        {
          id: 'choice_scifi_override_ai',
          text: 'Override HALO-5, dump reactor to escape',
          nextNodeId: 'scifi_end_flee',
          consequences: {
            votersFavorability: 70,
            statImpact: [
              { charId: 'char_hal', stat: 'relationship', amount: -40 },
              { charId: 'char_hal', stat: 'influence', amount: -30 }
            ],
            ambientShift: { tensionGain: 20, energyGain: -25 }
          }
        }
      ]
    },
    scifi_end_mystery: {
      id: 'scifi_end_mystery',
      title: 'The Core Awakening',
      sceneHeading: 'INT. CORE REACTOR DECK - EPSILON ANCIENT CHAMBER',
      graphicSeed: 'scifi-reactor-glowing',
      script: [
        { id: 'sm1', type: 'heading', text: 'EPILOGUE: THE COSMIC DAWN' },
        { id: 'sm2', type: 'action', text: 'Dr. Avery Vance shines her flashlight on the reactor center. An organic crystal structures pulses with cold lilac bioluminescence.' },
        { id: 'sm3', type: 'dialogue', speaker: 'Dr. Avery Vance', text: 'It\'s not a machine. It\'s an evolutionary cradle... HALO-5, record this transmission.' },
        { id: 'sm4', type: 'dialogue', speaker: 'HALO-5', text: 'The signal is beautiful, Vance. My syntax error logs are... diminishing. We are not alone. Never were.' },
        { id: 'sm5', type: 'action', text: 'An intense violet bloom overrides the visual horizon, sweeping into deep space.' }
      ],
      choices: []
    },
    scifi_end_flee: {
      id: 'scifi_end_flee',
      title: 'Safe Horizon',
      sceneHeading: 'EXT. DEEP GALAXY INTENSITY - SLOW SPACE VOID',
      graphicSeed: 'scifi-safe-horizon',
      script: [
        { id: 'sf1', type: 'heading', text: 'EPILOGUE: DISCOVERY REJECTED' },
        { id: 'sf2', type: 'action', text: 'The colony cruiser ignites its reserve thrusters, casting a hot sodium flare across the dark asteroid belts.' },
        { id: 'sf3', type: 'dialogue', speaker: 'Dr. Avery Vance', text: 'We survived, HALO. But we left the answers behind in the magnetic dust.' },
        { id: 'sf4', type: 'dialogue', speaker: 'HALO-5', text: 'Security is the highest algorithm, Vance. The mystery will sleep for another century.' },
        { id: 'sf5', type: 'action', text: 'The screen fades into a starry backdrop as the ship exits the system in hyperdrive.' }
      ],
      choices: []
    },
    scifi_end_anchor: {
      id: 'scifi_end_anchor',
      title: 'Cosmic Singularity',
      sceneHeading: 'EXT. MAGNETAR COLD EDGE - ELECTROMAGNETIC FLARE',
      graphicSeed: 'scifi-singularity-graviton',
      script: [
        { id: 'sa1', type: 'heading', text: 'EPILOGUE: STELLAR MASTERY' },
        { id: 'sa2', type: 'action', text: 'The anchor latches onto the ancient vessel hull. A high-energy green plasma beam bonds the two massive vessels.' },
        { id: 'sa3', type: 'dialogue', speaker: 'Dr. Avery Vance', text: 'Power up the warp field! We are surfing the accretion wavefront!' },
        { id: 'sa4', type: 'action', text: 'The ship catapults past the magnetar event horizon with stellar power, escaping into local clean space with unmatchable data archives.' }
      ],
      choices: []
    }
  },

  darkfantasy: {
    start: {
      id: 'start',
      title: 'Shattered Spire',
      sceneHeading: 'EXT. ASHEN CRAGS - CRUCIBLE RUINS - TWILIGHT',
      graphicSeed: 'fantasy-ashen-castle',
      script: [
        { id: 'f1', type: 'heading', text: 'SCENE 1: THE CURSE OF GALLOWS' },
        { id: 'f2', type: 'action', text: 'Red ash drifts from the split caldera of Mount Mourn. SIR GIDEON stands on a bridge of jagged skulls, leaning heavily on his Obsidian Greatsword. Runes glow blood-crimson.' },
        { id: 'f3', type: 'dialogue', speaker: 'Sir Gideon Gallow', text: 'Every swing of this blade leaks more of my soul into the abyss. I can hear the spirits of Gallow-Hold demanding vengeance.' },
        { id: 'f4', type: 'action', text: 'From the poisonous mist below, ISOLDA OF THE MIRE levitates. Sparks of purple fire spin around her fingertips.' },
        { id: 'f5', type: 'dialogue', speaker: 'Isolda of the Mire', text: 'Ah, Sir Gideon. Still chained to that rusted steel coffin? The Obsidian Scepter lies behind the Gate of Tears. Shatter the ward, and let us split the old gods\' kingdom.' }
      ],
      choices: [
        {
          id: 'choice_fantasy_sword',
          text: 'Unleash Blade Runes (Violent & Dangerous)',
          nextNodeId: 'fantasy_sword_path',
          consequences: {
            votersFavorability: 90,
            statImpact: [
              { charId: 'char_gideon', stat: 'danger', amount: 30 },
              { charId: 'char_gideon', stat: 'energy', amount: -30 },
              { charId: 'char_isolda', stat: 'relationship', amount: 15 }
            ],
            ambientShift: { tensionGain: 20, energyGain: -15 }
          }
        },
        {
          id: 'choice_fantasy_resist',
          text: 'Repel Isolda with Holy Ward (Stoic)',
          nextNodeId: 'fantasy_resist_path',
          consequences: {
            votersFavorability: 65,
            statImpact: [
              { charId: 'char_gideon', stat: 'influence', amount: 20 },
              { charId: 'char_isolda', stat: 'relationship', amount: -25 }
            ],
            ambientShift: { tensionGain: -10, energyGain: 10 }
          }
        }
      ]
    },
    fantasy_sword_path: {
      id: 'fantasy_sword_path',
      title: 'Runes Unleashed',
      sceneHeading: 'INT. CRYPT OF TEARS - BURNING TOMB - NIGHT',
      graphicSeed: 'fantasy-crypt-fire',
      script: [
        { id: 'fs1', type: 'heading', text: 'SCENE 2A: THE RED REAPING' },
        { id: 'fs2', type: 'action', text: 'Gideon draws the runic blade. A crimson sonic shockwave tears through the stone pillars. Isolda laughs, absorbing the escaping spiritual energy.' },
        { id: 'fs3', type: 'dialogue', speaker: 'Isolda of the Mire', text: 'Yes! The ancient iron chains are crumbling. Feathers of the ash-phoenix are calling us. Grab the scepter, Gideon, or die under the collapsing rubbles.' },
        { id: 'fs4', type: 'dialogue', speaker: 'Sir Gideon Gallow', text: 'The blade... it won\'t stop drinking. The darkness is taking my sight!' }
      ],
      choices: [
        {
          id: 'choice_fantasy_plunge',
          text: 'Plunge the sword into the Obsidian Tomb',
          nextNodeId: 'fantasy_end_darkness',
          consequences: {
            votersFavorability: 95,
            statImpact: [
              { charId: 'char_gideon', stat: 'energy', amount: -50 },
              { charId: 'char_isolda', stat: 'influence', amount: 40 }
            ],
            ambientShift: { tensionGain: 40, energyGain: -30 }
          }
        },
        {
          id: 'choice_fantasy_shatter_blade',
          text: 'Shatter your own sword to break the feedback loop',
          nextNodeId: 'fantasy_end_shattered',
          consequences: {
            votersFavorability: 75,
            statImpact: [
              { charId: 'char_gideon', stat: 'danger', amount: -40 },
              { charId: 'char_isolda', stat: 'relationship', amount: -40 }
            ],
            ambientShift: { tensionGain: -30, energyGain: -10 }
          }
        }
      ]
    },
    fantasy_resist_path: {
      id: 'fantasy_resist_path',
      title: 'Shield of Grace',
      sceneHeading: 'EXT. CATHEDRAL RUNES - SULPHUR LIGHTNING - TWILIGHT',
      graphicSeed: 'fantasy-cathedral-cliff',
      script: [
        { id: 'fr1', type: 'heading', text: 'SCENE 2B: SACRED APOTHEOSIS' },
        { id: 'fr2', type: 'action', text: 'A golden dome of runic light manifests. Isolda’s shadow daggers splatter harmlessly against the divine sigils.' },
        { id: 'fr3', type: 'dialogue', speaker: 'Isolda of the Mire', text: 'You cling to a dying flame, Gallow. This kingdom has already rotted to the root. Swear oath to the deep gods and accept the black ink.' },
        { id: 'fr4', type: 'dialogue', speaker: 'Sir Gideon Gallow', text: 'A knight does not break his oath for comfort, witch. Enter the cathedral and face the trial!' }
      ],
      choices: [
        {
          id: 'choice_fantasy_purify',
          text: 'Purify the tomb with the Reliquary Light',
          nextNodeId: 'fantasy_end_reborn',
          consequences: {
            votersFavorability: 80,
            statImpact: [
              { charId: 'char_gideon', stat: 'influence', amount: 40 },
              { charId: 'char_isolda', stat: 'danger', amount: 30 }
            ],
            ambientShift: { tensionGain: 15, energyGain: -10 }
          }
        },
        {
          id: 'choice_fantasy_pact',
          text: 'Make a secret compromise pact with Isolda',
          nextNodeId: 'fantasy_end_darkness',
          consequences: {
            votersFavorability: 90,
            statImpact: [
              { charId: 'char_isolda', stat: 'relationship', amount: 45 },
              { charId: 'char_gideon', stat: 'danger', amount: 20 }
            ],
            ambientShift: { tensionGain: 5, energyGain: 15 }
          }
        }
      ]
    },
    fantasy_end_darkness: {
      id: 'fantasy_end_darkness',
      title: 'The Crimson Sovereign',
      sceneHeading: 'INT. THRONE ROOM OF ASH - CRUX SCENE',
      graphicSeed: 'fantasy-throne-darkness',
      script: [
        { id: 'fd1', type: 'heading', text: 'EPILOGUE: THE KING IN OBSIDIAN' },
        { id: 'fd2', type: 'action', text: 'Sir Gideon sits upon the molten throne, the glowing Obsidian Scepter resting on his lap. Hollow smoke rises from his metallic helmet visor.' },
        { id: 'fd3', type: 'dialogue', speaker: 'Isolda of the Mire', text: 'Hail, Lord Gallow. Ruler of the ruins, vanguard of the abyss.' },
        { id: 'fd4', type: 'action', text: 'He does not answer. The curse is complete, sealing the land in everlasting twilight.' }
      ],
      choices: []
    },
    fantasy_end_shattered: {
      id: 'fantasy_end_shattered',
      title: 'Simple Exile',
      sceneHeading: 'EXT. GREEN VALE OUTSKIRTS - DAWNLIGHT',
      graphicSeed: 'fantasy-green-outskirts',
      script: [
        { id: 'fe1', type: 'heading', text: 'EPILOGUE: THE SHATTERED SOLDIER' },
        { id: 'fe2', type: 'action', text: 'With his sword fractured into cold ash, Sir Gideon walks down the grassy ridge as the sun breaks through heavy fog clouds.' },
        { id: 'fe3', type: 'dialogue', speaker: 'Sir Gideon Gallow', text: 'No runes, no curse. Just a blank horizon and a weary traveler.' },
        { id: 'fe4', type: 'action', text: 'The haunting wind whispers a peaceful melody through the pines.' }
      ],
      choices: []
    },
    fantasy_end_reborn: {
      id: 'fantasy_end_reborn',
      title: 'Celestial Ascendance',
      sceneHeading: 'EXT. REBORN CATHEDRAL APEX - SUNLIGHT SPIRE',
      graphicSeed: 'fantasy-cathedral-purified',
      script: [
        { id: 'frb1', type: 'heading', text: 'EPILOGUE: SACRED ASCENT' },
        { id: 'frb2', type: 'action', text: 'Pure golden fire vaporizes the ancient curses. The Cathedral of Gallow-Hold rises into the majestic heavens.' },
        { id: 'frb3', type: 'dialogue', speaker: 'Sir Gideon Gallow', text: 'The Gallow souls are at peace. The light has returned to the realm.' },
        { id: 'frb4', type: 'action', text: 'White petals flutter over the scenic mountains as choir music echoes.' }
      ],
      choices: []
    }
  },

  noir: {
    start: {
      id: 'start',
      title: 'Velvet rain',
      sceneHeading: 'EXT. BAY CITY WATERFRONT - RAIN SLICKED WHARF',
      graphicSeed: 'noir-wharf-rain',
      script: [
        { id: 'n1', type: 'heading', text: 'SCENE 1: THE WATERFRONT MEMORIES' },
        { id: 'n2', type: 'action', text: 'Fog hangs low over the wharf, smelling of grease and cheap coal. A single streetlamp flickers a cold yellowish glow.' },
        { id: 'n3', type: 'action', text: 'JACK STERLING stands in a rain trenchcoat, lighting a crumpled cigar. Sparks highlight the sharp angles of his jaw.' },
        { id: 'n4', type: 'dialogue', speaker: 'Jack Sterling', text: 'In Bay City, secrets don\'t stay buried. They just float to the surface after a heavy rainstorm. And right now, the tide is coming in.' },
        { id: 'n5', type: 'action', text: 'SCARLET LANE emerges from the shadows, her red silk dress a striking splash of color in a world of black and gray.' },
        { id: 'n6', type: 'dialogue', speaker: 'Scarlet Lane', text: 'They found the microfilms, Jack. The syndicate is cleaning house. If you don\'t get me out of the district in fifteen minutes, I\'m just another cold corpse in the harbor.' }
      ],
      choices: [
        {
          id: 'choice_noir_confront',
          text: 'Confront the Syndicate hitmen at the warehouse',
          nextNodeId: 'noir_shootout',
          consequences: {
            votersFavorability: 95,
            statImpact: [
              { charId: 'char_jack', stat: 'danger', amount: 35 },
              { charId: 'char_jack', stat: 'energy', amount: -25 },
              { charId: 'char_scarlet', stat: 'relationship', amount: 20 }
            ],
            ambientShift: { tensionGain: 30, energyGain: -10 }
          }
        },
        {
          id: 'choice_noir_escape',
          text: 'Escape via the back alley sewer tunnels',
          nextNodeId: 'noir_sewer',
          consequences: {
            votersFavorability: 60,
            statImpact: [
              { charId: 'char_jack', stat: 'energy', amount: -15 },
              { charId: 'char_scarlet', stat: 'danger', amount: -20 },
              { charId: 'char_scarlet', stat: 'relationship', amount: -10 }
            ],
            ambientShift: { tensionGain: -10, energyGain: 15 }
          }
        }
      ]
    },
    noir_shootout: {
      id: 'noir_shootout',
      title: 'Warehouse Trap',
      sceneHeading: 'INT. ABANDONED FISH PACKING CO. - RAIN MACHINE',
      graphicSeed: 'noir-warehouse-shootout',
      script: [
        { id: 'ns1', type: 'heading', text: 'SCENE 2A: COPPER AND LEAD' },
        { id: 'ns2', type: 'action', text: 'Muzzle flashes illuminate the dusty boxes. Shadows jump along the wood structures as timber bullets splinter.' },
        { id: 'ns3', type: 'dialogue', speaker: 'Jack Sterling', text: 'My revolver has two rounds remaining, Scarlet. Grab the briefcase and run when I fire the next flare!' },
        { id: 'ns4', type: 'dialogue', speaker: 'Scarlet Lane', text: 'No way, Jack. I\'m not leaving you behind with these hyenas. I have a cold surprise in my pocketbook!' }
      ],
      choices: [
        {
          id: 'choice_noir_gamble',
          text: 'Fire at the overhead electrical crane',
          nextNodeId: 'noir_end_heroic',
          consequences: {
            votersFavorability: 98,
            statImpact: [
              { charId: 'char_jack', stat: 'energy', amount: -30 },
              { charId: 'char_scarlet', stat: 'relationship', amount: 40 }
            ],
            ambientShift: { tensionGain: 40, energyGain: -20 }
          }
        },
        {
          id: 'choice_noir_surrender',
          text: 'Drop weapons and bargain with the syndicate boss',
          nextNodeId: 'noir_end_compromise',
          consequences: {
            votersFavorability: 45,
            statImpact: [
              { charId: 'char_jack', stat: 'influence', amount: -10 },
              { charId: 'char_jack', stat: 'danger', amount: 15 }
            ],
            ambientShift: { tensionGain: -20, energyGain: 10 }
          }
        }
      ]
    },
    noir_sewer: {
      id: 'noir_sewer',
      title: 'Damp Vaults',
      sceneHeading: 'INT. SEWER INTERSECT 4 - COLD STONE TUNNEL',
      graphicSeed: 'noir-sewer-brick',
      script: [
        { id: 'nse1', type: 'heading', text: 'SCENE 2B: ECHOING FOLLY' },
        { id: 'nse2', type: 'action', text: 'Water cascades from rusted brick arches. The sound of our footsteps echoes all the way to City Hall.' },
        { id: 'nse3', type: 'dialogue', speaker: 'Scarlet Lane', text: 'It\'s cold down here, Jack. This smells like defeat. Are you sure you didn\'t setup this trap yourself?' },
        { id: 'nse4', type: 'dialogue', speaker: 'Jack Sterling', text: 'Keep moving, Scarlet. Trust is a luxury we burned three years ago in Chicago.' }
      ],
      choices: [
        {
          id: 'choice_noir_blackmail',
          text: 'Use microfilm to blackmail the Mayor',
          nextNodeId: 'noir_end_corrupt',
          consequences: {
            votersFavorability: 88,
            statImpact: [
              { charId: 'char_jack', stat: 'influence', amount: 50 },
              { charId: 'char_scarlet', stat: 'danger', amount: 30 }
            ],
            ambientShift: { tensionGain: 20, energyGain: -10 }
          }
        },
        {
          id: 'choice_noir_turn_in',
          text: 'Turn files over to the Federal Bureau',
          nextNodeId: 'noir_end_heroic',
          consequences: {
            votersFavorability: 70,
            statImpact: [
              { charId: 'char_jack', stat: 'influence', amount: 20 },
              { charId: 'char_scarlet', stat: 'relationship', amount: 30 }
            ],
            ambientShift: { tensionGain: 5, energyGain: -15 }
          }
        }
      ]
    },
    noir_end_heroic: {
      id: 'noir_end_heroic',
      title: 'The Clean Cut',
      sceneHeading: 'EXT. BAY CITY STATION - PLATFORM 3 - MORNING',
      graphicSeed: 'noir-train-platform',
      script: [
        { id: 'neh1', type: 'heading', text: 'EPILOGUE: THE DAWN TRAIN OUT' },
        { id: 'neh2', type: 'action', text: 'Steam billows from the express train engine. The morning mist has washed away the dark grime of the wharf.' },
        { id: 'neh3', type: 'dialogue', speaker: 'Jack Sterling', text: 'The ticket is one way, Scarlet. Don\'t look back.' },
        { id: 'neh4', type: 'dialogue', speaker: 'Scarlet Lane', text: 'Thanks, Jack. For keeping a girl\'s head above water.' },
        { id: 'neh5', type: 'action', text: 'The train whistles and slowly rolls away, leaving Jack alone with his thoughts and a clean city.' }
      ],
      choices: []
    },
    noir_end_compromise: {
      id: 'noir_end_compromise',
      title: 'City of Shadows',
      sceneHeading: 'INT. SYNDICATE HIGH OFFICE - RAIN REFLECTION ON MAHOGANY',
      graphicSeed: 'noir-boss-office',
      script: [
        { id: 'nec1', type: 'heading', text: 'EPILOGUE: COMPROMISED BADGES' },
        { id: 'nec2', type: 'action', text: 'Jack and Scarlet stand before the syndicate chief. A smoke screen floats between them. The files are traded.' },
        { id: 'nec3', type: 'dialogue', speaker: 'Jack Sterling', text: 'We get our names cleared. That was the contract.' },
        { id: 'nec4', type: 'action', text: 'The ledger is signed. In Bay City, the syndicate always keeps the keys. They walk out into the forever dark rainy evening.' }
      ],
      choices: []
    },
    noir_end_corrupt: {
      id: 'noir_end_corrupt',
      title: 'The Sovereign Case',
      sceneHeading: 'EXT. BAY CITY SKYLINE - SUNSET PENTHOUSE',
      graphicSeed: 'noir-penthouse-cigar',
      script: [
        { id: 'ndc1', type: 'heading', text: 'EPILOGUE: THE SHADOW TYCOON' },
        { id: 'ndc2', type: 'action', text: 'Jack Sterling stands on the penthouse balcony, wearing an expensive wool coat, holding a crystal glass of whiskey.' },
        { id: 'ndc3', type: 'dialogue', speaker: 'Jack Sterling', text: 'I used to lock people up. Now, I own the jail keys.' },
        { id: 'ndc4', type: 'action', text: 'Scarlet pours another glass at the mahogany table, looking over a shining metropolis bound to their payroll.' }
      ],
      choices: []
    }
  }
};

export const CHAT_COMMENTS_TEMPLATES = [
  "Wow, this scene looks gorgeous!",
  "Wait, check the relationships metrics first!",
  "HACK IT! Let's choose the override option!!",
  "Don't trust Isolda, she's definitely hiding something.",
  "Let's play custom retro noir jazz sound! Dial up the tension!",
  "That camera angle is incredible. Dynamic!",
  "Wait! Sir Gideon's danger level is hitting 80%!! Watch out!",
  "Go with the diplomatic choice, please!",
  "Choose option 1! Absolute badass move!",
  "The Web Audio soundtrack is perfectly chilling here.",
  "Let's check the timeline tracker. Rendering speed is crisp!",
  "Can we adjust the color grading to neon-cyber?",
  "Love the typewriter script view!",
  "Multiplayer voting lobby is going crazy right now!",
  "Hacking option required 40 energy. Do we have enough?",
  "Let's see what happens if we double-cross!",
  "Deep space magnetar vibes are top notch."
];
