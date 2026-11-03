'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const greetings = [
  { text: 'Hello.', lang: 'en', effect: 'typing' },
  { text: 'Hola.', lang: 'es', effect: 'up' },
  { text: 'Bonjour.', lang: 'fr', effect: 'side' },
  { text: '\u3053\u3093\u306b\u3061\u306f', lang: 'ja', effect: 'soft' },
  { text: 'Kumusta?', lang: 'fil', effect: 'typing' },
];

export default function StartupReveal() {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [word, setWord] = useState(0);
  const [text, setText] = useState('');
  const sample = useRef<AudioBuffer | null>(null);
  const activeSources = useRef(new Set<AudioBufferSourceNode>());
  const loadingSample = useRef<Promise<void> | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const soundEnabled = useRef(false);

  useEffect(() => {
    if (dismissed) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    const mingkayImage = new window.Image();
    mingkayImage.src = '/assets/neko/neko.png';
    const mingkayReady = mingkayImage.decode().catch(() => {});
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    let index = 0;
    let length = 0;
    const playEffect = (effect: string) => {
      const context = audio.current;
      if (!soundEnabled.current || context?.state !== 'running') return;
      const gain = context.createGain();
      const now = context.currentTime;
      const typing = effect === 'typing';
      const duration = typing ? 0.075 : 0.32;
      let source: AudioBufferSourceNode;
      if (typing) {
        if (!sample.current) return;
        source = context.createBufferSource();
        source.buffer = sample.current;
        source.connect(gain);
      } else {
        const noise = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        source = context.createBufferSource();
        source.buffer = noise;
        const filter = context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 0.8;
        filter.frequency.setValueAtTime(effect === 'side' ? 1800 : 500, now);
        filter.frequency.exponentialRampToValueAtTime(effect === 'side' ? 400 : 2200, now + duration);
        source.connect(filter);
        filter.connect(gain);
        source.onended = () => filter.disconnect();
      }
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(typing ? 0.55 : effect === 'soft' ? 0.045 : 0.085, now + (typing ? 0.004 : 0.07));
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      gain.connect(context.destination);
      activeSources.current.add(source);
      const previousEnd = source.onended;
      source.onended = event => {
        if (previousEnd) previousEnd.call(source, event);
        activeSources.current.delete(source);
        source.disconnect(); gain.disconnect();
      };
      source.start(now);
    };
    const next = () => {
      if (stopped) return;
      if (index === greetings.length - 1) {
        void mingkayReady.then(() => { if (!stopped) setExiting(true); });
        return;
      }
      index++;
      length = 0;
      show();
    };
    const show = () => {
      if (stopped) return;
      const greeting = greetings[index];
      setWord(index);
      if (greeting.effect === 'typing') {
        length++;
        setText(greeting.text.slice(0, length));
        playEffect('typing');
        timer = setTimeout(length < greeting.text.length ? show : next, length < greeting.text.length ? 80 : 650);
      } else {
        setText(greeting.text);
        playEffect(greeting.effect);
        timer = setTimeout(next, 900);
      }
    };
    timer = setTimeout(show, 200);
    const skip = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDismissed(true);
    };
    const onMotion = () => { if (motion.matches) setDismissed(true); };
    window.addEventListener('keydown', skip);
    motion.addEventListener('change', onMotion);
    return () => {
      stopped = true;
      clearTimeout(timer);
      window.removeEventListener('keydown', skip);
      motion.removeEventListener('change', onMotion);
    };
  }, [dismissed]);

  useEffect(() => {
    if (dismissed && audio.current) void audio.current.close().catch(() => {});
  }, [dismissed]);
  useEffect(() => () => {
    if (audio.current) void audio.current.close().catch(() => {});
    audio.current = null;
    loadingSample.current = null;
    sample.current = null;
  }, []);

  const enableSound = useCallback(async () => {
    try {
      audio.current ??= new AudioContext();
      // Attempt autoplay; a blocked context resumes on the first interaction.
      void audio.current.resume().catch(() => {});
      const context = audio.current;
      loadingSample.current ??= fetch('/audio/keyboard-typing.mp3')
        .then(response => {
          if (!response.ok) throw new Error('Keyboard recording unavailable');
          return response.arrayBuffer();
        })
        .then(bytes => context.decodeAudioData(bytes))
        .then(recording => {
          // Extract one audible key strike, then trigger it with every letter.
          const data = recording.getChannelData(0);
          const limit = Math.min(data.length, recording.sampleRate * 8);
          let peak = 0;
          let offset = 0;
          for (let i = 0; i < limit; i++) {
            if (Math.abs(data[i]) > peak) { peak = Math.abs(data[i]); offset = i; }
          }
          const start = Math.max(0, offset - Math.floor(recording.sampleRate * 0.012));
          const size = Math.min(Math.floor(recording.sampleRate * 0.08), recording.length - start);
          const tap = context.createBuffer(recording.numberOfChannels, size, recording.sampleRate);
          for (let channel = 0; channel < recording.numberOfChannels; channel++) {
            const input = recording.getChannelData(channel);
            const output = tap.getChannelData(channel);
            for (let i = 0; i < size; i++) output[i] = input[start + i] / Math.max(peak, 0.01) * 0.8;
          }
          sample.current = tap;
        });
      await loadingSample.current;
      if (audio.current !== context || context.state !== 'running') return;
      soundEnabled.current = true;


    } catch {
      loadingSample.current = null;
      soundEnabled.current = false;

    }
  }, []);

  useEffect(() => {
    if (dismissed || exiting || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const autoplay = window.setTimeout(() => { void enableSound(); }, 0);
    const unlock = () => { if (!soundEnabled.current) void enableSound(); };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.clearTimeout(autoplay);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [dismissed, exiting, enableSound]);

  useEffect(() => {
    if (!revealing) return;
    const timer = window.setTimeout(() => setDismissed(true), 820);
    return () => window.clearTimeout(timer);
  }, [revealing]);

  const enterPortfolio = () => {
    if (revealing) return;
    setRevealing(true);
    const context = audio.current;
    if (context?.state === 'running') playRevealClick(context);
  };

  if (dismissed) return null;
  return (
    <div className="startup-stage">
      <div className="startup-reveal" data-exiting={exiting} data-revealing={revealing}
        onAnimationEnd={event => {
          if (event.target === event.currentTarget && event.animationName === 'startup-soft-reveal') setDismissed(true);
        }}>
        <div className="startup-greetings" aria-hidden="true">
          <span key={word} lang={greetings[word].lang} className="startup-word" data-effect={greetings[word].effect}>{text}{greetings[word].effect === 'typing' && <span className="startup-caret" />}</span>
        </div>
        {exiting && <button type="button" className="startup-enter" onClick={enterPortfolio}>Enter portfolio<span aria-hidden="true">&rarr;</span></button>}
      {exiting && (
        <div className="startup-enter-mingkay" aria-hidden="true"
          onAnimationStart={event => {
            if (event.animationName === 'startup-paw-press') enterPortfolio();
          }}>
          <span className="startup-mingkay-sprite" />
          <span className="startup-paw-press" />
        </div>
      )}
      </div>
    </div>
  );
}

function playRevealClick(context: AudioContext) {
  const click = context.createOscillator();
  const clickGain = context.createGain();
  const clickTime = context.currentTime;
  click.type = 'triangle';
  click.frequency.setValueAtTime(650, clickTime);
  click.frequency.exponentialRampToValueAtTime(180, clickTime + 0.055);
  clickGain.gain.setValueAtTime(0.11, clickTime);
  clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.065);
  click.connect(clickGain); clickGain.connect(context.destination);
  click.onended = () => { click.disconnect(); clickGain.disconnect(); };
  click.start(); click.stop(clickTime + 0.07);
  const duration = 0.55;
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = context.createBufferSource();
  source.buffer = buffer;
  const filter = context.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.65;
  const gain = context.createGain();
  const now = context.currentTime;
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + duration);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.045, now + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  source.start();
}
