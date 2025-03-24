import { getBlogPosts, getBlogPost, getPostNavigation } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import Markdown from '@/components/markdown';
import { Breadcrumb } from '@/components/breadcrumb';
import { PostNavigation } from '@/components/post-navigation';

export async function generateStaticParams() {
  const posts = await getBlogPosts('en');
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { locale: string; slug: string } }
): Promise<Metadata> {
  const post = await getBlogPost(params.slug, params.locale);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      images: post.coverImage || "/og/blog.jpg",
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale;
  const slug = params.slug;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const post = await getBlogPost(slug, locale);
  
  if (!post) {
    notFound();
  }
  
  const navigation = await getPostNavigation(slug, locale);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Breadcrumb 
          items={[
            { label: t('title'), href: `/${locale}/blog` },
            { label: post.title }
          ]}
          homeLabel={commonT('home')}
          locale={locale}
        />

        <article>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center mb-6">
            {post.author.picture && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={post.author.picture}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatDate(post.date, locale)}
              </div>
            </div>
          </div>
          
          {post.coverImage && (
            <div className="relative h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <Markdown content={post.content} />
          </div>
        </article>
        
        <PostNavigation
          previousPost={navigation.previousPost}
          nextPost={navigation.nextPost}
          locale={locale}
          labels={{
            previousPost: t('previousPost'),
            nextPost: t('nextPost')
          }}
        />
      </div>
    </div>
  );
} 