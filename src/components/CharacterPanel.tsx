import React from 'react';
import { User, Shield, Zap, TrendingUp, Skull, Play, BookOpen } from 'lucide-react';
import { Character, StoryNode, ScriptLine } from '../types';

interface CharacterPanelProps {
  characters: Character[];
  onStatHack: (charId: string, statName: 'relationship' | 'influence' | 'danger' | 'energy', newValue: number) => void;
  activeNode: StoryNode;
  activeLineId: string;
  onScrubToLineIndex: (index: number) => void;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  characters,
  onStatHack,
  activeNode,
  activeLineId,
  onScrubToLineIndex,
}) => {
  // Helper to find all script lines associated with a character
  const getCharacterLines = (char: Character): { line: ScriptLine; index: number }[] => {
    if (!activeNode || !activeNode.script) return [];

    // Filter out common short titles and determiners
    const ignoredWords = new Set(['dr.', 'sir', 'of', 'the', 'mire', 'detective', 'de']);
    const nameTokens = char.name
      .toLowerCase()
      .split(/\s+/)
      .filter(token => token.length > 1 && !ignoredWords.has(token));

    const charIdToken = char.id.toLowerCase().replace('char_', '');

    return activeNode.script
      .map((line, idx) => {
        let isMatch = false;

        if (line.speaker) {
          const speakerLower = line.speaker.toLowerCase();
          if (speakerLower.includes(charIdToken)) isMatch = true;
          nameTokens.forEach(token => {
            if (speakerLower.includes(token)) isMatch = true;
          });
        }

        if (line.text) {
          const textLower = line.text.toLowerCase();
          if (textLower.includes(charIdToken)) isMatch = true;
          nameTokens.forEach(token => {
            if (textLower.includes(token)) isMatch = true;
          });
        }

        return isMatch ? { line, index: idx } : null;
      })
      .filter((item): item is { line: ScriptLine; index: number } => item !== null);
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-lg h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">CHARACTER CAST roster</h2>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mb-4 leading-relaxed">
          Interactive bios & cast variables. Choices alter relationships, stress levels, and danger elements instantly.
        </p>

        <div className="space-y-4">
          {characters.map((char) => {
            const charLines = getCharacterLines(char);
            const activeLineItem = charLines.find(cl => cl.line.id === activeLineId);
            const isCurrentlyActing = !!activeLineItem;

            return (
              <div 
                key={char.id}
                className={`p-3 h-full rounded border hover:border-slate-700 transition duration-150 flex flex-col gap-3 ${
                  isCurrentlyActing
                    ? 'bg-amber-950/15 border-amber-500/50 shadow shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-850'
                }`}
              >
                {/* Upper row: Avatar & basic info */}
                <div className="flex gap-3">
                  {/* Left Side: Portrait Avatar & Role */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative">
                      <img 
                        src={char.avatar} 
                        alt={char.name}
                        referrerPolicy="no-referrer"
                        className={`w-14 h-14 rounded-full object-cover border-2 transition-all ${
                          isCurrentlyActing
                            ? 'border-amber-400 scale-[1.05] shadow-lg shadow-amber-500/20'
                            : 'border-emerald-500/40'
                        }`}
                      />
                      {isCurrentlyActing ? (
                        <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-sans font-black text-[7.5px] px-1 py-0.2 rounded-full uppercase animate-bounce tracking-widest">
                          LIVE
                        </div>
                      ) : (
                        <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 px-1 py-0.2 rounded text-[8px] font-mono font-black text-emerald-400">
                          ID: {char.id.split('_')[1].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 mt-2 text-center select-none bg-slate-900 px-1 border border-slate-800/60 rounded">
                      {char.role}
                    </span>
                  </div>

                  {/* Right Side: Biodata Stats & Variable Meters */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-200">{char.name}</h4>
                        {isCurrentlyActing && (
                          <span className="text-[8px] font-mono text-amber-300 bg-amber-950/60 px-1 rounded flex items-center gap-0.5 animate-pulse uppercase font-black">
                            {activeLineItem.line.type === 'dialogue' ? '🗣️ TALKING' : '🎭 ACTING'}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {char.traits.map((trait, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="text-[8px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-1.5 py-0.2 rounded"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                      "{char.bio}"
                    </p>
                  </div>
                </div>

                {/* Scenario Actions and script connection block */}
                <div className="bg-slate-900/40 p-2 rounded-md border border-slate-850 space-y-1">
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-850">
                    <span className="text-[8.5px] font-mono font-bold tracking-widest text-[#f59e0b] uppercase flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-500" /> Scenario Actions / Line cues
                    </span>
                    <span className="text-[8px] font-mono text-slate-500 uppercase font-black">
                      Index Match
                    </span>
                  </div>
                  
                  {charLines.length === 0 ? (
                    <span className="text-[9px] font-mono text-slate-500 italic block py-0.5">
                      No active screen cues for this node.
                    </span>
                  ) : (
                    <div className="space-y-1 max-h-[110px] overflow-y-auto scrollbar-thin">
                      {charLines.map(({ line, index }) => {
                        const isActive = line.id === activeLineId;
                        return (
                          <button
                            key={line.id}
                            type="button"
                            onClick={() => onScrubToLineIndex(index)}
                            className={`w-full text-left p-1 rounded text-[9.5px] font-mono leading-normal flex items-center justify-between gap-1 border transition-all ${
                              isActive
                                ? 'bg-amber-500/10 text-amber-200 border-amber-500/40 font-bold'
                                : 'bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-950'
                            }`}
                            title="Scrub timeline to this action scene"
                          >
                            <span className="truncate max-w-[80%] flex items-center gap-1">
                              <span className={`w-1 h-1 rounded-full shrink-0 ${
                                isActive 
                                  ? 'bg-amber-400 animate-ping' 
                                  : line.type === 'dialogue' 
                                    ? 'bg-sky-400' 
                                    : 'bg-indigo-400'
                              }`} />
                              <span className="truncate">
                                {line.type === 'dialogue' ? `"${line.text}"` : line.text}
                              </span>
                            </span>
                            <span className={`text-[7px] tracking-tighter uppercase px-1 rounded ${
                              isActive 
                                ? 'bg-amber-500 text-slate-950 font-bold' 
                                : 'bg-slate-900 text-slate-500'
                            }`}>
                              Scene {index + 1}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Micro metrics sliders */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1 border-t border-slate-900">
                  {/* Trust Relationship */}
                  <div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span className="flex items-center gap-1"><TrendingUp className="w-2.5 h-2.5 text-blue-400" /> TRUST</span>
                      <span className="text-blue-400 font-bold">{char.stats.relationship}%</span>
                    </div>
                    <div className="relative mt-1">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={char.stats.relationship}
                        onChange={(e) => onStatHack(char.id, 'relationship', parseInt(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Influence */}
                  <div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span className="flex items-center gap-1"><Shield className="w-2.5 h-2.5 text-indigo-400" /> CLOUT</span>
                      <span className="text-indigo-400 font-bold">{char.stats.influence}%</span>
                    </div>
                    <div className="relative mt-1">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={char.stats.influence}
                        onChange={(e) => onStatHack(char.id, 'influence', parseInt(e.target.value))}
                        className="w-full accent-indigo-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Danger Status */}
                  <div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span className="flex items-center gap-1"><Skull className="w-2.5 h-2.5 text-rose-400" /> STRESS</span>
                      <span className="text-rose-400 font-bold">{char.stats.danger}%</span>
                    </div>
                    <div className="relative mt-1">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={char.stats.danger}
                        onChange={(e) => onStatHack(char.id, 'danger', parseInt(e.target.value))}
                        className="w-full accent-rose-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Energy Willpower */}
                  <div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5 text-amber-400" /> ENERGY</span>
                      <span className="text-amber-400 font-bold">{char.stats.energy}%</span>
                    </div>
                    <div className="relative mt-1">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={char.stats.energy}
                        onChange={(e) => onStatHack(char.id, 'energy', parseInt(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-slate-900 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      <div className="text-[9px] font-mono text-slate-500 mt-2 bg-slate-950 p-2 rounded border border-slate-850">
        📌 <strong>DIRECTOR TRIVIA:</strong> Click and drag client-side stat sliders above to simulated-override narrative checkpoints on-the-fly!
      </div>
    </div>
  );
};
