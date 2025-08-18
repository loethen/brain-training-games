import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypePrism from 'rehype-prism-plus';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import BlogAd from './blog-ad';

interface MarkdownProps {
  content: string;
}

const components: Components = {
  // 优化图片渲染
  img: ({ src, alt }) => {
    if (!src) return null;
    
    return (
      <div className="relative h-64 w-full my-6 rounded-lg overflow-hidden md:h-[400px]">
        <Image
          src={src}
          alt={alt || ''}
          fill
          className="object-cover"
        />
      </div>
    );
  },
  // 支持figure标签和figcaption
  figure: ({ children }) => (
    <figure className="my-8">
      {children}
    </figure>
  ),
  figcaption: ({ children }) => (
    <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
      {children}
    </figcaption>
  ),
  // 优化引用块
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 py-1 my-6 bg-muted/50 rounded-r-md">
      {children}
    </blockquote>
  ),
  // 优化标题
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-10 mb-6 border-b pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">
      {children}
    </h3>
  ),
  // 优化段落
  p: ({ children }) => (
    <p className="leading-relaxed mb-5 text-[17px]">
      {children}
    </p>
  ),
  // 优化链接
  a: ({ href, children }) => {
    // 外部链接
    if (href && (href.startsWith('http') || href.startsWith('//'))) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
        >
          {children}
        </a>
      );
    }
    
    // 内部链接
    return href ? (
      <Link href={href} className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
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
  },
  // 优化水平分割线
  hr: () => <hr className="my-10 border-t border-muted-foreground/20" />
};

export default function Markdown({ content }: MarkdownProps) {
  // 将内容按段落分割，并在合适位置插入广告
  const insertAdsInContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    const result: string[] = [];
    
    paragraphs.forEach((paragraph, index) => {
      result.push(paragraph);
      
      // 在第3段后插入广告标记
      if (index === 2) {
        result.push('<!-- AD_PLACEHOLDER -->');
      }
    });
    
    return result.join('\n\n');
  };

  const processedContent = insertAdsInContent(content);
  
  // 将处理后的内容分割成段落并渲染
  const renderContentWithAds = () => {
    const sections = processedContent.split('<!-- AD_PLACEHOLDER -->');
    
    return sections.map((section, index) => (
      <React.Fragment key={index}>
        <ReactMarkdown 
          components={components}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, [rehypePrism, { ignoreMissing: true }]]}
        >
          {section.trim()}
        </ReactMarkdown>
        {index < sections.length - 1 && <BlogAd />}
      </React.Fragment>
    ));
  };

  return (
    <div className="prose-lg max-w-none">
      {renderContentWithAds()}
    </div>
  );
} 