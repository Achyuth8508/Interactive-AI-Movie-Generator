import React, { useEffect, useState } from 'react';
import { AlignLeft, Terminal, Highlighter, Video } from 'lucide-react';
import { ScriptLine } from '../types';

interface ScriptPaneProps {
  scriptLines: ScriptLine[];
  activeLineId: string;
  onFramePromptSelect: (prompt: string) => void;
  playbackProgressPercent: number;
}

export const ScriptPane: React.FC<ScriptPaneProps> = ({
  scriptLines,
  activeLineId,
  onFramePromptSelect,
  playbackProgressPercent,
}) => {
  const [typedTexts, setTypedTexts] = useState<Record<string, string>>({});

  // Simulate rich cinematic typewriter flow when rendering or switching nodes
  useEffect(() => {
    // Reset typewriter text and do a fast word crawl
    const initialTyped: Record<string, string> = {};
    const timers: any[] = [];

    scriptLines.forEach((line) => {
      // Setup base blank or half-typed to avoid waiting forever
      initialTyped[line.id] = '';
      
      const fullWords = line.text.split(' ');
      let currentWordIndex = 0;

      const runTypewriter = () => {
        if (currentWordIndex <= fullWords.length) {
          const shown = fullWords.slice(0, currentWordIndex).join(' ');
          setTypedTexts((prev) => ({ ...prev, [line.id]: shown }));
          currentWordIndex++;
          const t = setTimeout(runTypewriter, 45); // comfortable typewriter speed
          timers.push(t);
        }
      };

      // Stagger line typing based on sequential dialogue index
      const delay = scriptLines.indexOf(line) * 500;
      const initialDelayTimeout = setTimeout(runTypewriter, delay);
      timers.push(initialDelayTimeout);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [scriptLines]);

  // Synchronized scrolling to the active line index
  useEffect(() => {
    if (activeLineId) {
      const activeEl = document.getElementById(`script-line-${activeLineId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeLineId]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-lg h-full">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">SCREENPLAY SCRIPT GENERATION</h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded flex items-center gap-1">
            <Terminal className="w-3 h-3 animate-pulse" />
            LIVE COMPELLER TYPEWRITER
          </span>
        </div>

        {/* Paper style inner backing container */}
        <div className="bg-[#171720] border border-slate-950 p-4 rounded h-[380px] overflow-y-auto font-mono scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          
          <div className="space-y-6 text-slate-300 relative">
            {/* Thread timeline line */}
            <div className="absolute left-1.5 top-2 bottom-2 w-[1px] bg-slate-800 pointer-events-none" />

            {scriptLines.map((line, idx) => {
              const isActive = activeLineId === line.id;
              const hasPrompt = !!line.framePrompt;
              const typedText = typedTexts[line.id] || line.text;

              return (
                <div 
                  key={line.id}
                  id={`script-line-${line.id}`}
                  className={`relative pl-6 pb-2 transition-all duration-300 rounded ${
                    isActive 
                      ? 'bg-amber-500/15 border-l-2 border-l-amber-500 shadow shadow-amber-500/5 py-2' 
                      : 'border-l-2 border-l-transparent'
                  }`}
                >
                  {/* Timeline tracking node circle */}
                  <span className={`absolute left-0 top-[6px] w-[7px] h-[7px] rounded-full border ${
                    isActive 
                      ? 'bg-amber-500 border-amber-300 shadow shadow-amber-500/80 scale-125' 
                      : 'bg-slate-900 border-slate-700'
                  }`} />

                  {/* Render based on formatting standards */}
                  {line.type === 'heading' && (
                    <div className="text-[11px] font-black tracking-widest text-[#f59e0b] uppercase mt-2 select-none">
                      {typedText}
                    </div>
                  )}

                  {line.type === 'transition' && (
                    <div className="text-[10px] font-bold text-right text-slate-500 uppercase py-1 select-none">
                      {typedText}
                    </div>
                  )}

                  {line.type === 'action' && (
                    <div className="text-xs text-slate-400 leading-relaxed italic pl-1">
                      {typedText}
                    </div>
                  )}

                  {line.type === 'dialogue' && (
                    <div className="flex flex-col items-center justify-center my-3 relative px-4">
                      {/* Dialogue Header centered */}
                      <span className="text-[10.5px] font-bold text-slate-200 tracking-wider uppercase mb-1 flex items-center gap-1 bg-slate-900/60 px-2 py-0.2 border border-slate-800/80 rounded">
                        {line.speaker}
                      </span>
                      {/* Character cue */}
                      {line.cameraCue && (
                        <span className="text-[9px] text-[#f59e0b] font-serif italic mb-1">
                          ({line.cameraCue})
                        </span>
                      )}
                      {/* Actual dialogue block */}
                      <p className="text-xs text-amber-200 text-center font-serif leading-relaxed max-w-[85%] bg-slate-900/10 p-1.5 rounded">
                        "{typedText}"
                      </p>
                    </div>
                  )}

                  {/* Live Render prompt connector tag */}
                  {hasPrompt && (
                    <div className="mt-3 flex items-center justify-between bg-slate-950 p-2 rounded-md border border-slate-800/40 select-none">
                      <div className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="text-[9px] font-mono text-slate-400 uppercase line-clamp-1">
                          FRAME SEED PROMPT: {line.framePrompt}
                        </span>
                      </div>
                      <button 
                        onClick={() => onFramePromptSelect(line.framePrompt!)}
                        className="px-2 py-0.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-400 text-[8px] font-mono rounded cursor-pointer transition-all shrink-0 active:scale-95"
                      >
                        INJECT PROMPT
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>SYNC STATUS: PLAYBACK INDEX {Math.round(playbackProgressPercent)}%</span>
        <span>LINE COUNT: {scriptLines.length}</span>
      </div>
    </div>
  );
};
