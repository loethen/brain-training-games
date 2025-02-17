import Link from 'next/link';

interface BreadcrumbsProps {
  currentPage: string;
}

export function Breadcrumbs({ currentPage }: BreadcrumbsProps) {
  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumb">
      <ol className="flex gap-2 text-muted-foreground">
        <li><Link href="/" className="hover:text-foreground">Home</Link></li>
        <li>/</li>
        <li><Link href="/games" className="hover:text-foreground">Games</Link></li>
        <li>/</li>
        <li className="text-foreground">{currentPage}</li>
      </ol>
    </nav>
  );
} 