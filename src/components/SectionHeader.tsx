interface SectionHeaderProps {
  subtitle: string;
  title: string;
}

export default function SectionHeader({ subtitle, title }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {subtitle}
        </span>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-white md:text-xl">
          {title}
        </h2>
      </div>
    </div>
  );
}