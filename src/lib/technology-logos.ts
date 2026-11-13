type TechnologyOverride = {
  slug?: string;
  label?: string;
  src?: string;
  monochrome?: boolean;
};

// Only exceptions belong here. Other names resolve to Simple Icons automatically.
const overrides: Record<string, TechnologyOverride> = {
  ts: { slug: 'typescript', label: 'TypeScript' },
  'react native': { slug: 'react' },
  'tanstack query': { slug: 'tanstack' },
  'framer motion': { slug: 'framer', monochrome: true },
  css3: { slug: 'css' },
  github: { monochrome: true },
  vercel: { monochrome: true },
  'next.js': { monochrome: true },
  express: { monochrome: true },
  expo: { monochrome: true },
  'socket.io': { label: 'Socket.IO', monochrome: true },
  'three.js': { monochrome: true },
  convex: { src: '/assets/logos/convex.svg' },
  flet: { src: '/assets/logos/flet.svg' },
  'visual studio code': { src: '/assets/logos/vscode.svg' },
  vscode: { src: '/assets/logos/vscode.svg', label: 'Visual Studio Code' },
  vsc: { src: '/assets/logos/vscode.svg', label: 'Visual Studio Code' },
  antigravity: { src: '/assets/logos/antigravity.svg', label: 'Antigravity' },
  'google antigravity': { src: '/assets/logos/antigravity.svg', label: 'Antigravity' },
  codex: { src: '/assets/logos/codex.svg', monochrome: true },
  'openai codex': { src: '/assets/logos/codex.svg', label: 'Codex', monochrome: true },
  omniroute: { src: '/assets/logos/omniroute.svg', label: 'OmniRoute' },
};

export function getTechnology(name: string) {
  const label = name.trim();
  const override = overrides[label.toLowerCase()];
  const slug = override?.slug ?? label.toLowerCase()
    .replace(/\./g, 'dot')
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '');

  return {
    label: override?.label ?? label,
    src: label.toLowerCase() === 'qr' ? undefined : override?.src ?? `https://cdn.simpleicons.org/${slug}${override?.monochrome ? '/181818' : ''}`,
    monochrome: override?.monochrome ?? false,
  };
}
