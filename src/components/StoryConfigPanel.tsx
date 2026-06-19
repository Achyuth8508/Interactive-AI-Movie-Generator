import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, Film, Flame, Wand2 } from 'lucide-react';
import { StoryModeId } from '../types';
import { STORY_MODES_INFO } from '../data';

interface StoryConfigPanelProps {
  currentMode: StoryModeId;
  onSelectMode: (mode: StoryModeId) => void;
  onGenerateStory: (prompt: string, tensionOverride: number) => void;
  isGenerating: boolean;
}

export const StoryConfigPanel: React.FC<StoryConfigPanelProps> = ({
  currentMode,
  onSelectMode,
  onGenerateStory,
  isGenerating,
}) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [initTension, setInitTension] = useState(30);

  const activeModeDetails = STORY_MODES_INFO[currentMode];

  const handleModeChange = (modeId: StoryModeId) => {
    onSelectMode(modeId);
    setInitTension(STORY_MODES_INFO[modeId].initialTension);
  };

  const loadPresetPrompt = (presetNo: number) => {
    let presetText = '';
    if (currentMode === 'cyberpunk') {
      presetText = presetNo === 1 
        ? "A corporate security hacker is cornered by enforcers while carrying a critical stolen biometric memory drive."
        : "Infiltrating the neon-lit high-society underground neural link club to download bank database codes.";
    } else if (currentMode === 'scifi') {
      presetText = presetNo === 1
        ? "An abandoned deep space colony emits magnetic signals near a decaying event horizon."
        : "Investigating ancient biological crystals growing inside the engines of a deserted cosmic cruiser.";
    } else if (currentMode === 'darkfantasy') {
      presetText = presetNo === 1
        ? "A cursed runic warrior tries to prevent a dynamic ash witch from stealing the Obsidian Scepter."
        : "Breaking deep into the gargoyle-protected Crypt of Tears to cleanse an ancient skeletal monolith.";
    } else {
      presetText = presetNo === 1
        ? "A trenchcoat detective gets intercepted by a beautiful lounge singer on a wet dock holding microfilms."
        : "Confronting the city mayor's corrupt bodyguards inside a high-end mahogany syndicate penthouse office.";
    }
    setUserPrompt(presetText);
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateStory(userPrompt || "An epic survival scenario with dynamic plot twists and branching paths.", initTension);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-lg h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">1. STORY CREATION PARAMETERS</h2>
        </div>

        {/* Narrative Mode Templates */}
        <label className="block text-xs font-mono text-slate-400 mb-2">SELECT STYLISTIC STORY MODE</label>
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {(Object.keys(STORY_MODES_INFO) as StoryModeId[]).map((modeId) => {
            const m = STORY_MODES_INFO[modeId];
            const isSelected = currentMode === modeId;
            return (
              <button
                key={modeId}
                onClick={() => handleModeChange(modeId)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected 
                    ? `bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/50` 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-mono font-bold uppercase transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {m.name.split(' ')[0]}
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`} />
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{m.tagline}</p>
              </button>
            );
          })}
        </div>

        {/* Story details layout */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 mb-5">
          <h3 className="text-xs font-mono font-bold text-slate-300">{activeModeDetails.name}</h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{activeModeDetails.description}</p>
        </div>

        {/* Directed Prompt Input */}
        <form onSubmit={handleGenerateSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                DIRECT ENGINE PROMPT (ADAPTIVE DIRECTIVES)
              </label>
              <span className="text-[9px] text-slate-500 font-mono">OPTIONAL</span>
            </div>
            <textarea
              id="story-creation-input-textarea"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g. Include a heavy rainstorm scene, an EMP explosion, or a custom betrayal twist..."
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>

          {/* Quick presets helper */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 mr-2">CHOOSE DIRECTIONAL PRESET:</span>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => loadPresetPrompt(1)}
                className="text-[10.5px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-850 px-2 py-1 rounded cursor-pointer transition-all"
              >
                #1 Core Conflict
              </button>
              <button
                type="button"
                onClick={() => loadPresetPrompt(2)}
                className="text-[10.5px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-850 px-2 py-1 rounded cursor-pointer transition-all"
              >
                #2 Infiltration Climax
              </button>
            </div>
          </div>

          {/* Initial Tension Parameter */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                INITIAL STORY TENSION
              </label>
              <span className="text-xs font-mono font-bold text-rose-400">{initTension}%</span>
            </div>
            <input
              id="initial-tension-input-bar"
              type="range"
              min="10"
              max="90"
              value={initTension}
              onChange={(e) => setInitTension(parseInt(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[9px] text-slate-500 mt-1 text-right">Governs lowpass reverb frequency of synthesis synth soundtrack</p>
          </div>

          <button
            id="compile-studio-narrative-btn"
            type="submit"
            disabled={isGenerating}
            className={`w-full py-2.5 rounded font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isGenerating
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:translate-y-[1px]'
            }`}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                <span>SYNTHESIZING SCREENPLAY MOVIE...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>GENERATE SIMULATED MOVIE BRANCH</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="border-t border-slate-800 pt-3 mt-4 text-[10px] font-mono text-slate-500 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
        <span>DIRECTOR ENGINE ONLINE // CO-PROCESSOR CONNECTED</span>
      </div>
    </div>
  );
};
