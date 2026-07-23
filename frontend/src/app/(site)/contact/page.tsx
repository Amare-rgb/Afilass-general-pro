// app/contact/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.post('/contact', form);
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError(err instanceof ApiError ? err.message : t('contact.error_general'));
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-14">
      {/* Contact Information - Outside Card */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600 font-semibold mb-4">{t('contact.title')}</p>
        <h1 className="font-display text-4xl text-clinical-900 mb-6">{t('contact.subtitle')}</h1>
        <ul className="space-y-3 text-clinical-800/90">
          <li><strong>{t('contact.address_label')}:</strong> {t('contact.address')}</li>
          <li><strong>{t('contact.emergency_label')}:</strong> 8560 or +251-58-320-4167</li>
          <li><strong>{t('contact.phone_label')}:</strong> +251-58-320-1998 / 4167</li>
          <li><strong>{t('contact.email_label')}:</strong> info@afilaspmms.com</li>
          <li><strong>{t('contact.hours_label')}:</strong> {t('contact.open')}</li>
        </ul>
      </div>

      {/* Form Card - Only the form inputs in a card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-clinical-900 mb-4">{t('contact.send_message')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder={t('contact.name')}
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-clinical-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition"
          />
          <input
            type="email"
            placeholder={t('contact.email_label')}
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-clinical-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition"
          />
          <input
            type="text"
            placeholder={t('contact.subject')}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full rounded-lg border border-clinical-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition"
          />
          <textarea
            placeholder={t('contact.message')}
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg border border-clinical-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-clay-500 focus:border-transparent outline-none transition resize-none"
          />

          {status === 'error' && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          {status === 'sent' && (
            <p className="text-sm text-clinical-700 bg-green-50 rounded-lg px-3 py-2">✓ {t('contact.success')}</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full rounded-lg bg-clay-500 hover:bg-clay-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 transition-colors text-sm"
          >
            {status === 'sending' ? t('button.sending') : t('contact.send')}
          </button>
        </form>
      </div>
    </section>
  );
}