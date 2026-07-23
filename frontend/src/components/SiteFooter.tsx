// components/SiteFooter.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-clinical-900 text-clinical-100 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clay-500 text-parchment font-display text-lg">
              A
            </span>
            <span className="font-display text-lg text-parchment">{t('footer.hospital')}</span>
          </div>
          <p className="text-sm text-clinical-300 leading-relaxed">
            {t('footer.desc')}
          </p>
        </div>

        <div>
          <h3 className="text-parchment font-semibold text-sm uppercase tracking-wide mb-4">{t('footer.visit')}</h3>
          <ul className="text-sm text-clinical-300 space-y-2 leading-relaxed">
            <li>{t('footer.address')}</li>
            <li>{t('footer.tel')}</li>
            <li>{t('footer.email')}</li>
            <li>{t('footer.open')}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-parchment font-semibold text-sm uppercase tracking-wide mb-4">{t('footer.explore')}</h3>
          <ul className="text-sm text-clinical-300 space-y-2">
            <li><Link href="/departments" className="hover:text-parchment transition-colors">{t('nav.departments')}</Link></li>
            <li><Link href="/doctors" className="hover:text-parchment transition-colors">{t('nav.doctors')}</Link></li>
            <li><Link href="/news" className="hover:text-parchment transition-colors">{t('nav.news')}</Link></li>
            <li><Link href="/appointment" className="hover:text-parchment transition-colors">{t('footer.book_appointment')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-parchment font-semibold text-sm uppercase tracking-wide mb-4">{t('footer.admin')}</h3>
          <ul className="text-sm text-clinical-300 space-y-2">
            <li><Link href="/admin/login" className="hover:text-parchment transition-colors">{t('footer.staff_sign_in')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-clinical-800 py-6 text-center text-xs text-clinical-400">
        © {new Date().getFullYear()} {t('footer.copyright')}
      </div>
    </footer>
  );
}