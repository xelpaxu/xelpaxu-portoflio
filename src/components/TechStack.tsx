import { SiNextdotjs, SiNodedotjs, SiReact, SiTypescript, SiYoutube, SiDocker, SiPython, SiDjango, SiPostgresql, SiMongodb, SiExpress, SiFigma, SiTailwindcss, SiFlutter, SiDart, SiFirebase, SiExpo, SiSocketdotio, SiThreedotjs, SiFastapi, SiTensorflow, SiJavascript, SiMysql, SiSupabase, SiFramer, SiLeaflet } from 'react-icons/si';
import { Library, QrCode } from 'lucide-react';
import type { IconType } from 'react-icons';
import Image from 'next/image';

const technologies: Record<string, { icon: IconType; label: string; color?: string }> = {
  TS: { icon: SiTypescript, label: 'TypeScript', color: '#3178c6' },
  TypeScript: { icon: SiTypescript, label: 'TypeScript', color: '#3178c6' },
  'Node.js': { icon: SiNodedotjs, label: 'Node.js', color: '#5fa04e' },
  React: { icon: SiReact, label: 'React', color: '#149eca' },
  'Next.js': { icon: SiNextdotjs, label: 'Next.js' },
  YouTube: { icon: SiYoutube, label: 'YouTube', color: '#ff0033' },
  Docker: { icon: SiDocker, label: 'Docker', color: '#2496ed' },
  Python: { icon: SiPython, label: 'Python', color: '#4584b6' },
  Django: { icon: SiDjango, label: 'Django' },
  PostgreSQL: { icon: SiPostgresql, label: 'PostgreSQL', color: '#527fa5' },
  MongoDB: { icon: SiMongodb, label: 'MongoDB', color: '#47a248' },
  Express: { icon: SiExpress, label: 'Express' },
  Figma: { icon: SiFigma, label: 'Figma', color: '#a259ff' },
  'Tailwind CSS': { icon: SiTailwindcss, label: 'Tailwind CSS', color: '#06b6d4' },
  Flutter: { icon: SiFlutter, label: 'Flutter', color: '#42a5f5' },
  Dart: { icon: SiDart, label: 'Dart', color: '#13b9fd' },
  Firebase: { icon: SiFirebase, label: 'Firebase', color: '#f59d00' },
  Expo: { icon: SiExpo, label: 'Expo' },
  'React Native': { icon: SiReact, label: 'React Native', color: '#149eca' },
  'Socket.io': { icon: SiSocketdotio, label: 'Socket.IO' },
  'Three.js': { icon: SiThreedotjs, label: 'Three.js' },
  FastAPI: { icon: SiFastapi, label: 'FastAPI', color: '#009688' },
  TensorFlow: { icon: SiTensorflow, label: 'TensorFlow', color: '#ff8f00' },
  JavaScript: { icon: SiJavascript, label: 'JavaScript', color: '#c5a800' },
  MySQL: { icon: SiMysql, label: 'MySQL', color: '#4486a1' },
  Supabase: { icon: SiSupabase, label: 'Supabase', color: '#3ecf8e' },
  'Framer Motion': { icon: SiFramer, label: 'Framer Motion' },
  Leaflet: { icon: SiLeaflet, label: 'Leaflet', color: '#66a040' },

};

const localLogos: Record<string, string> = { Convex: '/assets/logos/convex.svg', Flet: '/assets/logos/flet.svg' };

export default function TechStack({ tags, iconOnly = false }: { tags: string[]; iconOnly?: boolean }) {
  return <ul aria-label="Technologies" className={`flex flex-wrap items-center gap-y-3 ${iconOnly ? 'gap-x-4' : 'gap-x-5'}`}>
    {tags.map(tag => {
      const technology = technologies[tag];
      const Icon = technology?.icon ?? (tag === 'QR' ? QrCode : Library);
      return <li key={tag} title={technology?.label ?? tag} className="inline-flex items-center gap-2 text-xs text-muted">
        {localLogos[tag] ? <Image src={localLogos[tag]} alt="" width={18} height={18} className="size-[18px] shrink-0 object-contain" /> : <Icon aria-hidden="true" className={`${iconOnly ? 'size-[18px]' : 'size-4'} shrink-0`} style={technology?.color ? { color: technology.color } : undefined} />}
        <span className={iconOnly ? 'sr-only' : undefined}>{technology?.label ?? tag}</span>
      </li>;
    })}
  </ul>;
}
