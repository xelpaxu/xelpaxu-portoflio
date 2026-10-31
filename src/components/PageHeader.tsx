export default function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mx-auto mb-10 max-w-2xl pb-2 text-center sm:mb-12">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-muted">{description}</p>
    </header>
  );
}
