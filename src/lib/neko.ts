// Sprite coordinates: https://github.com/crgimenes/neko
// Sprite license and attribution are shipped in public/assets/neko/.
type Cell = readonly [number, number];
export const NEKO_SIZE = 32;
const frames = {
  E: [[3, 0], [3, 1]], SE: [[5, 1], [5, 2]],
  S: [[6, 3], [7, 2]], SW: [[5, 3], [6, 1]],
  W: [[4, 2], [4, 3]], NW: [[1, 0], [1, 1]],
  N: [[1, 2], [1, 3]], NE: [[0, 2], [0, 3]],
  idle: [[3, 3]], alert: [[7, 3]],
  scratch: [[5, 0], [6, 0]], groom: [[7, 0]],
  yawn: [[3, 2]], sleep: [[2, 0], [2, 1]],
} as const satisfies Record<string, readonly Cell[]>;
const directions = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'] as const;
export type NekoPose = keyof typeof frames;
export interface NekoState {
  x: number; y: number; targetX: number; targetY: number;
  pose: NekoPose; direction: number; idleSince: number; wakeUntil: number;
}
const inset = NEKO_SIZE / 2;
const clamp = (value: number, size: number) => Math.max(inset, Math.min(value, Math.max(inset, size - inset)));

export function createNeko(width: number, height: number, now: number): NekoState {
  const x = clamp(48, width);
  const y = clamp(height - 60, height);
  return { x, y, targetX: x, targetY: y, pose: 'idle', direction: 0, idleSince: now, wakeUntil: 0 };
}

export function targetNeko(cat: NekoState, x: number, y: number, width: number, height: number, now: number) {
  const nextX = clamp(x, width);
  const nextY = clamp(y, height);
  if (Math.hypot(nextX - cat.targetX, nextY - cat.targetY) < 3) return;
  cat.targetX = nextX;
  cat.targetY = nextY;
  if (now - cat.idleSince > 1500 && cat.wakeUntil <= now) cat.wakeUntil = now + 350;
  cat.idleSince = now;
}

export function resizeNeko(cat: NekoState, width: number, height: number) {
  cat.x = clamp(cat.x, width); cat.y = clamp(cat.y, height);
  cat.targetX = clamp(cat.targetX, width); cat.targetY = clamp(cat.targetY, height);
}

export function parkNeko(cat: NekoState, now: number) {
  cat.targetX = cat.x; cat.targetY = cat.y;
  cat.idleSince = now; cat.wakeUntil = 0;
}

export function stepNeko(cat: NekoState, now: number, deltaSeconds: number): Cell {
  const dx = cat.targetX - cat.x;
  const dy = cat.targetY - cat.y;
  const distance = Math.hypot(dx, dy);
  if (cat.wakeUntil > now) {
    cat.pose = 'alert';
    cat.idleSince = now;
  } else if (distance > 30.5) {
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
    const difference = Math.abs(((angle - cat.direction * 45 + 540) % 360) - 180);
    if (difference > 27) cat.direction = Math.round(angle / 45) % 8;
    const travel = Math.min(distance - 30, 120 * Math.max(0, Math.min(deltaSeconds, 0.1)));
    cat.x += dx / distance * travel;
    cat.y += dy / distance * travel;
    cat.pose = directions[cat.direction];
    cat.idleSince = now;
  } else {
    const idle = now - cat.idleSince;
    cat.pose = idle < 1500 ? 'idle' : idle < 3000 ? 'scratch' : idle < 4300 ? 'groom' : idle < 5500 ? 'yawn' : 'sleep';
  }
  const animation = frames[cat.pose];
  const interval = cat.pose === 'sleep' ? 500 : 100;
  return animation[Math.floor(now / interval) % animation.length];
}
