import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BlogPost } from '@/lib/blog';

interface PostNavigationProps {
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
  locale: string;
  labels: {
    previousPost: string;
    nextPost: string;
  };
}

export function PostNavigation({ previousPost, nextPost, locale, labels }: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch border-t border-b py-6 my-8">
      {previousPost ? (
        <Link 
          href={`/${locale}/blog/${previousPost.slug}`}
          className="flex flex-1 flex-col p-4 rounded-md hover:bg-muted transition-colors group max-w-full"
        >
          <span className="flex items-center text-sm text-muted-foreground mb-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {labels.previousPost}
          </span>
          <span className="font-medium group-hover:text-primary truncate">{previousPost.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextPost ? (
        <Link 
          href={`/${locale}/blog/${nextPost.slug}`}
          className="flex flex-1 flex-col p-4 rounded-md hover:bg-muted transition-colors group text-right max-w-full md:ml-auto"
        >
          <span className="flex items-center text-sm text-muted-foreground mb-2 justify-end">
            {labels.nextPost}
            <ChevronRight className="h-4 w-4 ml-1" />
          </span>
          <span className="font-medium group-hover:text-primary truncate">{nextPost.title}</span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
} 