import React, { useRef } from 'react';
import { Layers, Watch, Sliders, Play, Scissors, Milestone } from 'lucide-react';
import { TimelineTrackSegment } from '../types';

interface SequencerTimelineProps {
  progressPercent: number; // 0 to 100
  onScrub: (percent: number) => void;
  tracks: {
    video: TimelineTrackSegment[];
    dialogue: TimelineTrackSegment[];
    audio: TimelineTrackSegment[];
    render: TimelineTrackSegment[];
  };
  activeAngle: string;
  activeGrade: string;
}

export const SequencerTimeline: React.FC<SequencerTimelineProps> = ({
  progressPercent,
  onScrub,
  tracks,
  activeAngle,
  activeGrade,
}) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    onScrub(percentage);
  };

  return (
    <div id="sequencer-timeline-track" className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">SEQUENCE TIMELINE SEQUENCER</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <span className="text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
            VIDEO_LUT: <strong className="text-purple-400 uppercase">{activeGrade}</strong>
          </span>
          <span className="text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-850">
            CAM_VIEW: <strong className="text-indigo-400 uppercase">{activeAngle}</strong>
          </span>
          <span className="text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-850 flex items-center gap-1">
            <Watch className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            TIMING: <strong className="text-emerald-400">00:00:24</strong>
          </span>
        </div>
      </div>

      {/* Main Track container */}
      <div className="space-y-2.5 relative select-none">
        
        {/* Render timeline track rulers */}
        <div className="flex justify-between text-[9px] font-mono text-slate-500 px-3 py-1 bg-slate-950/60 rounded border border-slate-850/40">
          <span>0.00s</span>
          <span>5.00s</span>
          <span>10.00s</span>
          <span>15.00s</span>
          <span>20.00s</span>
          <span>25.00s</span>
          <span>30.50s</span>
          <span>35.00s</span>
          <span>40.00s</span>
          <span>45.00s</span>
        </div>

        {/* Visualizer Tracks panel wrapper */}
        <div 
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="relative bg-[#0d0d14] rounded-lg border border-slate-950 p-3 space-y-3 overflow-hidden cursor-crosshair min-h-[160px]"
        >
          {/* TRACK 1: Video Angle segment tracks */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[10px] font-mono text-slate-400 uppercase select-none shrink-0 border-r border-slate-850">VIDEO</span>
            <div className="relative flex-1 h-6 bg-slate-950 rounded overflow-hidden">
              {tracks.video.map((seg) => (
                <div 
                  key={seg.id}
                  className="absolute top-1 bottom-1 rounded border flex items-center justify-center text-[8px] font-bold font-mono tracking-wider text-white select-none transition-all"
                  style={{
                    left: `${seg.startPercent}%`,
                    width: `${seg.endPercent - seg.startPercent}%`,
                    backgroundColor: `${seg.color}25`,
                    borderColor: `${seg.color}66`
                  }}
                >
                  {seg.label}
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 2: Dialogue Translation queues */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[10px] font-mono text-slate-400 uppercase select-none shrink-0 border-r border-slate-850">DIALOGUE</span>
            <div className="relative flex-1 h-6 bg-slate-950 rounded overflow-hidden">
              {tracks.dialogue.map((seg) => (
                <div 
                  key={seg.id}
                  className="absolute top-1 bottom-1 rounded border flex items-center justify-center text-[8px] font-bold font-mono tracking-wider text-slate-300 select-none transition-all"
                  style={{
                    left: `${seg.startPercent}%`,
                    width: `${seg.endPercent - seg.startPercent}%`,
                    backgroundColor: `${seg.color}15`,
                    borderColor: `${seg.color}30`
                  }}
                >
                  {seg.label}
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 3: Ambient Web Audio synth triggers */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[10px] font-mono text-slate-400 uppercase select-none shrink-0 border-r border-slate-850">AUDIO BD</span>
            <div className="relative flex-1 h-6 bg-slate-950 rounded overflow-hidden">
              {tracks.audio.map((seg) => (
                <div 
                  key={seg.id}
                  className="absolute top-1 bottom-1 rounded border flex items-center justify-center text-[8px] font-bold font-mono tracking-wider text-slate-400 select-none transition-all"
                  style={{
                    left: `${seg.startPercent}%`,
                    width: `${seg.endPercent - seg.startPercent}%`,
                    backgroundColor: `${seg.color}10`,
                    borderColor: `${seg.color}20`
                  }}
                >
                  {seg.label}
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 4: Render progress compiler */}
          <div className="flex items-center gap-3">
            <span className="w-16 text-[10px] font-mono text-slate-400 uppercase select-none shrink-0 border-r border-slate-850">SFX TRIG</span>
            <div className="relative flex-1 h-6 bg-slate-950 rounded overflow-hidden">
              {tracks.render.map((seg) => (
                <div 
                  key={seg.id}
                  className="absolute top-1 bottom-1 rounded border flex items-center justify-center text-[8px] font-bold font-mono tracking-wider text-slate-300 select-none transition-all"
                  style={{
                    left: `${seg.startPercent}%`,
                    width: `${seg.endPercent - seg.startPercent}%`,
                    backgroundColor: `${seg.color}20`,
                    borderColor: `${seg.color}40`
                  }}
                >
                  {seg.label}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical scrubber needle reflecting exact progress */}
          <div 
            id="timeline-needle-scruber"
            className="absolute top-0 bottom-0 w-[2px] bg-rose-500 pointer-events-none z-10 shadow shadow-rose-500/80 transition-all duration-75"
            style={{ left: `calc(${progressPercent}% + 75px)` }}
          >
            <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold select-none shadow">
              🜲
            </div>
          </div>
        </div>

      </div>

      <div className="mt-3.5 flex flex-col md:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-2 select-none border-t border-slate-850 pt-2.5">
        <span className="flex items-center gap-1 text-slate-400">
          <Scissors className="w-3.5 h-3.5 text-indigo-400" />
          TRACK SYNC: OK // ACTIVE MULTI-SAMPLER PIPELINE RESOLVED
        </span>
        <span className="text-slate-500 flex items-center gap-1.5">
          <Milestone className="w-3.5 h-3.5 text-[#ec4899]" />
          CHOICE MARKER PLACEMENT AT 100% MARGIN RANGE
        </span>
      </div>
    </div>
  );
};
