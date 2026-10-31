interface SectionHeaderProps {
  subtitle: string;
  title: string;
  id?: string;
  description?: string;
}

export default function SectionHeader({ subtitle, title, id, description }: SectionHeaderProps) {
  return (
    <header className="mb-6 sm:mb-7">
      {subtitle && <div className="mb-2">
        <span className="text-xs font-medium text-subtle">
          {subtitle}
        </span>
      </div>}
      
      <div>
        <h2 id={id} className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          {title}
        </h2>
      </div>
      {description && <p className="mt-2 max-w-lg text-sm leading-6 text-muted">{description}</p>}
    </header>
  );
}
