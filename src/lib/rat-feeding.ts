export const FEED_DURATION = 1.35;
export function feedingFrame(elapsed: number) {
  const progress = Math.max(0, Math.min(1, elapsed / FEED_DURATION));
  const pull = Math.max(0, Math.min(1, (progress - 0.16) / 0.46));
  const chew = progress > 0.55 && progress < 0.94 ? Math.sin((progress - 0.55) / 0.39 * Math.PI * 3) ** 2 : 0;
  return { progress, pull: pull * pull * (3 - 2 * pull), jaw: progress < 0.55 ? Math.sin(progress / 0.55 * Math.PI) : chew * 0.7, chew, done: elapsed >= FEED_DURATION };
}
