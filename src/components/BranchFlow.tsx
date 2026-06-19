import React from 'react';
import { GitFork, Eye, HelpCircle, Flame, Star, Award, ChevronRight } from 'lucide-react';
import { StoryModeId, StoryNode } from '../types';

interface BranchFlowProps {
  mode: StoryModeId;
  currentNodeId: string;
  storyTree: Record<string, StoryNode>;
  tension: number;
  visitedNodes: string[];
  findings: string[];
  onSelectNode: (nodeId: string) => void;
}

export const BranchFlow: React.FC<BranchFlowProps> = ({
  mode,
  currentNodeId,
  storyTree,
  tension,
  visitedNodes,
  findings,
  onSelectNode,
}) => {
  return (
    <div id="narrative-branching-module" className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-lg h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <GitFork className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">NARRATIVE BRANCHING STATE</h2>
        </div>

        {/* Global state gauges */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-950 p-2.5 rounded border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-slate-500">STORY TENSION</span>
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-rose-400">{tension}</span>
              <span className="text-[10px] font-mono text-slate-600">/ 100</span>
            </div>
            <div className="w-full bg-slate-900 h-1 rounded overflow-hidden mt-1.5">
              <div 
                className="bg-rose-500 h-full transition-all duration-500" 
                style={{ width: `${tension}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-slate-500">PLOT STABILITY</span>
              <Star className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-emerald-400">{100 - tension * 0.4}</span>
              <span className="text-[10px] font-mono text-slate-600">% OK</span>
            </div>
            <div className="w-full bg-slate-900 h-1 rounded overflow-hidden mt-1.5">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${100 - tension * 0.4}%` }}
              />
            </div>
          </div>
        </div>

        {/* Node visual tree flowchart representation */}
        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2.5">
          STORYBRANCH PIPELINE GRAPH
        </label>
        
        {/* Render a beautiful interactive flow path list of nodes */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {Object.keys(storyTree).map((nodeId, index) => {
            const node = storyTree[nodeId];
            const isActive = currentNodeId === nodeId;
            const isVisited = visitedNodes.includes(nodeId);

            return (
              <div 
                key={nodeId}
                onClick={() => onSelectNode(nodeId)}
                className={`p-2.5 rounded border text-left cursor-pointer transition-all flex items-center justify-between ${
                  isActive 
                    ? 'bg-rose-950/20 border-rose-500 shadow-md shadow-rose-900/10' 
                    : isVisited 
                      ? 'bg-slate-950/80 border-slate-700 opacity-75 hover:opacity-100'
                      : 'bg-slate-950/40 border-slate-850 opacity-50 hover:opacity-85'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isActive 
                      ? 'bg-rose-500 text-white' 
                      : isVisited 
                        ? 'bg-slate-700 text-slate-300' 
                        : 'bg-slate-850 text-slate-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">{node.title}</h4>
                    <p className="text-[9px] font-mono text-slate-500">{node.sceneHeading.split(' - ')[0]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[9px]">
                  {isActive && <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded animate-pulse">ACTIVE SECTOR</span>}
                  {isVisited && !isActive && <span className="text-slate-500">PLAYED</span>}
                  {!isVisited && <span className="text-slate-600">UNOPENED</span>}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Display discoveries unlocked list */}
        <div className="mt-5">
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            DISCOVERY FINDINGS UNLOCKED
          </label>
          <div className="flex flex-wrap gap-1.5">
            {findings.length === 0 ? (
              <span className="text-[10px] font-mono text-slate-500 italic bg-slate-950 py-1.5 px-3 rounded w-full border border-slate-850 select-none">
                No clues discovered yet. Select interactive branches to discover items.
              </span>
            ) : (
              findings.map((tok, idx) => (
                <span 
                  key={idx} 
                  className="text-[9px] font-mono bg-amber-950/50 text-amber-300 border border-amber-900/60 px-2.5 py-1 rounded"
                >
                  ✓ {tok.toUpperCase()}
                </span>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="border-t border-slate-800 pt-3 mt-4 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>STORY_MODE: {mode.toUpperCase()}</span>
        <span>DEPTH: {visitedNodes.length} STAGES</span>
      </div>
    </div>
  );
};
