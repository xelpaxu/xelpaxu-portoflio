import TechStack from '@/components/TechStack';

const groups = [
  {
    name: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'React Native', 'Flutter', 'Dart', 'Framer Motion', "GSAP"],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'PostgreSQL', 'Firebase', 'Supabase', 'MySQL'],
  },
  {
    name: 'Tools',
    items: ['Figma', 'Docker'],
  },
  {
    name: 'Platforms',
    items: ['GitHub', 'Vercel', 'Firebase', 'Supabase', 'Convex', 'Expo'],
  },
];

export default function StackAndTools() {
  return (
    <div className="stack-directory space-y-9">
      {groups.map(group => (
        <div key={group.name} className="stack-category relative grid min-w-0 gap-5 sm:grid-cols-[145px_minmax(0,1fr)] sm:gap-7">
          <h3 className="flex items-center gap-3 self-start text-base font-semibold text-strong sm:pt-2">
            {group.name}
          </h3>
          <div className="min-w-0 border-l border-line pl-5 sm:pl-7 [&_ul]:flex [&_ul]:flex-wrap [&_ul]:items-start [&_ul]:gap-x-4 [&_ul]:gap-y-7 [&_li]:w-[76px] [&_li]:min-w-0 [&_li]:flex-col [&_li]:gap-3 [&_li]:text-center [&_li]:text-xs [&_li]:leading-5 [&_svg]:size-9 [&_img]:size-9">
            <TechStack tags={group.items} />
          </div>
        </div>
      ))}
    </div>
  );
}
