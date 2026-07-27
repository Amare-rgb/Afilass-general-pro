// app/admin/news/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { NewsArticle } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Newspaper,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

const emptyForm = { title: '', excerpt: '', content: '', coverImage: '', category: 'News', published: true };

export default function AdminNewsPage() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<any>('/news/admin/all', true);
      let articlesData: NewsArticle[] = [];
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          articlesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          articlesData = response.data.data;
        }
      } else if (Array.isArray(response)) {
        articlesData = response;
      }
      
      setArticles(articlesData);
    } catch (error) {
      console.error('Failed to load news:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function startEdit(article: NewsArticle) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      coverImage: article.coverImage || '',
      category: article.category || 'News',
      published: article.published ?? false,
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        image: form.coverImage,
        category: form.category,
        isPublished: form.published,
        author: 'Admin',
      };

      if (editingId) {
        await api.put(`/news/${editingId}`, payload, true);
        setSuccess(t('admin.news.updated'));
      } else {
        await api.post('/news', payload, true);
        setSuccess(t('admin.news.added'));
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('admin.news.error_save'));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(t('admin.news.confirm_delete'))) return;
    try {
      await api.delete(`/news/${id}`, true);
      setSuccess(t('admin.news.deleted'));
      await load();
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert(t('admin.news.error_delete'));
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-clinical-900">{t('admin.news.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('admin.news.subtitle')}</p>
        </div>
        <button
          onClick={startCreate}
          className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('admin.news.add_article')}
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Add/Edit Form - Centered Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-semibold text-clinical-900 text-xl flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="w-5 h-5 text-clinical-600" />
                    {t('admin.news.edit_article')}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-clinical-600" />
                    {t('admin.news.add_new_article')}
                  </>
                )}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.news.title_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  placeholder={t('admin.news.title_placeholder')}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.news.category_label')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                    placeholder={t('admin.news.category_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.news.cover_image_label')}
                  </label>
                  <input
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                    placeholder={t('admin.news.cover_image_placeholder')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.news.excerpt_label')} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  placeholder={t('admin.news.excerpt_placeholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.news.content_label')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  placeholder={t('admin.news.content_placeholder')}
                />
              </div>
              
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-gray-300 text-clinical-600 focus:ring-clinical-500 w-4 h-4"
                />
                {t('admin.news.published_label')}
              </label>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('button.saving')}
                    </>
                  ) : (
                    editingId ? t('admin.news.update_article') : t('admin.news.add_article')
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 focus-ring rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  {t('button.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-clinical-700 animate-spin" />
            <p className="text-sm text-clinical-500">{t('admin.news.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          {articles.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('admin.news.no_articles')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('admin.news.no_articles_hint')}</p>
              <button
                onClick={startCreate}
                className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
              >
                + {t('admin.news.add_article')}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {articles.map((a) => (
                <div key={a.id} className="p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-clinical-900">
                        {a.title}
                      </h3>
                      {!a.published && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                          {t('admin.news.draft')}
                        </span>
                      )}
                      {a.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-clinical-100 text-clinical-700 font-medium">
                          {a.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{a.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {a.coverImage && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {t('admin.news.has_cover_image')}
                        </span>
                      )}
                      {a.publishedAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(a.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => startEdit(a)} 
                      className="text-sm text-clinical-700 hover:text-clinical-900 font-medium hover:bg-clinical-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      {t('button.edit')}
                    </button>
                    <button 
                      onClick={() => remove(a.id)} 
                      className="text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t('button.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {!loading && articles.length > 0 && (
        <div className="mt-4 text-xs text-gray-400">
          {t('admin.news.showing')} {articles.length} {t('admin.news.article')}{articles.length !== 1 ? 's' : ''}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}