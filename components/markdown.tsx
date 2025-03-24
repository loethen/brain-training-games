import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrism from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';

interface MarkdownProps {
  content: string;
}

const components: Components = {
  // 优化图片渲染
  img: ({ src, alt }) => {
    if (!src) return null;
    
    return (
      <div className="relative h-64 w-full my-6 rounded-lg overflow-hidden">
        <Image
          src={src}
          alt={alt || ''}
          fill
          className="object-contain"
        />
      </div>
    );
  },
  // 优化链接
  a: ({ href, children }) => {
    // 外部链接
    if (href && (href.startsWith('http') || href.startsWith('//'))) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {children}
        </a>
      );
    }
    
    // 内部链接
    return href ? (
      <Link href={href} className="text-primary hover:underline">
        {children}
      </Link>
    ) : null;
  },
  // 优化代码渲染
  code: ({ className, children }) => {
    if (className) {
      return (
        <code className={`${className} rounded p-1`}>
          {children}
        </code>
      );
    }
    return <code className="bg-muted text-muted-foreground rounded px-1 py-0.5">{children}</code>;
  }
};

export default function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown 
      components={components}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug, [rehypePrism, { ignoreMissing: true }]]}
    >
      {content}
    </ReactMarkdown>
  );
} 