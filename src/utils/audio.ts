// Web Audio API Synthesizer and Interactive Soundscape Generator for CineDirector

let audioCtx: AudioContext | null = null;
let droneOsc: OscillatorNode | null = null;
let droneOscAlt: OscillatorNode | null = null;
let noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
let filterNode: BiquadFilterNode | null = null;
let mainGain: GainNode | null = null;
let droneGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let noiseGain: GainNode | null = null;
let analyserNode: AnalyserNode | null = null;

// Simple custom noise buffer generator
function createNoiseBuffer(ctx: AudioContext, color: 'pink' | 'white' | 'brown'): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; // for pink noise
  let lastOut = 0.0; // for brown noise

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (color === 'white') {
      data[i] = white;
    } else if (color === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; // estimate
      b6 = white * 0.115926;
    } else { // brown noise
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // compensation
    }
  }

  return buffer;
}

export function startAudioEngine(baseFreq: number, waveType: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'triangle') {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Set up Main Gain
    mainGain = audioCtx.createGain();
    mainGain.gain.setValueAtTime(0.12, audioCtx.currentTime); // Low safe default global volume

    // Analyser node for gorgeous visualizer feedback
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 64;

    mainGain.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    // Drone Gain
    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
    droneGain.connect(mainGain);

    // SFX Gain
    sfxGain = audioCtx.createGain();
    sfxGain.gain.setValueAtTime(0.9, audioCtx.currentTime);
    sfxGain.connect(mainGain);

    // Noise Gain
    noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    noiseGain.connect(mainGain);

    // Lowpass filter
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(400, audioCtx.currentTime);
    filterNode.Q.setValueAtTime(1.0, audioCtx.currentTime);
    filterNode.connect(droneGain);

    // Primary Low Drone Oscillator
    droneOsc = audioCtx.createOscillator();
    droneOsc.type = waveType;
    droneOsc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    droneOsc.connect(filterNode);
    droneOsc.start();

    // Detuned Alternative Drone
    droneOscAlt = audioCtx.createOscillator();
    droneOscAlt.type = 'sine';
    droneOscAlt.frequency.setValueAtTime(baseFreq * 1.503, audioCtx.currentTime); // Dynamic Fifth interval
    droneOscAlt.connect(filterNode);
    droneOscAlt.start();

    // Noise play to simulate hum / static environment rain
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = createNoiseBuffer(audioCtx, 'brown');
    noiseSource.loop = true;
    noiseSource.connect(noiseGain);
    noiseSource.start();

    return true;
  } catch (e) {
    console.error("Audio Engine boot failed: ", e);
    return false;
  }
}

export function updateAudioTension(tensionPercent: number, baseFreq: number) {
  if (!audioCtx || !droneGain || !droneOsc || !droneOscAlt || !filterNode || !noiseGain) return;

  const time = audioCtx.currentTime;

  // As tension gains, raise pitch slightly to feel tighter, and increase lowpass filter cutoff
  const targetTensionFreq = baseFreq + (tensionPercent * 0.4); // Subtle rise
  droneOsc.frequency.exponentialRampToValueAtTime(targetTensionFreq, time + 1.5);
  droneOscAlt.frequency.exponentialRampToValueAtTime(targetTensionFreq * 1.51, time + 1.8);

  // Filter opens as tension spikes, allowing high-freq elements
  const filterFreq = 180 + (tensionPercent * 16.5);
  filterNode.frequency.exponentialRampToValueAtTime(filterFreq, time + 2);

  // Increase noise gain slightly during high-tension
  const noiseVolume = 0.04 + (tensionPercent * 0.001);
  noiseGain.gain.linearRampToValueAtTime(noiseVolume, time + 1);
}

export function changeSynthStyle(baseFreq: number, waveType: 'sine' | 'square' | 'sawtooth' | 'triangle') {
  if (!audioCtx) return;
  const time = audioCtx.currentTime;

  if (droneOsc) {
    droneOsc.type = waveType;
    droneOsc.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.5);
  }
  if (droneOscAlt) {
    droneOscAlt.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, time + 0.5);
  }
}

export function playTriggerSFX(type: 'select' | 'branch' | 'render' | 'danger') {
  if (!audioCtx || !sfxGain) return;

  const now = audioCtx.currentTime;

  if (type === 'select') {
    const osc = audioCtx.createOscillator();
    const tempGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, now); // E4
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
    tempGain.gain.setValueAtTime(0.3, now);
    tempGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(tempGain);
    tempGain.connect(sfxGain);
    osc.start();
    osc.stop(now + 0.18);
  } else if (type === 'branch') {
    // Heavy futuristic trigger sound
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const tempGain = audioCtx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(110, now);
    osc1.frequency.exponentialRampToValueAtTime(55, now + 0.4);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(220, now);
    osc2.frequency.exponentialRampToValueAtTime(110, now + 0.4);

    tempGain.gain.setValueAtTime(0.4, now);
    tempGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc1.connect(tempGain);
    osc2.connect(tempGain);
    tempGain.connect(sfxGain);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } else if (type === 'render') {
    // Dynamic clicking sound representing a simulated frame draw
    const osc = audioCtx.createOscillator();
    const tempGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(800, now + 0.03);
    tempGain.gain.setValueAtTime(0.15, now);
    tempGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(tempGain);
    tempGain.connect(sfxGain);
    osc.start();
    osc.stop(now + 0.06);
  } else if (type === 'danger') {
    // Deep warning horns
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const tempGain = audioCtx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(92.5, now); // F#2
    osc1.frequency.linearRampToValueAtTime(90.0, now + 0.6);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(93.1, now); // slight detune
    osc2.frequency.linearRampToValueAtTime(90.6, now + 0.6);

    tempGain.gain.setValueAtTime(0.5, now);
    tempGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    // Bandpass sweep to give it that cinematic doom growl
    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(150, now);
    bandpass.frequency.exponentialRampToValueAtTime(400, now + 0.5);

    osc1.connect(bandpass);
    osc2.connect(bandpass);
    bandpass.connect(tempGain);
    tempGain.connect(sfxGain);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.82);
    osc2.stop(now + 0.82);
  }
}

export function setGlobalVolume(level: number) {
  if (mainGain && audioCtx) {
    mainGain.gain.setValueAtTime(level * 0.3, audioCtx.currentTime); // Keep safe limits
  }
}

export function stopAudioEngine() {
  if (droneOsc) {
    try { droneOsc.stop(); } catch (e) {}
    droneOsc.disconnect();
    droneOsc = null;
  }
  if (droneOscAlt) {
    try { droneOscAlt.stop(); } catch (e) {}
    droneOscAlt.disconnect();
    droneOscAlt = null;
  }
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

export function getAudioAnalyserData(): Uint8Array {
  if (!analyserNode) {
    // Return empty mocks
    return new Uint8Array(32).map(() => Math.floor(Math.random() * 40));
  }
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyserNode.getByteFrequencyData(dataArray);
  return dataArray;
}
