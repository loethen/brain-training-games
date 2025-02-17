interface GameHeaderProps {
  title: string;
  subtitle: string;
}

export function GameHeader({ title, subtitle }: GameHeaderProps) {
  return (
    <header className="text-center mb-12">
      <h1 className="text-5xl mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground">
        {subtitle}
      </p>
    </header>
  );
} 