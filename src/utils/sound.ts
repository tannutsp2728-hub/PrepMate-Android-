// Web Audio API Synthesizer for notifications and focus sounds

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientNode: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a gentle zen bell chime when focus session finishes
  playChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Harmonic chime
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.9);
      });
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  }

  // Play subtle task complete pop
  playTaskComplete() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  // Toggle procedural focus brown noise / gentle rain
  startAmbientNoise(type: 'brown' | 'rain' = 'brown', volume: number = 0.15) {
    try {
      this.stopAmbientNoise();
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (type === 'brown') {
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation
        }
      } else {
        // Rain-like texture
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.4;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for mellow focus frequency
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'brown' ? 350 : 800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);

      this.ambientNode = whiteNoise;
      this.ambientGain = gain;
      this.isAmbientPlaying = true;
    } catch {
      // ignore
    }
  }

  stopAmbientNoise() {
    if (this.ambientNode) {
      try {
        (this.ambientNode as AudioBufferSourceNode).stop();
        this.ambientNode.disconnect();
      } catch {
        // ignore
      }
      this.ambientNode = null;
      this.ambientGain = null;
      this.isAmbientPlaying = false;
    }
  }

  get isPlayingAmbient(): boolean {
    return this.isAmbientPlaying;
  }
}

export const soundManager = new SoundManager();
