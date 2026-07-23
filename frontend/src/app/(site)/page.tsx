// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Department, NewsArticle } from '@/lib/types';
import HeroCarousel from '@/components/HeroCarousel';
import WebChat from '@/components/WebChat';
import { useLanguage } from '@/contexts/LanguageContext';

const VALUES = [
  {
    key: 'value.patient_care',
    icon: '❤️'
  },
  {
    key: 'value.modern_lab',
    icon: '🔬'
  },
  {
    key: 'value.trusted_doctors',
    icon: '👨‍⚕️'
  },
  {
    key: 'value.availability',
    icon: '🕐'
  },
];

const heroSlides = [
  {
    id: 1,
    image: '/slider-3-bdr.jpg',
    titleKey: 'home.hero_title',
    subtitleKey: 'home.hero_subtitle',
    descriptionKey: 'home.hero_desc',
    cta1Key: 'button.book',
    cta1Link: '/appointment',
    cta2Key: 'nav.departments',
    cta2Link: '/departments',
    stats: []
  },
  {
    id: 2,
    image: '/slider-2.jpg',
    titleKey: 'home.hero_title2',
    subtitleKey: 'home.hero_subtitle2',
    descriptionKey: 'home.hero_desc2',
    cta1Key: 'button.learn',
    cta1Link: '/departments',
    cta2Key: 'button.contact',
    cta2Link: '/contact',
    stats: []
  },
  {
    id: 3,
    image: '/afilas.jpg',
    titleKey: 'home.hero_title3',
    subtitleKey: 'home.hero_subtitle3',
    descriptionKey: 'home.hero_desc3',
    cta1Key: 'nav.doctors',
    cta1Link: '/doctors',
    cta2Key: 'button.learn',
    cta2Link: '/about',
    stats: []
  }
];

const teamMembers = [
  {
    name: 'Dr. Birhanu Yirga',
    title: 'General Surgeon',
    image: '/brhanu.jpg',
    alt: 'Dr. Birhanu Yirga'
  },
  {
    name: 'Dr. Fisha Gebeyehu',
    title: 'Neurosurgeon',
    image: '/Dr._Fsha-213x420.jpg',
    alt: 'Dr. Fisha Gebeyehu'
  },
  {
    name: 'Dr. Abrham Wanaw',
    title: 'Ophthalmologist',
    image: '/Dr_Abrham-213x420.jpg',
    alt: 'Dr. Abrham Wanaw'
  },
  {
    name: 'Dr. Dawit Muche',
    title: 'MD, Internist',
    image: '/dr_dawit-213x420.jpg',
    alt: 'Dr. Dawit Muche'
  },
  {
    name: 'Dr. Leul',
    title: 'Specialist',
    image: '/Dr.Leul_-213x420.jpg',
    alt: 'Dr. Leul'
  }
];

export default function HomePage() {
  const { t } = useLanguage();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getHomeData() {
      try {
        const [deptResponse, newsResponse] = await Promise.all([
          api.get<any>('/departments'),
          api.get<any>('/news'),
        ]);
        
        let deptData: Department[] = [];
        if (deptResponse) {
          if (deptResponse.data && Array.isArray(deptResponse.data)) {
            deptData = deptResponse.data;
          } else if (Array.isArray(deptResponse)) {
            deptData = deptResponse;
          }
        }
        setDepartments(deptData.slice(0, 6));

        let newsData: NewsArticle[] = [];
        if (newsResponse) {
          if (newsResponse.data && Array.isArray(newsResponse.data)) {
            newsData = newsResponse.data;
          } else if (Array.isArray(newsResponse)) {
            newsData = newsResponse;
          }
        }
        setNews(newsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    }
    getHomeData();
  }, []);

  // Create translated slides
  const translatedSlides = heroSlides.map(slide => ({
    ...slide,
    title: t(slide.titleKey),
    subtitle: t(slide.subtitleKey),
    description: t(slide.descriptionKey),
    cta1: t(slide.cta1Key),
    cta2: t(slide.cta2Key),
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Carousel Section */}
      <section className="relative">
        <HeroCarousel slides={translatedSlides} />
      </section>

      {/* Why choose us with enhanced hover effects */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-clinical-900 mb-3">{t('home.title')}</h2>
          <p className="text-clinical-700/80 max-w-2xl mx-auto">{t('home.subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <div 
              key={v.key} 
              className="group relative bg-white rounded-2xl p-8 border-2 border-clinical-100 hover:border-clinical-500 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-white hover:to-clinical-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-clinical-500/0 to-clinical-500/0 group-hover:from-clinical-500/5 group-hover:to-clinical-500/10 transition-all duration-500"></div>
              <div className="absolute top-4 right-4 text-clinical-200 font-display text-6xl font-bold group-hover:text-clinical-300/30 transition-all duration-500">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-5 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  {v.icon}
                </div>
                <h3 className="font-bold text-clinical-900 mb-3 text-xl group-hover:text-clinical-700 transition-colors duration-300">
                  {t(v.key)}
                </h3>
                <p className="text-clinical-700/80 leading-relaxed text-sm group-hover:text-clinical-600 transition-colors duration-300">
                  {t(v.key + '_desc')}
                </p>
                <div className="mt-4 flex items-center gap-2 text-clinical-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-2">
                  <span className="text-sm font-medium">{t('button.learn')}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments preview */}
      <section className="bg-clinical-50 border-y border-clinical-200 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-clinical-900 mb-2">{t('home.services')}</h2>
              <p className="text-clinical-700/80">{t('home.services_desc')}</p>
            </div>
            <Link href="/departments" className="text-clinical-800 font-semibold text-sm hover:underline flex items-center gap-2">
              {t('button.view_all')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/departments/${dept.slug}`}
                className="group block rounded-2xl bg-white border-2 border-clinical-200 p-6 hover:border-clinical-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="font-semibold text-clinical-900 mb-2 group-hover:text-clinical-700 transition-colors text-lg">
                  {dept.name}
                </h3>
                <p className="text-sm text-clinical-700/80 line-clamp-2">{dept.summary || dept.description}</p>
                <span className="inline-block mt-3 text-sm text-clinical-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  {t('button.learn')} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-clinical-900 mb-3">{t('home.team')}</h2>
          <p className="text-clinical-700/80 max-w-2xl mx-auto">{t('home.team_desc')}</p>
        </div>
        <div className="relative overflow-x-auto pb-6">
          <div className="flex gap-8 w-max animate-scroll-horizontal">
            {teamMembers.map((member, index) => (
              <div key={index} className="w-56 flex-shrink-0 text-center group">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-clinical-200 to-clinical-400 group-hover:from-clinical-400 group-hover:to-clinical-600 transition-all duration-500 scale-105"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.alt}
                      fill
                      className="object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 192px) 100vw, 192px"
                      priority={index < 2}
                      quality={90}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-clinical-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-clinical-200">
                  <h3 className="font-semibold text-clinical-900 text-lg group-hover:text-clinical-700 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-clinical-700/80">{member.title}</p>
                </div>
              </div>
            ))}
            {teamMembers.map((member, index) => (
              <div key={`duplicate-${index}`} className="w-56 flex-shrink-0 text-center group">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-clinical-200 to-clinical-400 group-hover:from-clinical-400 group-hover:to-clinical-600 transition-all duration-500 scale-105"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.alt}
                      fill
                      className="object-contain rounded-full group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 192px) 100vw, 192px"
                      priority={false}
                      quality={85}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-clinical-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-clinical-200">
                  <h3 className="font-semibold text-clinical-900 text-lg group-hover:text-clinical-700 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-clinical-700/80">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News preview */}
      {news.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 py-20">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-clinical-900 mb-2">{t('home.news')}</h2>
              <p className="text-clinical-700/80">{t('home.news_desc')}</p>
            </div>
            <Link href="/news" className="text-clinical-800 font-semibold text-sm hover:underline flex items-center gap-2">
              {t('button.view_all')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group block rounded-2xl border-2 border-clinical-200 p-6 hover:border-clinical-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <p className="text-xs uppercase tracking-wide text-clinical-600 font-semibold mb-3">{article.category}</p>
                <h3 className="font-display text-xl text-clinical-900 mb-2 group-hover:text-clinical-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-clinical-700/80 line-clamp-3">{article.excerpt}</p>
                <span className="inline-block mt-4 text-sm text-clinical-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  {t('button.learn')} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-horizontal {
          animation: scroll-horizontal 30s linear infinite;
        }
        .animate-scroll-horizontal:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* WebChat Component */}
      <WebChat />
    </>
  );
}