let ctx: AudioContext | null = null;

// Layer the click sample over a synthesized low thump for a creamier sound.
export function playThock() {
  if (typeof window === 'undefined') return;

  const click = new Audio('/assets/sounds/keyboard-single-click.mp3');
  click.volume = 0.9;
  void click.play().catch(() => {});

  if (window.AudioContext) {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.09);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }
}
