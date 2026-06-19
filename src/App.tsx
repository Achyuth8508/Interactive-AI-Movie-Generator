import { useState, useEffect } from 'react';
import { 
  Film, Sparkles, Sliders, Play, Pause, RefreshCw, Volume2, 
  VolumeX, HelpCircle, AlertCircle, PlayCircle, BookOpen, 
  GitBranch, Radio, Terminal, Settings2, Users, Tv
} from 'lucide-react';

import { StoryModeId, DirectorControlsState, ScriptLine, StoryNode, TimelineTrackSegment, RenderStyleId, AppThemeId } from './types';
import { 
  STORY_MODES_INFO, 
  INITIAL_CHARACTERS, 
  STORY_TREES 
} from './data';
import { 
  startAudioEngine, 
  updateAudioTension, 
  changeSynthStyle, 
  playTriggerSFX, 
  setGlobalVolume, 
  stopAudioEngine 
} from './utils/audio';

// Subcomponents modular layout
import { CinemaScreen } from './components/CinemaScreen';
import { StoryConfigPanel } from './components/StoryConfigPanel';
import { ScriptPane } from './components/ScriptPane';
import { CharacterPanel } from './components/CharacterPanel';
import { BranchFlow } from './components/BranchFlow';
import { DirectorControls } from './components/DirectorControls';
import { SequencerTimeline } from './components/SequencerTimeline';
import { MultiplayerLobby } from './components/MultiplayerLobby';

export default function App() {
  // Key state variables
  const [activeTab, setActiveTab] = useState<'studio' | 'story' | 'script' | 'cast'>('studio');
  const [activeMode, setActiveMode] = useState<StoryModeId>('cyberpunk');
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>(['start']);
  const [findings, setFindings] = useState<string[]>([]);
  const [globalTension, setGlobalTension] = useState(45);
  const [characters, setCharacters] = useState(INITIAL_CHARACTERS.cyberpunk);

  // Style customization configuration states
  const [renderStyle, setRenderStyle] = useState<RenderStyleId>('realistic');
  const [appTheme, setAppTheme] = useState<AppThemeId>('onyx');

  // Playback & compilation tracker state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [activeLineId, setActiveLineId] = useState<string>('1');

  // Interactive configurations settings state
  const [spectatorMode, setSpectatorMode] = useState<'solo' | 'audience'>('solo');
  const [isAudioMuted, setIsAudioMuted] = useState(true); // Default muted until gesture
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [directorSettings, setDirectorSettings] = useState<DirectorControlsState>({
    cameraAngle: 'dolly-zoom',
    colorGrading: 'neon-cyber',
    lightingMode: 'high-contrast',
    pacing: 'balanced',
    audioReverb: 'space',
    grainIntensity: 40,
  });

  const activeStoryTree = STORY_TREES[activeMode];
  const activeNode: StoryNode = activeStoryTree[currentNodeId] || activeStoryTree['start'];

  // Sync state when shifting general story mode templates
  const handleSelectMode = (modeId: StoryModeId) => {
    setActiveMode(modeId);
    setCurrentNodeId('start');
    setVisitedNodeIds(['start']);
    setFindings([]);
    setGlobalTension(STORY_MODES_INFO[modeId].initialTension);
    setCharacters(INITIAL_CHARACTERS[modeId]);
    setProgressPercent(0);
    setIsPlaying(false);

    // Dynamic rendering loading trigger
    triggerSimulatedRender();

    // Adjust synth music waveform style client settings
    const info = STORY_MODES_INFO[modeId];
    changeSynthStyle(info.synthMood.baseFreq, info.synthMood.waveType);
  };

  // Simulated render overlay ticker
  const triggerSimulatedRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setIsPlaying(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15 + 10);
      if (progress >= 100) {
        setRenderProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsRendering(false);
          setIsPlaying(true); // Auto play after compile
          playTriggerSFX('select');
        }, 350);
      } else {
        setRenderProgress(progress);
        playTriggerSFX('render');
      }
    }, 150);
  };

  // Start synth soundtrack on click
  const handleToggleSound = () => {
    if (isAudioMuted) {
      const modeInfo = STORY_MODES_INFO[activeMode];
      const started = startAudioEngine(modeInfo.synthMood.baseFreq, modeInfo.synthMood.waveType);
      if (started) {
        setIsAudioMuted(false);
        setGlobalVolume(0.8);
        playTriggerSFX('select');
      }
    } else {
      stopAudioEngine();
      setIsAudioMuted(true);
    }
  };

  // Automatically update sound tension level on the synth drone oscillators
  useEffect(() => {
    if (!isAudioMuted) {
      const modeInfo = STORY_MODES_INFO[activeMode];
      updateAudioTension(globalTension, modeInfo.synthMood.baseFreq);
    }
  }, [globalTension, activeMode, isAudioMuted]);

  // Synchronize script lines focus with active scrubber index position percentage
  useEffect(() => {
    if (!activeNode.script.length) return;
    
    // Divide 0-100% space evenly among script dialogue sections
    const count = activeNode.script.length;
    const step = 100 / count;
    const activeIndex = Math.min(
      count - 1,
      Math.floor(progressPercent / step)
    );
    
    const activeLine = activeNode.script[activeIndex];
    if (activeLine && activeLineId !== activeLine.id) {
      setActiveLineId(activeLine.id);
    }
  }, [progressPercent, activeNode, activeLineId]);

  const handleScrubToLineIndex = (index: number) => {
    if (!activeNode.script.length) return;
    const step = 100 / activeNode.script.length;
    const targetPercent = Math.max(0, Math.min(100, index * step + 0.1));
    setProgressPercent(targetPercent);
    setIsPlaying(false); // Pause so user can read action description details
    playTriggerSFX('select');
  };

  // Clock runner tick managing active video playback progression speed
  useEffect(() => {
    let runner: any;
    if (isPlaying && !isRendering) {
      // Speed multiplier based on pacing selection
      let pSpeed = 1.0;
      if (directorSettings.pacing === 'dramatic-slow') pSpeed = 0.55;
      else if (directorSettings.pacing === 'action-fast') pSpeed = 1.6;

      runner = setInterval(() => {
        setProgressPercent((prev) => {
          const next = prev + 0.6 * pSpeed;
          if (next >= 100) {
            clearInterval(runner);
            setIsPlaying(false);
            return 100;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(runner);
  }, [isPlaying, isRendering, directorSettings.pacing]);

  // Handle client custom story direct prompt submission
  const handleGenerateCustomStory = (userPromptText: string, tensionVal: number) => {
    setGlobalTension(tensionVal);
    // Add custom findings item representing direct input
    if (userPromptText.trim()) {
      setFindings((prev) => Array.from(new Set([...prev, 'director directive'])));
    }
    triggerSimulatedRender();
  };

  // Branch Decision Execution: selects choice and mutates characters layout
  const handleExecuteChoice = (choiceId: string) => {
    const activeChoice = activeNode.choices.find((c) => c.id === choiceId);
    if (!activeChoice) return;

    playTriggerSFX('branch');

    // Mutate character metrics states based on choice consequence objects
    const updatedChars = characters.map((char) => {
      const impacts = activeChoice.consequences.statImpact.filter((i) => i.charId === char.id);
      if (!impacts.length) return char;

      const updatedStats = { ...char.stats };
      impacts.forEach((imp) => {
        updatedStats[imp.stat] = Math.max(0, Math.min(100, updatedStats[imp.stat] + imp.amount));
        if (imp.stat === 'danger' && updatedStats[imp.stat] > 70) {
          playTriggerSFX('danger'); // play alert alarm growl growl
        }
      });

      return {
        ...char,
        stats: updatedStats
      };
    });

    setCharacters(updatedChars);

    // Apply global tension shifts
    setGlobalTension((prev) => {
      const shift = activeChoice.consequences.ambientShift.tensionGain;
      return Math.max(10, Math.min(100, prev + shift));
    });

    // Save choice name in discoveries lists
    const cleanWord = activeChoice.text.split('(')[0].trim().toLowerCase();
    setFindings((prev) => Array.from(new Set([...prev, cleanWord])));

    // Shift Node ID on tree
    const nextId = activeChoice.nextNodeId;
    setCurrentNodeId(nextId);
    setVisitedNodeIds((prev) => [...prev, nextId]);
    setProgressPercent(0);

    triggerSimulatedRender();
  };

  // Allow developer stats editor shifts directly on-the-fly
  const handleCharacterStatChange = (
    charId: string, 
    statName: 'relationship' | 'influence' | 'danger' | 'energy', 
    newValue: number
  ) => {
    setCharacters((prev) => 
      prev.map((c) => {
        if (c.id !== charId) return c;
        return {
          ...c,
          stats: {
            ...c.stats,
            [statName]: newValue
          }
        };
      })
    );
    playTriggerSFX('select');
  };

  // Set general key values under settings board
  const handleUpdateDirectorSetting = (key: keyof DirectorControlsState, value: any) => {
    setDirectorSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    playTriggerSFX('select');
  };

  // Fast skipped to next movie node if no choice parameters left
  const handleSkipScene = () => {
    if (activeNode.choices.length > 0) {
      // Pick first choice
      handleExecuteChoice(activeNode.choices[0].id);
    } else {
      // Reached ending, reset back to starting
      setCurrentNodeId('start');
      setVisitedNodeIds(['start']);
      setProgressPercent(0);
      triggerSimulatedRender();
    }
  };

  // Generate tracks segment layouts dynamically for Sequencer rendering
  const getTimelineTracks = (): {
    video: TimelineTrackSegment[];
    dialogue: TimelineTrackSegment[];
    audio: TimelineTrackSegment[];
    render: TimelineTrackSegment[];
  } => {
    const colPalette = activeMode === 'cyberpunk' ? '#ec4899' : activeMode === 'scifi' ? '#06b6d4' : activeMode === 'darkfantasy' ? '#f97316' : '#94a3b8';
    
    return {
      video: [
        { id: 'v1', label: `${directorSettings.cameraAngle.toUpperCase()}_SETTING`, startPercent: 0, endPercent: 30, type: 'video', color: colPalette },
        { id: 'v2', label: 'TRANS_SEEK_ZOOM', startPercent: 30, endPercent: 70, type: 'video', color: colPalette },
        { id: 'v3', label: `SCENE_DYNAMIC_ANGLE`, startPercent: 70, endPercent: 100, type: 'video', color: colPalette },
      ],
      dialogue: activeNode.script.map((line, kIdx) => {
        const span = 100 / activeNode.script.length;
        const name = line.speaker ? `${line.speaker.toUpperCase()}` : 'ACTION_BLOCK';
        return {
          id: `d_${kIdx}`,
          label: name,
          startPercent: kIdx * span,
          endPercent: (kIdx + 1) * span,
          type: 'dialogue',
          color: '#f59e0b'
        };
      }),
      audio: [
        { id: 'a1', label: `SYNTH_${activeMode.toUpperCase()}_drone`, startPercent: 0, endPercent: 50, type: 'audio', color: '#10b981' },
        { id: 'a2', label: `REVERB_${directorSettings.audioReverb.toUpperCase()}`, startPercent: 50, endPercent: 100, type: 'audio', color: '#10b981' },
      ],
      render: [
        { id: 'r1', label: 'COMPILING_FEED', startPercent: 0, endPercent: 100, type: 'render', color: '#8b5cf6' },
      ],
    };
  };

  const tracks = getTimelineTracks();

  // Define mapping of appTheme values to parent container, sidebar backgrounds, border colors, and text styles
  const getThemeClasses = () => {
    switch (appTheme) {
      case 'alabaster':
        return {
          container: 'min-h-screen bg-[#fcfbd7]/10 text-slate-800 flex flex-col justify-between selection:bg-amber-100 selection:text-slate-900 transition-all duration-300',
          header: 'bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between select-none',
          innerHeading: 'text-slate-800',
          textMuted: 'text-slate-500',
          panelBg: 'bg-white border-slate-200 text-slate-800',
        };
      case 'matrix':
        return {
          container: 'min-h-screen bg-[#030803] text-emerald-400 flex flex-col justify-between selection:bg-emerald-950/80 selection:text-emerald-100 font-mono transition-all duration-300',
          header: 'bg-black border-b border-emerald-950 py-3.5 px-6 flex items-center justify-between select-none',
          innerHeading: 'text-emerald-300',
          textMuted: 'text-emerald-600',
          panelBg: 'bg-black border-emerald-950 text-emerald-400',
        };
      case 'sunset':
        return {
          container: 'min-h-screen bg-[#140b07] text-[#f3d3b6] flex flex-col justify-between selection:bg-red-950/60 selection:text-amber-105 transition-all duration-300',
          header: 'bg-[#1b0d07] border-b border-red-950 py-3.5 px-6 flex items-center justify-between select-none',
          innerHeading: 'text-[#f59e0b]',
          textMuted: 'text-[#ca8a04]/80',
          panelBg: 'bg-[#1d120d] border-amber-950/60 text-[#f3d3b6]',
        };
      case 'onyx':
      default:
        return {
          container: 'min-h-screen bg-[#07070d] text-slate-100 flex flex-col justify-between selection:bg-rose-500/30 selection:text-white transition-all duration-300',
          header: 'bg-slate-950 border-b border-slate-900 py-3.5 px-6 flex items-center justify-between select-none',
          innerHeading: 'text-slate-100',
          textMuted: 'text-slate-400',
          panelBg: 'bg-slate-900 border-slate-800 text-slate-100',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={themeClasses.container}>
      
      {/* 1. UPPER UTILITY TOOLBAR NAVIGATION HEADER */}
      <header className={themeClasses.header}>
        
        {/* Logo and Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-rose-500 via-indigo-600 to-amber-400 flex items-center justify-center shadow shadow-indigo-500/20">
            <Film className="w-4 h-4 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-widest text-slate-100 uppercase">CineDirector Studio</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9.5px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                DIRECTOR CO-ENGINE 3.5 // ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Cinematic sound indicator launcher */}
        <div className="flex items-center gap-3">
          
          {/* Dashboard Theme Switcher */}
          <div className={`flex items-center gap-1 p-1 rounded-md border text-xs font-mono ${
            appTheme === 'alabaster' 
              ? 'bg-slate-100 border-slate-300' 
              : appTheme === 'matrix' 
                ? 'bg-black border-emerald-950' 
                : appTheme === 'sunset' 
                  ? 'bg-red-990/60 border-amber-950' 
                  : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-1 hidden lg:inline ${
              appTheme === 'alabaster' ? 'text-slate-600' : 'text-slate-400'
            }`}>THEME:</span>
            {(['onyx', 'alabaster', 'matrix', 'sunset'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setAppTheme(t);
                  playTriggerSFX('select');
                }}
                className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter transition-all cursor-pointer ${
                  appTheme === t
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : appTheme === 'alabaster'
                      ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                      : t === 'matrix'
                        ? 'text-emerald-500 hover:text-emerald-200 hover:bg-emerald-950/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Switch workspace to ${t}`}
              >
                {t === 'onyx' ? '🎬 Onyx' : t === 'alabaster' ? '☀️ light' : t === 'matrix' ? '👾 Matrix' : '🌅 Sunset'}
              </button>
            ))}
          </div>

          {/* Audio Engine button control */}
          <button
            id="synth-soundtrack-engine-btn"
            onClick={handleToggleSound}
            className={`px-3 py-1.5 rounded-md border flex items-center gap-2 text-xs font-mono cursor-pointer transition-all ${
              !isAudioMuted 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-950/20 text-rose-400 border-rose-500/20 hover:bg-rose-500/10'
            }`}
            title="Starts dynamic ambient soundtrack synthesized inside your browser via Web Audio API"
          >
            {!isAudioMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{!isAudioMuted ? "SYNTH SOUNDSCAPE" : "SOUND HUM"}</span>
          </button>

          <button 
            id="help-modal-trigger-btn"
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded border border-slate-900 cursor-pointer text-xs"
          >
            FAQ
          </button>
        </div>
      </header>

      {/* 2. HELP MODAL ACCORDION / FAQ */}
      {isHelpOpen && (
        <section className="bg-slate-900 border-b border-slate-800 p-5 font-mono text-xs text-slate-300 transition-all">
          <div className="max-w-4xl mx-auto space-y-3.5">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              STUDIO CAPABILITIES & SYSTEM GUIDE
            </h3>
            <p>
              This environment simulates a real-time web-based video render block studio. Toggling choices alters storyline variables client-side:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <strong>Multiple Story Modes:</strong> Choose between Cyberpunk, Deep Space, gothic Dark Fantasy, or detective Noir under parameter selector #1.
              </li>
              <li>
                <strong>Adaptive Audio Space:</strong> Boots beautiful Web Audio synthesized low-frequency hums which pitch shift dynamically as story tension expands.
              </li>
              <li>
                <strong>Interactive Scriptwriter:</strong> Highlights screenplay blocks as video timeline scrubbers crawl forwards.
              </li>
              <li>
                <strong>Multiplayer Voting:</strong> Switch game modes to Co-Director to watch simulated audience voters lobby and vote on choices in real time!
              </li>
            </ul>
            <button 
              id="close-faq-btn"
              onClick={() => setIsHelpOpen(false)}
              className="mt-2 bg-indigo-600 hover:bg-indigo-500 px-3 py-1 text-[11px] text-white rounded cursor-pointer transition font-bold"
            >
              CLOSE SYSTEM GUIDE
            </button>
          </div>
        </section>
      )}

      {/* PAGE TABS DOCK - SPLITTING WORKSPACE DIVISIONS INTO SEPARATE PAGES */}
      <div className={`px-4 sm:px-6 py-3 border-b flex-shrink-0 flex flex-wrap items-center justify-between gap-4 transition-all ${
        appTheme === 'alabaster' 
          ? 'bg-slate-50 border-slate-200' 
          : appTheme === 'matrix' 
            ? 'bg-black border-emerald-950/80' 
            : appTheme === 'sunset' 
              ? 'bg-[#180e0a] border-red-950' 
              : 'bg-slate-950 border-slate-900'
      }`}>
        {/* Left side: Navigation labels */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* TAB 1: STUDIO MONITOR */}
          <button
            onClick={() => {
              setActiveTab('studio');
              playTriggerSFX('select');
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all text-xs font-mono font-bold uppercase cursor-pointer select-none border ${
              activeTab === 'studio'
                ? appTheme === 'alabaster'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-100'
                  : appTheme === 'matrix'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow shadow-emerald-500/20'
                    : appTheme === 'sunset'
                      ? 'bg-red-950/80 border-amber-500 text-amber-300 shadow shadow-amber-500/15'
                      : 'bg-slate-900 border-indigo-500 text-white shadow shadow-indigo-500/20'
                : appTheme === 'alabaster'
                  ? 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  : appTheme === 'matrix'
                    ? 'bg-slate-950/40 text-emerald-600 border-emerald-950/30 hover:text-emerald-400 hover:bg-emerald-950/10'
                    : appTheme === 'sunset'
                      ? 'bg-[#150a06] text-[#cda886] border-[#2d160c] hover:text-[#f3d3b6] hover:bg-[#20100a]'
                      : 'bg-slate-900/35 text-slate-400 border-slate-800/60 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>🎬 Studio Monitor</span>
            {isRendering ? (
              <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1 py-0.2 rounded font-black animate-pulse">RENDER</span>
            ) : isPlaying ? (
              <span className="text-[9px] bg-emerald-500/25 text-emerald-400 px-1 py-0.2 rounded font-black animate-pulse">LIVE</span>
            ) : (
              <span className="text-[9px] bg-slate-800 text-slate-500 px-1 py-0.2 rounded font-black">STBY</span>
            )}
          </button>

          {/* TAB 2: STORY ARCHITECT */}
          <button
            onClick={() => {
              setActiveTab('story');
              playTriggerSFX('select');
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all text-xs font-mono font-bold uppercase cursor-pointer select-none border ${
              activeTab === 'story'
                ? appTheme === 'alabaster'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-100'
                  : appTheme === 'matrix'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow shadow-emerald-500/20'
                    : appTheme === 'sunset'
                      ? 'bg-red-950/80 border-amber-500 text-amber-300 shadow shadow-amber-500/15'
                      : 'bg-slate-900 border-indigo-500 text-white shadow shadow-indigo-500/20'
                : appTheme === 'alabaster'
                  ? 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  : appTheme === 'matrix'
                    ? 'bg-slate-950/40 text-emerald-600 border-emerald-950/30 hover:text-emerald-400 hover:bg-emerald-950/10'
                    : appTheme === 'sunset'
                      ? 'bg-[#150a06] text-[#cda886] border-[#2d160c] hover:text-[#f3d3b6] hover:bg-[#20100a]'
                      : 'bg-slate-900/35 text-slate-400 border-slate-800/60 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>🌿 Story Architect</span>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-bold">
              {activeMode.substring(0, 5).toUpperCase()}
            </span>
          </button>

          {/* TAB 3: SCREENPLAY SCRIPT */}
          <button
            onClick={() => {
              setActiveTab('script');
              playTriggerSFX('select');
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all text-xs font-mono font-bold uppercase cursor-pointer select-none border ${
              activeTab === 'script'
                ? appTheme === 'alabaster'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-100'
                  : appTheme === 'matrix'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow shadow-emerald-500/20'
                    : appTheme === 'sunset'
                      ? 'bg-red-950/80 border-amber-500 text-amber-300 shadow shadow-amber-500/15'
                      : 'bg-slate-900 border-indigo-500 text-white shadow shadow-indigo-500/20'
                : appTheme === 'alabaster'
                  ? 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  : appTheme === 'matrix'
                    ? 'bg-slate-950/40 text-emerald-600 border-emerald-950/30 hover:text-emerald-400 hover:bg-emerald-950/10'
                    : appTheme === 'sunset'
                      ? 'bg-[#150a06] text-[#cda886] border-[#2d160c] hover:text-[#f3d3b6] hover:bg-[#20100a]'
                      : 'bg-slate-900/35 text-slate-400 border-slate-800/60 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>✍️ Screenplay Script</span>
            <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded font-bold">
              SCENE {activeNode.script.length > 0 ? activeNode.script.findIndex(l => l.id === activeLineId) + 1 : 0}/{activeNode.script.length}
            </span>
          </button>

          {/* TAB 4: CAST & LOBBY */}
          <button
            onClick={() => {
              setActiveTab('cast');
              playTriggerSFX('select');
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 transition-all text-xs font-mono font-bold uppercase cursor-pointer select-none border ${
              activeTab === 'cast'
                ? appTheme === 'alabaster'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-100'
                  : appTheme === 'matrix'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow shadow-emerald-500/20'
                    : appTheme === 'sunset'
                      ? 'bg-red-950/80 border-amber-500 text-amber-300 shadow shadow-amber-500/15'
                      : 'bg-slate-900 border-indigo-500 text-white shadow shadow-indigo-500/20'
                : appTheme === 'alabaster'
                  ? 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  : appTheme === 'matrix'
                    ? 'bg-slate-950/40 text-emerald-600 border-emerald-950/30 hover:text-emerald-400 hover:bg-emerald-950/10'
                    : appTheme === 'sunset'
                      ? 'bg-[#150a06] text-[#cda886] border-[#2d160c] hover:text-[#f3d3b6] hover:bg-[#20100a]'
                      : 'bg-slate-900/35 text-slate-400 border-slate-800/60 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>👥 Cast & Crew</span>
            <span className="text-[9px] bg-indigo-500/25 text-indigo-400 px-1 py-0.2 rounded font-bold">
              {characters.length} CHARS
            </span>
          </button>
        </div>

        {/* Right side: Page context details block */}
        <div className="hidden lg:flex items-center gap-3">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Active Scene Frame:</span>
          <span className="text-xs font-mono font-bold text-amber-500 bg-slate-900/40 px-2 py-1 rounded border border-slate-800/50">
            {currentNodeId.toUpperCase()}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider ml-1">Tension Level:</span>
          <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${
            globalTension > 70 
              ? 'text-rose-400 bg-rose-950/20 border-rose-905/30 animate-pulse font-black' 
              : 'text-indigo-400 bg-indigo-950/20 border-indigo-905/30'
          }`}>
            {globalTension}%
          </span>
        </div>
      </div>

      {/* 3. CORE STUDIO SCREENSPACE WORKSPACE SPLIT BLOCK PANELS */}
      <main className="flex-1 p-6 flex flex-col gap-5 overflow-hidden min-h-0">
        {activeTab === 'studio' && (
          <div className="w-full flex flex-col xl:flex-row gap-5 flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
            {/* Main Cinema Workspace left col (8/12 equivalent) */}
            <section className="flex-1 flex flex-col gap-5 justify-between min-h-0">
              {/* Dynamic Render viewport screen overlay */}
              <div className="flex-1 min-h-[300px] md:min-h-[440px] relative">
                <CinemaScreen 
                  mode={activeMode}
                  nodeTitle={activeNode.script.length > 0 ? activeNode.script[activeNode.script.length - 1].text : 'Compiling...'}
                  graphicSeed={activeNode.graphicSeed}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  progressPercent={progressPercent}
                  setProgressPercent={setProgressPercent}
                  directorSettings={directorSettings}
                  scoreTension={globalTension}
                  isRendering={isRendering}
                  renderProgress={renderProgress}
                  onChoiceVisible={progressPercent >= 100}
                  onSkipScene={handleSkipScene}
                  renderStyle={renderStyle}
                  onSelectRenderStyle={setRenderStyle}
                  activeNode={activeNode}
                  activeLineId={activeLineId}
                />
              </div>

              {/* Dynamic interactive choice branches trigger screen */}
              {progressPercent >= 100 && activeNode.choices.length > 0 && (
                <div id="choice-popover-prompt" className="bg-slate-900 border border-amber-500/40 p-4 rounded-lg shadow-xl shadow-amber-950/10 text-center animate-fade-in animate-pulse shrink-0">
                  <span className="text-amber-400 font-mono text-[10px] uppercase font-black tracking-widest block mb-2">
                    🎬 DIRECTOR ACTION KEY: DECISION JUNCTION DETECTED
                  </span>
                  <p className="text-xs text-slate-300 font-serif mb-4 italic">
                    The script requires a branch path to finalize the rendering timeline. Select one choice below:
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    {activeNode.choices.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleExecuteChoice(c.id)}
                        className="bg-slate-950 hover:bg-amber-950/20 text-xs font-mono font-bold text-amber-200 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 p-3 rounded cursor-pointer transition-all active:scale-[0.99] flex-1"
                      >
                        {c.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* If the active scene is an Epilogue (no choices remaining) */}
              {progressPercent >= 100 && activeNode.choices.length === 0 && (
                <div id="epilogue-end-card" className="bg-slate-950 border border-emerald-500/30 p-4 rounded-lg shadow-xl text-center shrink-0">
                  <span className="text-emerald-400 font-mono text-[10px] uppercase font-black tracking-widest block mb-2">
                    ✓ MOVIE COMPILATION ACHIEVED
                  </span>
                  <p className="text-xs text-slate-300 font-serif mb-4 italic">
                    You have reached one of the premium thematic endings for {STORY_MODES_INFO[activeMode].name}.
                  </p>
                  <button
                    id="reset-story-reel-btn"
                    onClick={() => {
                      setCurrentNodeId('start');
                      setVisitedNodeIds(['start']);
                      setProgressPercent(0);
                      setFindings([]);
                      setGlobalTension(STORY_MODES_INFO[activeMode].initialTension);
                      triggerSimulatedRender();
                    }}
                    className="bg-emerald-950/40 hover:bg-emerald-900/40 text-xs font-mono font-bold text-emerald-400 border border-emerald-700/50 px-5 py-2.5 rounded cursor-pointer transition-all uppercase"
                  >
                    RESET STORY REEL & EDIT AGAIN
                  </button>
                </div>
              )}

              {/* Main sequence Track layout view */}
              <div className="shrink-0">
                <SequencerTimeline 
                  progressPercent={progressPercent}
                  onScrub={setProgressPercent}
                  tracks={tracks}
                  activeAngle={directorSettings.cameraAngle}
                  activeGrade={directorSettings.colorGrading}
                />
              </div>
            </section>

            {/* Quick dashboard details side panel on studio screen (4/12 equivalent) */}
            <section className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
              <div className="border border-slate-800 bg-slate-900/45 rounded-lg p-4 space-y-4 shadow-lg flex-1 overflow-y-auto max-h-[640px] xl:max-h-none scrollbar-thin">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-mono font-black tracking-widest text-slate-200 uppercase">
                    STUDIO CONSOLE
                  </h3>
                </div>
                
                {/* Active script line snippet so they are not clueless */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">On Air Line Summary</span>
                  {activeNode.script.find(l => l.id === activeLineId) ? (
                    <div className="bg-slate-950/80 p-2.5 rounded border border-slate-850">
                      <p className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider mb-1">
                        {activeNode.script.find(l => l.id === activeLineId)?.speaker || "SCENE DIRECTIVE"}
                      </p>
                      <p className="text-[11px] text-slate-300 italic">
                        "{activeNode.script.find(l => l.id === activeLineId)?.text}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-600 font-mono italic">No dialog parsed yet.</p>
                  )}
                </div>

                <div className="border-t border-slate-800/40 my-2 pt-2">
                  <DirectorControls 
                    settings={directorSettings}
                    onUpdateSetting={handleUpdateDirectorSetting}
                  />
                </div>
                
                <div className="bg-slate-950/60 p-3 rounded-md border border-slate-850 text-center space-y-1.5 shadow-sm">
                  <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider block">Currently Rendering Theme</span>
                  <div className="text-xs font-bold font-serif text-slate-200 flex items-center justify-center gap-1">
                    <span>{STORY_MODES_INFO[activeMode].name}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#f59e0b] bg-amber-950/40 px-2 py-0.5 rounded-full inline-block">
                    {STORY_MODES_INFO[activeMode].initialTension}% Ambient tension
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PAGE 2: STORY ARCHITECT PAGE */}
        {activeTab === 'story' && (
          <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
            {/* Story Prompt Options */}
            <div className="xl:col-span-4 h-full flex flex-col">
              <StoryConfigPanel 
                currentMode={activeMode}
                onSelectMode={handleSelectMode}
                onGenerateStory={handleGenerateCustomStory}
                isGenerating={isRendering}
              />
            </div>

            {/* Interactive Story branches tree & statistics tracker */}
            <div className="xl:col-span-8 h-full flex flex-col">
              <BranchFlow
                mode={activeMode}
                currentNodeId={currentNodeId}
                storyTree={activeStoryTree}
                tension={globalTension}
                visitedNodes={visitedNodeIds}
                findings={findings}
                onSelectNode={(id) => {
                  setCurrentNodeId(id);
                  setProgressPercent(0);
                  playTriggerSFX('select');
                }}
              />
            </div>
          </div>
        )}

        {/* PAGE 3: SCREENPLAY SCRIPT PAGE */}
        {activeTab === 'script' && (
          <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
            {/* Script section */}
            <div className="xl:col-span-8 h-full flex flex-col">
              <ScriptPane 
                scriptLines={activeNode.script}
                activeLineId={activeLineId}
                onFramePromptSelect={(p) => {
                  setFindings((prev) => Array.from(new Set([...prev, p.substring(0, 10)])));
                  triggerSimulatedRender();
                }}
                playbackProgressPercent={progressPercent}
              />
            </div>

            {/* Camera settings */}
            <div className="xl:col-span-4 h-full flex flex-col">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col gap-4 shadow-lg h-full overflow-y-auto scrollbar-thin">
                <div className="pb-2 border-b border-amber-500/20">
                  <span className="text-amber-400 font-mono text-[9px] uppercase font-black tracking-widest block mb-0.5">BACKSTAGE CONTROL</span>
                  <h3 className="text-sm font-bold text-slate-200">SCRIPTWRITER CAMERA</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Adjust visual configurations directly correlated to physical camera placements and post-processing color LUT profiles below:
                </p>
                <div className="flex-1">
                  <DirectorControls 
                    settings={directorSettings}
                    onUpdateSetting={handleUpdateDirectorSetting}
                  />
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded border border-slate-850/85 text-[10px] text-slate-500 font-mono leading-relaxed space-y-1">
                  <p className="text-slate-400 font-bold">💡 FILM GRAIN INTENSITY NOTE</p>
                  <p>Higher grains represent ancient analogue film stock, adding gorgeous randomized noise over real-time Canvas renders.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 4: CAST & LOBBY PAGE */}
        {activeTab === 'cast' && (
          <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto xl:overflow-hidden">
            {/* Character list */}
            <div className="xl:col-span-7 h-full flex flex-col">
              <CharacterPanel 
                characters={characters}
                onStatHack={handleCharacterStatChange}
                activeNode={activeNode}
                activeLineId={activeLineId}
                onScrubToLineIndex={handleScrubToLineIndex}
              />
            </div>

            {/* Multiplayer simulated lobbies */}
            <div className="xl:col-span-5 h-full flex flex-col gap-5 justify-between">
              <MultiplayerLobby 
                choices={activeNode.choices}
                isVotingActive={progressPercent >= 100}
                onVoteComplete={handleExecuteChoice}
                gameMode={spectatorMode}
                onChangeGameMode={setSpectatorMode}
              />

              <div className="bg-slate-900 border border-slate-850 p-4 rounded-lg flex flex-col gap-2 shadow shadow-indigo-950/10">
                <span className="text-[#a855f7] font-mono text-[9.5px] uppercase font-black tracking-widest flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-purple-400" /> Co-Director voting channel
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Lobby mode lets you direct scenes via simulated crowd sourced voting feedback. The audience continuously lobbies for specific branches, simulating real-life movie streaming watchparties!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. BOTTOM CREDITS MARGIN */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3.5 px-6 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-slate-500 select-none">
        <div>
          <span>STUDIO WORKSPACE STATUS: </span>
          <span className="text-emerald-500 font-bold">READY TO REC</span>
        </div>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <span>BUFFERS: <strong className="text-slate-400">100% SECURE</strong></span>
          <span>SAMPLES: <strong className="text-slate-400">16-BIT / 44.1 KHZ</strong></span>
          <span>© DEEPMIND ANTIGRAVITY ENGINE</span>
        </div>
      </footer>
    </div>
  );
}
