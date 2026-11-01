/** Cyclic depth ordering: the selected card faces forward; the others fan behind it. */
export function getStackPose(imageIndex: number, selected: number, count: number) {
  const rank = ((imageIndex - selected) % count + count) % count;
  if (!rank) return { x: '0%', y: 0, z: 0, scale: 1, rotateY: 0, rotateZ: 0 };
  const side = rank % 2 ? 1 : -1;
  const layer = Math.ceil(rank / 2);
  return {
    x: `${side * Math.min(20 + layer * 4, 30)}%`,
    y: -Math.min(layer * 19, 76),
    z: -60 - rank * 55,
    scale: Math.max(0.78, 0.98 - rank * 0.025),
    rotateY: -side * 13,
    rotateZ: side * Math.min(3 + layer, 8),
  };
}
