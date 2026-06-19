import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, FastForward, SkipForward, Volume2, Maximize, Cpu, Film, Server, Radio, Users } from 'lucide-react';
import { StoryModeId, DirectorControlsState, RenderStyleId, StoryNode, ScriptLine } from '../types';
import { getAudioAnalyserData } from '../utils/audio';

interface CinemaScreenProps {
  mode: StoryModeId;
  nodeTitle: string;
  graphicSeed: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  progressPercent: number;
  setProgressPercent: (value: number) => void;
  directorSettings: DirectorControlsState;
  scoreTension: number;
  onChoiceVisible: boolean;
  onSkipScene: () => void;
  isRendering: boolean;
  renderProgress: number; // 0 to 100
  renderStyle: RenderStyleId;
  onSelectRenderStyle: (style: RenderStyleId) => void;
  activeNode?: StoryNode;
  activeLineId?: string;
}

export const SEED_PHOTO_URLS: Record<string, string> = {
  // Cyberpunk seeds (Netrunners, enforcers, neon alleys)
  'cyberpunk-hovel-rain': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1280&h=720', // Female cyberpunk coder in neon room
  'cyberpunk-neon-matrix': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1280&h=720', // Neon grid matrix mainframe
  'cyberpunk-alley-compromise': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1280&h=720', // Rain alley cyberpunk character
  'cyberpunk-escaped': 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?auto=format&fit=crop&q=80&w=1280&h=720', // Moody futuristic cybernetic city overpass
  'cyberpunk-corporate-vault': 'https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=1280&h=720', // Corporate server vault
  'cyberpunk-ally': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=1280&h=720', // Neon hackers back-to-back
  'cyberpunk-helipad-rain': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1280&h=720', // Rainy helicopter pad city glow
  'cyberpunk-chase-endpoint': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1280&h=720',

  // Sci-fi seeds (Dr. Avery Vance, laboratories, outer space)
  'scifi-command-console': 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1280&h=720', // Female astronaut looking through visor
  'scifi-surface-crater': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1280&h=720', // Astrobiologist on foreign world
  'scifi-observatory-console': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1280&h=720', // Wide projection star map deck
  'scifi-reactor-glowing': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1280&h=720', // Reactor hall glowing crystal crystals
  'scifi-safe-horizon': 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&q=80&w=1280&h=720', // Stellar cruiser engines hyperdrive escape
  'scifi-singularity-graviton': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1280&h=720', // Singularity portal and plasma channel

  // Dark Fantasy seeds (Sir Gideon, witches, ash castles)
  'fantasy-ashen-castle': 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=1280&h=720', // Knight battle armor close-up
  'fantasy-crypt-fire': 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&q=80&w=1280&h=720', // Warrior in burning stone temple crypt
  'fantasy-cathedral-cliff': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1280&h=720', // Gothic citadel temple under static storm
  'fantasy-throne-darkness': 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=1280&h=720', // Dark knight resting on fortress throne
  'fantasy-green-outskirts': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1280&h=720', // Misty valley hills scenery forest
  'fantasy-cathedral-purified': 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=1280&h=720', // Golden palace floating in white sky

  // Noir seeds (Detective Jack Sterling, Scarlet, rain cobblestones)
  'noir-wharf-rain': 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&q=80&w=1280&h=720', // Vintage detective in fedora trenchcoat
  'noir-warehouse-shootout': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=1280&h=720', // Warehouse brick structures muzzle flashes
  'noir-sewer-brick': 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&q=80&w=1280&h=720', // Brick underground tunnels and streams
  'noir-train-platform': 'https://images.unsplash.com/photo-1515165504660-a17df4c43bcc?auto=format&fit=crop&q=80&w=1280&h=720', // Misty train tracks steam platform
  'noir-boss-office': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1280&h=720', // Wooden gangster study room smoky shade
  'noir-penthouse-cigar': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1280&h=720', // Retro gentleman penthouse balcony view
};

export const CinemaScreen: React.FC<CinemaScreenProps> = ({
  mode,
  nodeTitle,
  graphicSeed,
  isPlaying,
  setIsPlaying,
  progressPercent,
  setProgressPercent,
  directorSettings,
  scoreTension,
  onChoiceVisible,
  onSkipScene,
  isRendering,
  renderProgress,
  renderStyle,
  onSelectRenderStyle,
  activeNode,
  activeLineId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volLevel, setVolLevel] = useState(80);
  const [analyserValues, setAnalyserValues] = useState<number[]>(new Array(16).fill(10));
  
  // Real-time photorealistic human images preloader cache
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});

  // Handle window resizing or element dimension change for canvas
  const [dimensions, setDimensions] = useState({ width: 640, height: 360 });

  // Preload realistic human scene photos in background
  useEffect(() => {
    const seeds = Object.keys(SEED_PHOTO_URLS);
    seeds.forEach((seed) => {
      if (loadedImages[seed]) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer'; // strict guideline standard constraint
      img.src = SEED_PHOTO_URLS[seed];
      img.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [seed]: img }));
      };
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        // Maintain 16:9 ratio in bounding box
        const targetWidth = width;
        const targetHeight = (width * 9) / 16;
        setDimensions({ width: Math.max(targetWidth, 240), height: Math.max(targetHeight, 135) });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update sound visualizer rates
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      const updateData = () => {
        const data = getAudioAnalyserData();
        const simplified = Array.from(data).slice(0, 16);
        setAnalyserValues(simplified);
        timer = requestAnimationFrame(updateData);
      };
      timer = requestAnimationFrame(updateData);
    } else {
      setAnalyserValues(new Array(16).fill(2).map(() => Math.floor(Math.random() * 4 + 2)));
    }
    return () => cancelAnimationFrame(timer);
  }, [isPlaying]);

  // Main Canvas procedural graphic compilation looping
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const realCtx = canvas.getContext('2d');
    if (!realCtx) return;

    let localFrame = 0;

    const render = () => {
      localFrame++;
      
      const isPixelStyle = renderStyle === 'pixel';
      const isSketchStyle = renderStyle === 'sketch';
      const isAnimeStyle = renderStyle === 'anime';

      // Setup dynamic dimensions
      let w = dimensions.width;
      let h = dimensions.height;

      // Conditional Offscreen canvas for Retro Pixel Art Shader Blitting
      let offscreenCanvas: HTMLCanvasElement | null = null;
      let activeCtx = realCtx;

      if (isPixelStyle) {
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = Math.max(80, Math.floor(dimensions.width / 4));
        offscreenCanvas.height = Math.max(45, Math.floor(dimensions.height / 4));
        const oCtx = offscreenCanvas.getContext('2d');
        if (oCtx) {
          activeCtx = oCtx;
          w = offscreenCanvas.width;
          h = offscreenCanvas.height;
        }
      }

      // Re-assign local draw context
      const ctx = activeCtx;

      // Clear Context
      ctx.clearRect(0, 0, w, h);

      // Save Context initial State
      ctx.save();

      // Set photographic / cartoon rendering styles helper with Cinematic 35mm Emulation
      const setDOF = (layer: 'background' | 'midground' | 'foreground' | 'closeup') => {
        if (renderStyle !== 'realistic') {
          if (isSketchStyle) {
            ctx.filter = 'grayscale(100%) contrast(140%) brightness(105%)';
          } else if (isAnimeStyle) {
            ctx.filter = 'saturate(190%) contrast(115%) brightness(105%)';
          } else {
            ctx.filter = 'none';
          }
          return;
        }

        // Base 35mm film stock response curve curves (shadow-faded scan matte look + contrast)
        let filmFilter = 'contrast(106%) saturate(104%) brightness(96%)';

        // Set LUT color profiles
        switch (directorSettings.colorGrading) {
          case 'neon-cyber':
            filmFilter += ' hue-rotate(-4deg) saturate(118%) contrast(110%)';
            break;
          case 'teal-orange':
            filmFilter += ' contrast(115%) saturate(108%) brightness(97%)';
            break;
          case 'vintage-sepia':
            filmFilter += ' sepia(30%) contrast(98%) brightness(102%)';
            break;
          case 'obsidian-black':
            filmFilter += ' grayscale(100%) contrast(135%) brightness(92%)';
            break;
          case 'emerald-fog':
            filmFilter += ' hue-rotate(14deg) saturate(95%) contrast(104%)';
            break;
        }

        // Depth-of-Field lens blur setting
        if (layer === 'background') {
          ctx.filter = `blur(4.5px) ${filmFilter}`;
        } else if (layer === 'midground') {
          ctx.filter = `blur(2.2px) ${filmFilter}`;
        } else if (layer === 'closeup') {
          ctx.filter = `blur(4px) ${filmFilter}`;
        } else {
          ctx.filter = filmFilter; // Focal plane is pin sharp
        }
      };

      // Initialize with background depth setting
      setDOF('background');

      // Color Palette styles based on active color grading
      let bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      let textAccent = directorSettings.colorGrading === 'neon-cyber' ? '#ec4899' : '#06b6d4';
      let mainFeatureColor = '#ffffff';

      switch (directorSettings.colorGrading) {
        case 'neon-cyber':
          bgGrad.addColorStop(0, '#090514');
          bgGrad.addColorStop(1, '#1b021a');
          textAccent = '#ec4899';
          mainFeatureColor = '#22d3ee';
          break;
        case 'obsidian-black':
          bgGrad.addColorStop(0, '#111827');
          bgGrad.addColorStop(1, '#030712');
          textAccent = '#9ca3af';
          mainFeatureColor = '#f3f4f6';
          break;
        case 'teal-orange':
          bgGrad.addColorStop(0, '#021e25');
          bgGrad.addColorStop(1, '#2c1404');
          textAccent = '#f97316';
          mainFeatureColor = '#22d3ee';
          break;
        case 'vintage-sepia':
          bgGrad.addColorStop(0, '#362a1d');
          bgGrad.addColorStop(1, '#1a120b');
          textAccent = '#b45309';
          mainFeatureColor = '#fed7aa';
          break;
        case 'emerald-fog':
          bgGrad.addColorStop(0, '#022c22');
          bgGrad.addColorStop(1, '#052e16');
          textAccent = '#10b981';
          mainFeatureColor = '#a7f3d0';
          break;
      }

      if (isSketchStyle) {
        // Pencil sketch paper background
        ctx.fillStyle = '#f5f2eb';
        ctx.fillRect(0, 0, w, h);
        
        // Draw sketchy paper grain/grid lines
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 15) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, h);
          ctx.stroke();
        }

        textAccent = '#3f3f46';
        mainFeatureColor = '#27272a';
      } else {
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Apply camera angle zoom modifiers
      ctx.translate(w / 2, h / 2);
      let scaleFactor = 1.0;
      if (directorSettings.cameraAngle === 'close-up') {
        scaleFactor = 1.45;
      } else if (directorSettings.cameraAngle === 'panoramic') {
        scaleFactor = 0.75;
      } else if (directorSettings.cameraAngle === 'low-angle') {
        scaleFactor = 1.1;
      } else if (directorSettings.cameraAngle === 'dolly-zoom') {
        // Pulse zoom with local frames as simulation
        scaleFactor = 1.0 + Math.sin(localFrame * 0.05) * 0.15;
      }
      ctx.scale(scaleFactor, scaleFactor);
      ctx.translate(-w / 2, -h / 2);

      const hasRealisticBg = renderStyle === 'realistic' && !!loadedImages[graphicSeed];
      const showIllustrations = !hasRealisticBg;

      // Draw realistic background under active camera properties
      if (hasRealisticBg) {
        ctx.save();
        setDOF('background');
        const img = loadedImages[graphicSeed];
        const imgRatio = img.width / img.height;
        const canvasRatio = w / h;
        let drawW = w;
        let drawH = h;
        let dx = 0;
        let dy = 0;

        if (imgRatio > canvasRatio) {
          drawW = h * imgRatio;
          dx = (w - drawW) / 2;
        } else {
          drawH = w / imgRatio;
          dy = (h - drawH) / 2;
        }

        ctx.drawImage(img, dx, dy, drawW, drawH);
        ctx.restore();
      }

      // PROCEDURAL CINEMATIC LAYER COMPOSITIONS
      if (mode === 'cyberpunk') {
        const groundY = h * 0.55;
        const groundH = h - groundY;

        if (showIllustrations) {
          // Deep atmosphere background fog
          setDOF('background');
          const backFog = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, Math.max(w, h));
          backFog.addColorStop(0, '#100720');
          backFog.addColorStop(0.5, '#070212');
          backFog.addColorStop(1, '#020005');
          ctx.fillStyle = backFog;
          ctx.fillRect(0, 0, w, h);

          // Towering cyber skyscrapers in background (Distant / Blurry due to Depth-of-Field)
          const towerCount = 6;
          for (let i = towerCount - 1; i >= 0; i--) {
            const tW = w * 0.18 + Math.sin(i * 12) * 20;
            const tH = h * 0.7 + Math.sin(i * 15) * 40;
            const tX = (w / (towerCount - 1)) * i - 20;
            const tY = h - tH;

            // Building base silhouette (blurry dark blue/pink)
            ctx.fillStyle = i % 2 === 0 ? '#0a0212' : '#040108';
            ctx.fillRect(tX, tY, tW, tH);

            // Out-of-Focus glowing cyberpunk windows (Bokeh dots)
            const columns = 5;
            const rows = 12;
            const spacingX = tW / (columns + 1);
            const spacingY = tH / (rows + 1);

            for (let col = 1; col <= columns; col++) {
              for (let row = 1; row <= rows; row++) {
                if (Math.sin(col * 31 + row * 47) > -0.1) {
                  const wx = tX + col * spacingX;
                  const wy = tY + row * spacingY;
                  const wColor = Math.sin(col + row) > 0 ? '#ec4899' : '#06b6d4';
                  
                  // Draw soft out-of-focus circle (bokeh)
                  const bokehGrad = ctx.createRadialGradient(wx, wy, 0.2, wx, wy, 4);
                  bokehGrad.addColorStop(0, wColor);
                  bokehGrad.addColorStop(0.3, `${wColor}99`);
                  bokehGrad.addColorStop(1, 'transparent');
                  ctx.fillStyle = bokehGrad;
                  ctx.beginPath();
                  ctx.arc(wx, wy, 4, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
          }

          // Wet wet concrete floor reflection plane (Y >= h * 0.55)
          setDOF('midground');
          const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
          floorGrad.addColorStop(0, '#020106');
          floorGrad.addColorStop(1, '#0c0617');
          ctx.fillStyle = floorGrad;
          ctx.fillRect(0, groundY, w, groundH);
        } else {
          // Draw subtle wet sheen over realistic photo
          setDOF('midground');
          const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
          floorGrad.addColorStop(0, 'rgba(2, 1, 6, 0.2)');
          floorGrad.addColorStop(1, 'rgba(12, 6, 23, 0.5)');
          ctx.fillStyle = floorGrad;
          ctx.fillRect(0, groundY, w, groundH);
        }

        // Diffuse light reflections (vertical gloss streaks) on the wet concrete floor
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let r = 0; r < 5; r++) {
          const rx = (w * 0.2) + r * (w * 0.16) + Math.sin(localFrame * 0.002 + r) * 15;
          const rColor = r % 2 === 0 ? '#ec4899' : '#06b6d4';
          const rLg = ctx.createLinearGradient(rx - 20, groundY, rx + 20, h);
          rLg.addColorStop(0, `${rColor}55`);
          rLg.addColorStop(0.4, `${rColor}22`);
          rLg.addColorStop(1, 'transparent');
          ctx.fillStyle = rLg;
          ctx.fillRect(rx - 30, groundY, 60, groundH);
        }
        ctx.restore();

        // Realistic angled rain drops & road splash circles
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.0;
        const rainCount = 40;
        for (let r = 0; r < rainCount; r++) {
          const rx = (r * 1234 + localFrame * 6) % (w + 100) - 50;
          const ry = (localFrame * 14 + r * 50) % h;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 3, ry + 15);
          ctx.stroke();

          // If rain hits the road, draw small ripple splash
          if (ry > groundY && r % 4 === 0) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * ((ry - groundY)/groundH)})`;
            ctx.beginPath();
            ctx.ellipse(rx, ry, 6, 2, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        if (showIllustrations) {
          // Beautiful portrait photography character silhouette (Kane / Vandal)
          setDOF('foreground');
          ctx.save();
          ctx.fillStyle = '#010003';
          const charX = w * 0.45;
          const charY = h * 0.43;

          // Torso/Shoulders with soft rim backlight
          ctx.beginPath();
          ctx.moveTo(charX - 45, h);
          ctx.bezierCurveTo(charX - 40, charY + 50, charX - 15, charY + 30, charX - 10, charY + 15);
          ctx.lineTo(charX + 15, charY + 15);
          ctx.bezierCurveTo(charX + 20, charY + 30, charX + 50, charY + 50, charX + 55, h);
          ctx.closePath();
          ctx.fill();

          // Hair & head silhouette
          ctx.beginPath();
          ctx.arc(charX, charY, 20, 0, Math.PI * 2);
          ctx.fill();
          // Hair dynamic points
          ctx.beginPath();
          ctx.arc(charX - 6, charY - 14, 12, 0, Math.PI * 2);
          ctx.fill();

          // High gloss neon glass eye reflection (glowing cyber glasses visor)
          ctx.fillStyle = '#ec4899';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 18;
          ctx.fillRect(charX - 12, charY - 2, 24, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(charX - 4, charY - 1.5, 8, 2);

          // Soft pink rim-lighting on the character's hair and clothing (subtle bokeh glows)
          ctx.restore();
        }

        // Photographic Anamorphic Flare on the primary light source (top right headlight)
        const flareX = w * 0.72;
        const flareY = h * 0.32;
        
        // Render 35mm Film Halation (analog scatter orange/red ring) around extreme highlights
        if (renderStyle === 'realistic') {
          const halation = ctx.createRadialGradient(flareX, flareY, 10, flareX, flareY, 32);
          halation.addColorStop(0, 'rgba(239, 68, 68, 0.45)'); // Intense red core
          halation.addColorStop(0.4, 'rgba(249, 115, 22, 0.20)'); // Film halation border
          halation.addColorStop(1, 'transparent');
          ctx.fillStyle = halation;
          ctx.beginPath();
          ctx.arc(flareX, flareY, 32, 0, Math.PI * 2);
          ctx.fill();
        }

        // Headlight source
        setDOF('midground');
        const bulb = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 15);
        bulb.addColorStop(0, '#ffffff');
        bulb.addColorStop(0.3, '#06b6d4');
        bulb.addColorStop(1, 'transparent');
        ctx.fillStyle = bulb;
        ctx.beginPath();
        ctx.arc(flareX, flareY, 15, 0, Math.PI * 2);
        ctx.fill();

        // Anamorphic horizontal light ray across screen (cyan)
        const flareGrad = ctx.createLinearGradient(0, flareY, w, flareY);
        flareGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        flareGrad.addColorStop(0.4, 'rgba(6, 182, 212, 0.45)');
        flareGrad.addColorStop(0.5, '#ffffff');
        flareGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.45)');
        flareGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = flareGrad;
        ctx.fillRect(0, flareY - 1.5, w, 3);

        const coreHaze = ctx.createRadialGradient(flareX, flareY, 5, flareX, flareY, w * 0.4);
        coreHaze.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
        coreHaze.addColorStop(1, 'transparent');
        ctx.fillStyle = coreHaze;
        ctx.beginPath();
        ctx.arc(flareX, flareY, w * 0.4, 0, Math.PI * 2);
        ctx.fill();

      } else if (mode === 'scifi') {
        if (showIllustrations) {
          // Deep space cosmic background
          setDOF('background');
          ctx.fillStyle = '#010103';
          ctx.fillRect(0, 0, w, h);
        }

        // Sub-pixel star densities & colored stars (elegant to keep twinkling in the background)
        const maxStars = 60;
        for (let i = 0; i < maxStars; i++) {
          const starX = (Math.sin(i * 1234.5) * 0.5 + 0.5) * w;
          const starY = (Math.cos(i * 5432.1) * 0.5 + 0.5) * h;
          // Slowly twinkle
          const sAlpha = 0.2 + (Math.sin(localFrame * 0.015 + i) * 0.5 + 0.5) * 0.8;
          ctx.fillStyle = i % 4 === 0 ? `rgba(165,180,252,${sAlpha})` : i % 5 === 0 ? `rgba(253,186,116,${sAlpha})` : `rgba(255,255,255,${sAlpha})`;
          const sSize = i % 10 === 0 ? 1.5 : 0.8;
          ctx.fillRect(starX, starY, sSize, sSize);

          // Star diffraction spikes for the very brightest stars
          if (i % 25 === 0) {
            ctx.strokeStyle = `rgba(255,255,255,${sAlpha * 0.4})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(starX - 8, starY); ctx.lineTo(starX + 8, starY);
            ctx.moveTo(starX, starY - 8); ctx.lineTo(starX, starY + 8);
            ctx.stroke();
          }
        }

        if (showIllustrations) {
          // Multi-colored gas nebula cloud layer (Simulates real space photography backlighting)
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          
          // Purple Nebula
          const nebP = ctx.createRadialGradient(w * 0.3, h * 0.4, 5, w * 0.35, h * 0.35, w * 0.45);
          nebP.addColorStop(0, 'rgba(139, 92, 246, 0.16)');
          nebP.addColorStop(0.5, 'rgba(139, 92, 246, 0.05)');
          nebP.addColorStop(1, 'transparent');
          ctx.fillStyle = nebP;
          ctx.beginPath();
          ctx.arc(w * 0.3, h * 0.4, w * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Cyan Nebula
          const nebC = ctx.createRadialGradient(w * 0.7, h * 0.5, 10, w * 0.65, h * 0.45, w * 0.4);
          nebC.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
          nebC.addColorStop(0.6, 'rgba(6, 182, 212, 0.03)');
          nebC.addColorStop(1, 'transparent');
          ctx.fillStyle = nebC;
          ctx.beginPath();
          ctx.arc(w * 0.7, h * 0.5, w * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Colossal gas-giant planet horizon with photorealistic terminator shadow
          setDOF('midground');
          const planetX = w * 0.68;
          const planetY = h * 0.48;
          const planetR = Math.min(w, h) * 0.35;

          // Apply 35mm film red-shifted Rayleigh halation scattering around extreme bright horizon
          if (renderStyle === 'realistic') {
            const limbHalation = ctx.createRadialGradient(planetX - planetR * 0.25, planetY - planetR * 0.25, planetR * 0.85, planetX - planetR * 0.25, planetY - planetR * 0.25, planetR * 1.15);
            limbHalation.addColorStop(0, 'transparent');
            limbHalation.addColorStop(0.4, 'rgba(239, 68, 68, 0.12)'); // deep red atmospheric glow
            limbHalation.addColorStop(0.8, 'rgba(249, 115, 22, 0.04)'); // orange halo scatter
            limbHalation.addColorStop(1, 'transparent');
            ctx.fillStyle = limbHalation;
            ctx.beginPath();
            ctx.arc(planetX, planetY, planetR * 1.15, 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw Atmosphere edge ring Rayleigh scattering glow (rim glow)
          const rimGlow = ctx.createRadialGradient(planetX, planetY, planetR - 4, planetX, planetY, planetR + 15);
          rimGlow.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
          rimGlow.addColorStop(0.3, 'rgba(139, 92, 246, 0.15)');
          rimGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = rimGlow;
          ctx.beginPath();
          ctx.arc(planetX, planetY, planetR + 15, 0, Math.PI * 2);
          ctx.fill();

          // Draw planet body with volumetric shading gradient (Day-to-Night transition)
          const terminator = ctx.createRadialGradient(planetX - planetR * 0.25, planetY - planetR * 0.25, planetR * 0.1, planetX, planetY, planetR);
          terminator.addColorStop(0, '#fdf4ff'); // Sun side
          terminator.addColorStop(0.45, '#a5f3fc'); // Transition
          terminator.addColorStop(0.8, '#0e0b1f'); // Shadow terminator line
          terminator.addColorStop(1, '#020106'); // Pure dark side
          ctx.fillStyle = terminator;
          ctx.beginPath();
          ctx.arc(planetX, planetY, planetR, 0, Math.PI * 2);
          ctx.fill();

          // Soft procedural gas ring bands wrapping around planet body
          ctx.save();
          ctx.translate(planetX, planetY);
          ctx.rotate(-Math.PI / 10);
          ctx.scale(2.2, 0.22);
          
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.14)';
          ctx.lineWidth = 14;
          ctx.beginPath();
          ctx.arc(0, 0, planetR * 1.25, 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(0, 0, planetR * 1.45, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        if (showIllustrations) {
          // Forefront cockpit command console / window frame (blurry closeup lens focus element)
          setDOF('closeup');
          ctx.fillStyle = '#010103';
          ctx.fillRect(0, h - 35, w, 35);
          // cockpit metal framework struts
          ctx.beginPath();
          ctx.moveTo(0, h);
          ctx.lineTo(w * 0.15, h - 35);
          ctx.lineTo(w * 0.18, h - 35);
          ctx.lineTo(0, h + 10);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(w, h);
          ctx.lineTo(w * 0.85, h - 35);
          ctx.lineTo(w * 0.82, h - 35);
          ctx.lineTo(w, h + 10);
          ctx.fill();

          // Subtly glowing red console light (camera focal focus light)
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(w * 0.17, h - 18, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (mode === 'darkfantasy') {
        if (showIllustrations) {
          // Gothic silver forest background
          setDOF('background');
          const fantasyBg = ctx.createLinearGradient(0, 0, 0, h);
          fantasyBg.addColorStop(0, '#04050a');
          fantasyBg.addColorStop(0.6, '#0f111a');
          fantasyBg.addColorStop(1, '#05060d');
          ctx.fillStyle = fantasyBg;
          ctx.fillRect(0, 0, w, h);

          // Huge Moon behind jagged ruins of a castle
          const moonX = w * 0.28;
          const moonY = h * 0.32;
          const silverMoon = ctx.createRadialGradient(moonX, moonY, 2, moonX, moonY, 70);
          silverMoon.addColorStop(0, '#ffffff');
          silverMoon.addColorStop(0.18, '#f1f5f9');
          silverMoon.addColorStop(0.5, 'rgba(241, 245, 249, 0.18)');
          silverMoon.addColorStop(1, 'transparent');
          ctx.fillStyle = silverMoon;
          ctx.beginPath();
          ctx.arc(moonX, moonY, 70, 0, Math.PI * 2);
          ctx.fill();

          // God rays passing across the ruins from the silver moon
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const rayGrad = ctx.createLinearGradient(moonX, moonY, w * 0.6, h);
          rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
          rayGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(moonX - 10, moonY - 10);
          ctx.lineTo(w * 0.1, h);
          ctx.lineTo(w * 0.85, h);
          ctx.lineTo(moonX + 10, moonY + 10);
          ctx.fill();
          ctx.restore();

          // Castle spires silhouettes overlapping the moon (gothic look)
          ctx.fillStyle = '#020306';
          ctx.beginPath();
          ctx.moveTo(w * 0.16, h * 0.8);
          ctx.lineTo(w * 0.16, h * 0.25);
          ctx.lineTo(w * 0.2, h * 0.15);
          ctx.lineTo(w * 0.24, h * 0.25);
          ctx.lineTo(w * 0.24, h * 0.8);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(w * 0.22, h * 0.8);
          ctx.lineTo(w * 0.22, h * 0.38);
          ctx.lineTo(w * 0.25, h * 0.32);
          ctx.lineTo(w * 0.28, h * 0.38);
          ctx.lineTo(w * 0.28, h * 0.8);
          ctx.fill();
        }

        // Drift fog layer (volumetric atmosphere mist - beautiful to keep over photos)
        setDOF('midground');
        const mistGrad = ctx.createLinearGradient(0, h * 0.5, 0, h);
        mistGrad.addColorStop(0, 'transparent');
        mistGrad.addColorStop(0.7, 'rgba(15, 17, 26, 0.45)');
        mistGrad.addColorStop(1, 'rgba(5, 6, 13, 0.7)');
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, h * 0.5, w, h * 0.5);

        const kX = w * 0.62;
        const kY = h * 0.45;

        if (showIllustrations) {
          // Foreground knight warrior silhouette with hot red magical sword
          setDOF('foreground');
          ctx.save();

          ctx.fillStyle = '#010103';
          // Legs & Ground base
          ctx.fillRect(kX - 35, h - 30, 70, 30);
          // Torso armor plate outline
          ctx.beginPath();
          ctx.moveTo(kX - 25, h - 25);
          ctx.lineTo(kX - 15, kY + 10);
          ctx.lineTo(kX + 15, kY + 10);
          ctx.lineTo(kX + 25, h - 25);
          ctx.closePath();
          ctx.fill();

          // Helmet/Head outline
          ctx.beginPath();
          ctx.arc(kX, kY, 14, 0, Math.PI * 2);
          ctx.fill();

          // Fiery greatsword sword casting physical warm orange light grads
          ctx.save();
          ctx.translate(kX - 15, kY + 10);
          ctx.rotate(-Math.PI / 3.5 + Math.sin(localFrame * 0.02) * 0.02);
          
          // Render 35mm film halation (magical sword extreme heat scatter)
          if (renderStyle === 'realistic') {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
            ctx.fillRect(-14, -84, 28, 105);
          }

          // Sword blade red heat core glow
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 24;
          ctx.fillRect(-3, -75, 6, 90);

          // Bright silver sword core
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-1, -70, 2, 85);

          // Crossguard hilt
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-10, 10, 20, 3.5);
          ctx.restore();
          ctx.restore();
        } else {
          // Render isolated ambient fiery greatsword casting warmth over photo knight
          ctx.save();
          setDOF('foreground');
          ctx.translate(kX + 10, kY + 25);
          ctx.rotate(-Math.PI / 4.2 + Math.sin(localFrame * 0.02) * 0.01);

          // Heat scatter halo
          const swordHalation = ctx.createRadialGradient(0, -35, 10, 0, -35, 65);
          swordHalation.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
          swordHalation.addColorStop(0.6, 'rgba(249, 115, 22, 0.08)');
          swordHalation.addColorStop(1, 'transparent');
          ctx.fillStyle = swordHalation;
          ctx.beginPath();
          ctx.arc(0, -35, 65, 0, Math.PI * 2);
          ctx.fill();

          // Core blade red heat
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-2, -45, 4, 60);
          ctx.restore();
        }

        // Magical fire ember sparks escaping upwards
        ctx.save();
        for (let i = 0; i < 16; i++) {
          const ex = kX - 30 + (Math.sin(i * 92.2 + localFrame * 0.015) * 50);
          const ey = h - ((localFrame * 1.5 + i * 35) % (h * 0.65));
          const eSize = 1.2 + Math.abs(Math.sin(i)) * 2;
          const sparkGlow = ctx.createRadialGradient(ex, ey, 0, ex, ey, eSize * 2.5);
          sparkGlow.addColorStop(0, '#f97316');
          sparkGlow.addColorStop(0.4, 'rgba(239,68,68,0.7)');
          sparkGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = sparkGlow;
          ctx.beginPath();
          ctx.arc(ex, ey, eSize * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

      } else if (mode === 'noir') {
        if (showIllustrations) {
          // High-contrast 1940s film-monochrome look
          setDOF('background');
          const noirBg = ctx.createLinearGradient(0, 0, 0, h);
          noirBg.addColorStop(0, '#0e0f11');
          noirBg.addColorStop(0.5, '#070809');
          noirBg.addColorStop(1, '#020202');
          ctx.fillStyle = noirBg;
          ctx.fillRect(0, 0, w, h);
        }

        // Blinds Gobo shadow casting overlay across the entire scene (simulates light streaming inside - KEEP!)
        ctx.save();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 14;
        const blindAngle = -Math.PI / 10;
        ctx.rotate(blindAngle);
        for (let y = -h * 0.5; y < h * 1.5; y += 38) {
          ctx.beginPath();
          ctx.moveTo(-w * 0.5, y);
          ctx.lineTo(w * 1.5, y);
          ctx.stroke();
        }
        ctx.restore();

        // Flickering vintage gas-discharge lamppost (Warm yellow photo cone)
        setDOF('midground');
        const lampX = w * 0.70;
        const lampY = h * 0.38;
        const noiseFlicker = Math.random() > 0.05 ? 1.0 : 0.3;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const beamLight = ctx.createLinearGradient(lampX, lampY, lampX - 20, h);
        beamLight.addColorStop(0, `rgba(254, 215, 170, ${0.45 * noiseFlicker})`);
        beamLight.addColorStop(0.4, `rgba(212, 163, 115, ${0.18 * noiseFlicker})`);
        beamLight.addColorStop(1, 'transparent');
        ctx.fillStyle = beamLight;

        // Draw geometric volumetric 3D light beam
        ctx.beginPath();
        ctx.moveTo(lampX - 6, lampY);
        ctx.lineTo(lampX - w * 0.28, h);
        ctx.lineTo(lampX + w * 0.18, h);
        ctx.lineTo(lampX + 6, lampY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Illuminated dust motes twinkling in the lamppost light cone
        ctx.fillStyle = `rgba(255, 230, 200, ${0.45 * noiseFlicker})`;
        for (let i = 0; i < 14; i++) {
          const dx = lampX - w * 0.15 + (Math.sin(i * 14.5 + localFrame * 0.005) * 60);
          const dy = lampY + (i * 16 + localFrame * 0.4) % (h - lampY);
          if (Math.abs(dx - lampX) < (dy - lampY) * 0.35) {
            ctx.fillRect(dx, dy, 1, 1);
          }
        }

        // Apply 35mm warm red Halation scatter on the lamppost bulb glow
        if (renderStyle === 'realistic') {
          const lampHala = ctx.createRadialGradient(lampX, lampY, 3, lampX, lampY, 20);
          lampHala.addColorStop(0, 'rgba(239, 68, 68, 0.55)'); // rich film center scatter
          lampHala.addColorStop(0.5, 'rgba(253, 186, 116, 0.20)'); // amber bloom perimeter
          lampHala.addColorStop(1, 'transparent');
          ctx.fillStyle = lampHala;
          ctx.beginPath();
          ctx.arc(lampX, lampY, 20, 0, Math.PI * 2);
          ctx.fill();
        }

        // Physical cast iron lamppost structure
        ctx.strokeStyle = '#020202';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(lampX, h);
        ctx.lineTo(lampX, lampY);
        ctx.stroke();
        // Glass bulb cover
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(lampX, lampY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Wet cobblestone floor reflection under the lamppost
        ctx.save();
        ctx.globalCompositeOperation = 'lighten';
        const reflection = ctx.createLinearGradient(lampX - 30, h - 30, lampX + 30, h);
        reflection.addColorStop(0, `rgba(254, 215, 170, ${0.35 * noiseFlicker})`);
        reflection.addColorStop(0.5, 'rgba(100,100,100,0.08)');
        reflection.addColorStop(1, 'transparent');
        ctx.fillStyle = reflection;
        ctx.fillRect(lampX - w * 0.25, h - 35, w * 0.4, 35);
        ctx.restore();

        const dX = w * 0.32;
        const dY = h * 0.48;

        if (showIllustrations) {
          // Private Eye Detective silhouette profile (Fedora and Trench Coat)
          setDOF('foreground');
          ctx.save();

          ctx.fillStyle = '#010101';
          // Silhouette Coat
          ctx.beginPath();
          ctx.moveTo(dX - 25, h);
          ctx.bezierCurveTo(dX - 20, dY + 45, dX - 10, dY + 30, dX - 8, dY + 16);
          ctx.lineTo(dX + 15, dY + 16);
          ctx.bezierCurveTo(dX + 18, dY + 30, dX + 28, dY + 45, dX + 35, h);
          ctx.closePath();
          ctx.fill();

          // Head shape
          ctx.beginPath();
          ctx.arc(dX, dY, 15, 0, Math.PI * 2);
          ctx.fill();

          // Trench Coat collar sharp lines
          ctx.beginPath();
          ctx.moveTo(dX - 10, dY + 16);
          ctx.lineTo(dX - 14, dY + 24);
          ctx.lineTo(dX - 4, dY + 22);
          ctx.closePath();
          ctx.fill();

          // Fedora Hat brim
          ctx.fillRect(dX - 24, dY - 8, 48, 3.5);
          // Hat top crown
          ctx.fillRect(dX - 14, dY - 18, 28, 10.5);
          ctx.restore();
        }

        // Highly vivid glowing cigarette tip with beautiful 35mm film halation
        const cigX = dX + 6;
        const cigY = dY + 5;
        
        ctx.save();
        if (renderStyle === 'realistic') {
          const cigHala = ctx.createRadialGradient(cigX, cigY, 1, cigX, cigY, 8);
          cigHala.addColorStop(0, 'rgba(239, 68, 68, 0.65)'); // Hot red core
          cigHala.addColorStop(0.4, 'rgba(249, 115, 22, 0.30)'); // Amber halation
          cigHala.addColorStop(1, 'transparent');
          ctx.fillStyle = cigHala;
          ctx.beginPath();
          ctx.arc(cigX, cigY, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cigX, cigY, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Delicately floating photographic cigarette smoke (using a fine sine-wave path)
        ctx.strokeStyle = 'rgba(230, 230, 235, 0.12)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let sy = dY - 40; sy <= dY + 2; sy += 2) {
          const sx = cigX + Math.sin((sy - localFrame) * 0.08) * 4;
          if (sy === dY + 2) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.stroke();
      }

      // Restore camera zoom context
      ctx.restore();

      // Cinematic 35mm Lens Vignette Light Falloff (Corner shading)
      if (renderStyle === 'realistic') {
        const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.78);
        vignette.addColorStop(0, 'transparent');
        vignette.addColorStop(0.55, 'rgba(0, 0, 0, 0.12)'); // Soft edge falloff
        vignette.addColorStop(1, 'rgba(0, 0, 0, 0.65)');   // Deep lens corner block
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, w, h);
      }

      // ALWAYS DRAW VIEWPORT METADATA INFRASTRUCTURE
      // Viewfinder Reticle / Safe Box borders
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // Four corner brackets
      const cp = 15; // bracket length
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;

      // Top-left
      ctx.beginPath(); ctx.moveTo(20 + cp, 20); ctx.lineTo(20, 20); ctx.lineTo(20, 20 + cp); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(w - 20 - cp, 20); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20, 20 + cp); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(20 + cp, h - 20); ctx.lineTo(20, h - 20); ctx.lineTo(20, h - 20 - cp); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(w - 20 - cp, h - 20); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20, h - 20 - cp); ctx.stroke();

      // Center crosshair
      ctx.beginPath();
      ctx.moveTo(w / 2 - 8, h / 2); ctx.lineTo(w / 2 + 8, h / 2);
      ctx.moveTo(w / 2, h / 2 - 8); ctx.lineTo(w / 2, h / 2 + 8);
      ctx.stroke();

      // Film Grain simulation overlay overlay layer
      if (directorSettings.grainIntensity > 0) {
        if (renderStyle === 'realistic') {
          // Stochastic Silver Halide clump simulation dependant on luminance
          // True 35mm grain has a dual-layer structure (couplers + halides)
          const baseCount = Math.floor((directorSettings.grainIntensity / 100) * 4800);
          
          ctx.save();
          for (let g = 0; g < baseCount; g++) {
            const gx = Math.random() * w;
            const gy = Math.random() * h;
            
            // Grain clumps slightly random size
            const size = Math.random() * 1.5 + 0.6;
            
            // Luminescence dependent visibility: film grain is most organic and visible in midtones
            const opacity = (Math.random() * 0.05 + 0.02) * (directorSettings.grainIntensity / 15);
            
            // Draw light grain silver salts
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
            ctx.fillRect(gx, gy, size, size);
            
            // Draw dark coupling dyes adjacent
            if (Math.random() > 0.45) {
              ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 1.1})`;
              ctx.fillRect(gx + (Math.random() - 0.5) * 1.2, gy + (Math.random() - 0.5) * 1.2, size * 0.9, size * 0.9);
            }
          }
          ctx.restore();
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          const grainCount = (directorSettings.grainIntensity / 100) * 1200;
          for (let g = 0; g < grainCount; g++) {
            const gx = Math.random() * w;
            const gy = Math.random() * h;
            const gsz = Math.random() * 1.5 + 0.5;
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
            ctx.fillRect(gx, gy, gsz, gsz);
          }
        }
      }

      // Add "REC" overlay symbol flashing
      if (isPlaying && Math.floor(localFrame / 30) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(45, 45, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '10px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText("REC", 56, 49);
      }

      // Timecode overlay display
      ctx.font = '11px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      const rawSecs = Math.floor((progressPercent / 100) * 45);
      const minStr = String(Math.floor(rawSecs / 60)).padStart(2, '0');
      const secStr = String(rawSecs % 60).padStart(2, '0');
      const frameIndex = String(localFrame % 24).padStart(2, '0');
      ctx.fillText(`TC: 00:${minStr}:${secStr}:${frameIndex}`, w - 150, 48);

      // Director tag metadata
      ctx.fillText(`CAM: ${directorSettings.cameraAngle.toUpperCase()}`, 45, h - 45);
      ctx.fillText(`LUT: ${directorSettings.colorGrading.toUpperCase()}`, 45, h - 30);

      // Rendering progress overlay
      if (isRendering) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
        ctx.fillRect(0, 0, w, h);

        // Core compilation matrix effect
        ctx.fillStyle = `${textAccent}55`;
        ctx.font = '9px monospace';
        for (let r = 0; r < 6; r++) {
          ctx.fillText(`MATRIX_SHADERS_RESOLVING: [SEED_${graphicSeed}]`, 30, 45 + r * 14);
          ctx.fillText(`DE-NOISING KERNEL PASS [SAMPLES: ${Math.floor(renderProgress * 1.28)}] ... OK`, 30, 130 + r * 14);
        }

        // Render progress bar
        ctx.strokeStyle = textAccent;
        ctx.strokeRect(w * 0.2, h / 2 + 10, w * 0.6, 20);
        ctx.fillStyle = textAccent;
        ctx.fillRect(w * 0.2 + 2, h / 2 + 12, (w * 0.6 - 4) * (renderProgress / 100), 16);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`COMPILING HIGH-FIDELITY FILTERS: ${Math.round(renderProgress)}%`, w / 2, h / 2 - 10);
        ctx.textAlign = 'left';
      }

      if (isPixelStyle && offscreenCanvas) {
        realCtx.imageSmoothingEnabled = false;
        (realCtx as any).mozImageSmoothingEnabled = false;
        (realCtx as any).webkitImageSmoothingEnabled = false;
        (realCtx as any).msImageSmoothingEnabled = false;
        
        realCtx.clearRect(0, 0, dimensions.width, dimensions.height);
        realCtx.drawImage(offscreenCanvas, 0, 0, dimensions.width, dimensions.height);
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    // Initial render
    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, mode, directorSettings, progressPercent, isPlaying, isRendering, renderProgress, graphicSeed, renderStyle, activeNode, activeLineId]);

  // Handle play-pause click
  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Skip video forward
  const handleForward = () => {
    setProgressPercent(Math.min(progressPercent + 10, 100));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgressPercent(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div id="cinema-stage-monitor" className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between shadow-2xl h-full">
      {/* Upper header statistics */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-300">STUDIO MONITOR A (LIVE VIEW)</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>LIVE</span>
          <span className="text-slate-400">RESOLUTION: <strong className="text-emerald-400">2K CINEMATIC</strong></span>
          <span className="text-slate-400">TENSION: <strong className="text-rose-400">{Math.round(scoreTension)}%</strong></span>
        </div>
      </div>

      {/* Render Style Selection bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2 rounded border border-slate-800 mb-3 text-xs">
        <span className="text-[10px] font-mono text-slate-400 tracking-wider">VIDEO RENDERING ENGINE STYLE:</span>
        <div className="flex gap-1 items-center">
          {(['realistic', 'anime', 'pixel', 'sketch'] as const).map((style) => (
            <button
              key={style}
              onClick={() => onSelectRenderStyle(style)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-tight cursor-pointer uppercase transition-all ${
                renderStyle === style
                  ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {style === 'realistic' ? '🎬 cinematic 35mm' : style === 'anime' ? '✨ anime / graphics' : style === 'pixel' ? '🕹️ retro pixel' : '✏️ pencil sketch'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Screen Container */}
      <div 
        ref={containerRef} 
        className="relative bg-black rounded overflow-hidden flex items-center justify-center border border-slate-900 group"
        style={{ minHeight: '300px' }}
      >
        <canvas 
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="block max-w-full"
        />

        {/* Cinematic Black Letterbox Bars (Top and Bottom) */}
        <div className="absolute top-0 left-0 w-full h-[6%] bg-black opacity-90 border-b border-white/5 pointer-events-none transition-all duration-300 group-hover:h-[4%]"></div>
        <div className="absolute bottom-0 left-0 w-full h-[6%] bg-black opacity-90 border-t border-white/5 pointer-events-none transition-all duration-300 group-hover:h-[4%]"></div>

        {/* Watermark Overlay details */}
        <div className="absolute bottom-5 left-6 bg-black/70 backdrop-blur border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-slate-300 select-none hidden md:block">
          {mode.toUpperCase()} // DR_SEED_{graphicSeed.toUpperCase()}
        </div>

        {/* Screenplay Subtitle translation overlay synchronized directly */}
        {(() => {
          const activeLine = activeNode?.script.find((l) => l.id === activeLineId);
          return (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-[85%] bg-black/85 backdrop-blur-md px-4 py-2 rounded-md border border-white/10 shadow-2xl select-none transition-all duration-300">
              {activeLine ? (
                <>
                  {activeLine.type === 'dialogue' ? (
                    <>
                      <p className="text-[11px] text-amber-305 uppercase font-black tracking-widest mb-1 select-none flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        {activeLine.speaker}
                      </p>
                      <p className="text-xs text-slate-100 font-serif leading-relaxed px-2">
                        "{activeLine.text}"
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] font-mono font-bold tracking-widest text-[#f59e0b] uppercase mb-1 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#f59e0b] rounded-sm animate-pulse" />
                        SCRIPT ACTION / SCENE DIRECTIVE
                      </p>
                      <p className="text-[11px] text-slate-300 font-mono italic leading-relaxed px-2">
                        {activeLine.text}
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-[11px] text-rose-400 uppercase font-bold tracking-widest mb-1">
                    COMPILING SCENE
                  </p>
                  <p className="text-[11px] text-slate-304 font-mono">
                    "{nodeTitle || 'Rendering cinematic story elements...'}"
                  </p>
                </>
              )}
            </div>
          );
        })()}
      </div>

      {/* Synchronized timeline playback scrubbing slider controller */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] font-mono text-slate-500">00:00</span>
        <input 
          id="scrubber-timeline-bar"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progressPercent}
          onChange={handleSeek}
          className="flex-1 accent-rose-500 h-1 bg-slate-800 rounded-lg cursor-pointer focus:outline-none"
        />
        <span className="text-[10px] font-mono text-slate-500">00:45</span>
      </div>

      {/* Bottom Row of Player Control triggers & Visualizer */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-900 pt-3">
        <div className="flex items-center gap-2">
          {/* Play / pause */}
          <button 
            id="play-pause-btn"
            onClick={handleTogglePlay}
            disabled={isRendering}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-150 flex items-center gap-1.5 text-xs font-mono border ${
              isPlaying 
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20' 
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            {isPlaying ? "PAUSE FEED" : "PLAY VIEW"}
          </button>

          {/* Quick skip */}
          <button 
            id="ff-btn"
            onClick={handleForward}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all cursor-pointer"
            title="Fast Forward 10%"
          >
            <FastForward className="w-4 h-4" />
          </button>

          {/* Skip Scene Branch */}
          <button 
            id="skip-scene-btn"
            onClick={onSkipScene}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all cursor-pointer flex items-center gap-1 text-[11px] font-mono"
            title="Next Story Branch"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>SKIP BRANCH</span>
          </button>
        </div>

        {/* Real Dynamic Equalizer / Visualizer using active Web Audio analysis state */}
        <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded border border-slate-900 overflow-hidden w-full max-w-[200px]" title="Adaptive audio analyzer">
          <Radio className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <div className="flex items-end gap-[2px] h-6 flex-1 justify-center">
            {analyserValues.map((val, k) => (
              <span 
                key={k} 
                className="bg-rose-500 rounded-t-sm w-[4px] min-h-[2px] transition-all duration-75"
                style={{ 
                  height: `${Math.min(100, (val / 255) * 100)}%`,
                  opacity: 0.35 + (val / 255) * 0.65 
                }}
              />
            ))}
          </div>
        </div>

        {/* Volume & Full screen */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Volume2 className="w-4 h-4 shrink-0" />
            <input 
              id="volume-adjust-bar"
              type="range"
              min="0"
              max="100"
              value={volLevel}
              onChange={(e) => setVolLevel(parseInt(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg cursor-pointer accent-slate-400"
            />
          </div>
          <button 
            id="fullscreen-mode-btn"
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
