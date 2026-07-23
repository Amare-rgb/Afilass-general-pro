import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { NewsArticle } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getArticle(slug: string) {
  try {
    return await api.get<NewsArticle>(`/news/${slug}`);
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto px-5 py-16">
      <Link href="/news" className="text-sm text-clinical-600 hover:underline">
        &larr; All news
      </Link>

      <p className="text-xs uppercase tracking-wide text-clay-600 font-semibold mt-6 mb-3">{article.category}</p>
      <h1 className="font-display text-4xl text-clinical-900 mb-4">{article.title}</h1>
      <p className="text-sm text-clinical-500 mb-10">
        {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <div className="text-clinical-800/90 leading-relaxed whitespace-pre-line">{article.content}</div>
    </article>
  );
}
