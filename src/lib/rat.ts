export interface RatPoint { x: number; y: number }
export interface RatBounds { left: number; right: number; top: number; bottom: number }
export interface RatState extends RatPoint { vx: number; vy: number; facing: -1 | 1 }
export const clampRat = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export function stepRat(rat: RatState, target: RatPoint, delta: number, bounds: RatBounds, fleeing = false) {
  const dt = Math.min(0.05, Math.max(0, delta));
  const dx = target.x - rat.x, dy = target.y - rat.y, distance = Math.hypot(dx, dy);
  const speed = Math.min(fleeing ? 230 : 85, distance * 5);
  const ease = 1 - Math.exp(-12 * dt);
  rat.vx += ((distance > 0.001 ? dx / distance * speed : 0) - rat.vx) * ease;
  rat.vy += ((distance > 0.001 ? dy / distance * speed : 0) - rat.vy) * ease;
  rat.x = clampRat(rat.x + rat.vx * dt, bounds.left, bounds.right);
  rat.y = clampRat(rat.y + rat.vy * dt, bounds.top, bounds.bottom);
  if (Math.abs(rat.vx) > 8) rat.facing = rat.vx < 0 ? -1 : 1;
  return Math.hypot(target.x - rat.x, target.y - rat.y) < 2 && Math.hypot(rat.vx, rat.vy) < 12;
}
export function ratEscape(cat: RatPoint, bounds: RatBounds): RatPoint {
  const corners = [{ x: bounds.left, y: bounds.top }, { x: bounds.right, y: bounds.top }, { x: bounds.left, y: bounds.bottom }, { x: bounds.right, y: bounds.bottom }];
  return corners.reduce((best, point) => Math.hypot(point.x - cat.x, point.y - cat.y) > Math.hypot(best.x - cat.x, best.y - cat.y) ? point : best);
}
