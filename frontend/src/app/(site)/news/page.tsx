// app/(site)/news/NewsClient.tsx
'use client';

import Link from 'next/link';
import { NewsArticle } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsClientProps {
  news: NewsArticle[];
}

export default function NewsClient({ news }: NewsClientProps) {
  const { t } = useLanguage();

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600 font-semibold mb-4">
        {t('news.title')}
      </p>
      <h1 className="font-display text-4xl text-clinical-900 mb-12">
        {t('news.heading')}
      </h1>

      {!news || news.length === 0 ? (
        <p className="text-clinical-600 text-sm">{t('news.empty')}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {news.map((article: NewsArticle) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="focus-ring block rounded-sm border border-clinical-200 p-6 bg-white hover:border-clinical-500 transition-colors"
            >
              <p className="text-xs uppercase tracking-wide text-clay-600 font-semibold mb-3">{article.category}</p>
              <h2 className="font-display text-2xl text-clinical-900 mb-2">{article.title}</h2>
              <p className="text-sm text-clinical-700/80 line-clamp-3">{article.excerpt}</p>
              <p className="text-xs text-clinical-500 mt-4">
                {article.publishedAt 
                  ? new Date(article.publishedAt).toLocaleDateString(
                      navigator.language || 'en-US', 
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    ) 
                  : t('news.date_pending')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}