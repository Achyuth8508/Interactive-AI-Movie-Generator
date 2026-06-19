import React from 'react';
import { Sliders, Camera, Palette, ShieldAlert, Sun, Activity } from 'lucide-react';
import { DirectorControlsState } from '../types';

interface DirectorControlsProps {
  settings: DirectorControlsState;
  onUpdateSetting: (key: keyof DirectorControlsState, value: any) => void;
}

export const DirectorControls: React.FC<DirectorControlsProps> = ({
  settings,
  onUpdateSetting,
}) => {
  return (
    <div id="creative-director-board" className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-lg h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">DIRECTOR CREATIVE CONTROLS</h2>
        </div>

        <p className="text-[11px] font-mono text-slate-400 mb-5 leading-relaxed">
          Tweak movie pipeline rendering values. Overrides film aesthetics & camera viewpoints in real-time.
        </p>

        <div className="space-y-4">
          {/* CAMERA POINT OF VIEW */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-purple-400" />
              CAMERA LENS TYPE & VIEWPOINT
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['close-up', 'panoramic', 'dolly-zoom', 'birds-eye', 'low-angle'] as const).map((angle) => {
                let displayName = '';
                if (angle === 'close-up') displayName = '85mm Prime (Close-Up)';
                else if (angle === 'panoramic') displayName = '24mm Wide Anamorphic';
                else if (angle === 'dolly-zoom') displayName = 'Vertigo Dolly-Zoom';
                else if (angle === 'birds-eye') displayName = 'High-Angle Crane Shot';
                else if (angle === 'low-angle') displayName = 'Low Ground Tilt Frame';
                return (
                  <button
                    key={angle}
                    onClick={() => onUpdateSetting('cameraAngle', angle)}
                    className={`py-1.5 px-1 text-[9.5px] font-mono uppercase tracking-wide rounded border transition-all cursor-pointer ${
                      settings.cameraAngle === angle 
                        ? 'bg-purple-950/40 text-purple-300 border-purple-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLOR LUT GRADING */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              35MM REEL FILM STOCK & COLOR LUT
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['neon-cyber', 'obsidian-black', 'teal-orange', 'vintage-sepia', 'emerald-fog'] as const).map((grade) => {
                let displayName = '';
                if (grade === 'neon-cyber') displayName = 'Kodak Vision3 Neon';
                else if (grade === 'obsidian-black') displayName = 'Panavision Monochrome';
                else if (grade === 'teal-orange') displayName = 'Hollywood Blockbuster';
                else if (grade === 'vintage-sepia') displayName = 'Ektachrome Retro Warm';
                else if (grade === 'emerald-fog') displayName = 'Cinestill Emerald Haze';
                return (
                  <button
                    key={grade}
                    onClick={() => onUpdateSetting('colorGrading', grade)}
                    className={`py-1.5 px-1 text-[9.5px] font-mono uppercase tracking-wide rounded border transition-all cursor-pointer ${
                      settings.colorGrading === grade 
                        ? 'bg-purple-950/40 text-purple-300 border-purple-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIGHTING MODELS */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-purple-400" />
              SENSOR PHOTO EXPOSURE & SCENE LIGHT
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['high-contrast', 'ambient-glow', 'lens-flare', 'shadow-heavy'] as const).map((light) => {
                let displayName = '';
                if (light === 'high-contrast') displayName = 'Chiaroscuro Contrast';
                else if (light === 'ambient-glow') displayName = 'Volumetric Fog Glow';
                else if (light === 'lens-flare') displayName = 'Anamorphic Lens Flare';
                else if (light === 'shadow-heavy') displayName = 'Deep Shadow Negative Fill';
                return (
                  <button
                    key={light}
                    onClick={() => onUpdateSetting('lightingMode', light)}
                    className={`py-1.5 px-1 text-[9.5px] font-mono uppercase tracking-wide rounded border transition-all cursor-pointer ${
                      settings.lightingMode === light 
                        ? 'bg-purple-950/40 text-purple-300 border-purple-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PACING MODELS */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              SHUTTER SPEED & CAPTURE FRAMERATE
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['dramatic-slow', 'balanced', 'action-fast'] as const).map((pace) => {
                let displayName = '';
                if (pace === 'dramatic-slow') displayName = '24FPS 1/48s';
                else if (pace === 'balanced') displayName = '24FPS 180°';
                else if (pace === 'action-fast') displayName = '60FPS 1/120s';
                return (
                  <button
                    key={pace}
                    onClick={() => onUpdateSetting('pacing', pace)}
                    className={`py-1.5 text-[8.5px] font-mono uppercase tracking-widest rounded border transition-all cursor-pointer ${
                      settings.pacing === pace 
                        ? 'bg-purple-950/40 text-purple-300 border-purple-500 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILM NOISE GRAIN INTENSITY */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                35MM REEL SILVER HALIDE GRAIN
              </label>
              <span className="text-xs font-mono font-bold text-purple-400">{settings.grainIntensity}%</span>
            </div>
            <input
              id="noise-grain-slider-bar"
              type="range"
              min="0"
              max="100"
              value={settings.grainIntensity}
              onChange={(e) => onUpdateSetting('grainIntensity', parseInt(e.target.value))}
              className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[9px] text-slate-500 mt-1 text-right">Simulates organic emulsion crystal speckles</p>
          </div>
        </div>
      </div>

      <div className="text-[9px] font-mono text-slate-500 mt-4 bg-slate-950 p-2.5 rounded border border-slate-850">
        💡 <strong>GRIDER ADVICE:</strong> Toggle <strong>TEAL ORANGE</strong> style paired with <strong>DOLLY ZOOM</strong> viewpoint for standard big-screen Hollywood look!
      </div>
    </div>
  );
};
