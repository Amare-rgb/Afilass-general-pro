// app/admin/gallery/page.tsx
'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api';
import { GalleryImage } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Plus, 
  X,
  Image as ImageIcon,
  Trash2,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  Play,
  Video,
  FileVideo,
  ExternalLink,
  Edit2,
  Save,
  Eye
} from 'lucide-react';

export default function AdminGalleryPage() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewItem, setPreviewItem] = useState<GalleryImage | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  async function load() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      console.log('📡 Fetching gallery items...');
      const response = await api.get<any>('/gallery');
      console.log('📡 Response:', response);
      
      let imagesData: GalleryImage[] = [];
      if (response) {
        if (Array.isArray(response)) {
          imagesData = response;
        } else if (response.data && Array.isArray(response.data)) {
          imagesData = response.data;
        } else if (response.success && response.data && Array.isArray(response.data)) {
          imagesData = response.data;
        } else if (response.gallery && Array.isArray(response.gallery)) {
          imagesData = response.gallery;
        }
      }
      
      const mappedData = imagesData.map(item => ({
        ...item,
        caption: item.caption || item.description || '',
        type: item.type || 'IMAGE',
        title: item.title || t('admin.gallery.untitled'),
        thumbnail: item.thumbnail || null,
      }));
      
      setImages(mappedData);
      console.log(`✅ Loaded ${mappedData.length} gallery items`);
    } catch (error) {
      console.error('❌ Failed to load gallery:', error);
      setError(t('admin.gallery.error_load'));
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [t]);

  // Update preview when URL changes
  useEffect(() => {
    if (url && isValidUrl(url)) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  }, [url]);

  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  function getEmbedUrl(url: string): string {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  }

  function isEmbeddableVideo(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    if (!isValidUrl(url)) {
      setError(t('admin.gallery.error_invalid_url'));
      setSaving(false);
      return;
    }
    
    try {
      const data = {
        url: url,
        title: title || t('admin.gallery.default_title'),
        caption: caption || '',
        description: caption || '',
        type: type,
        thumbnail: thumbnail || null,
        order: images.length,
        isActive: true
      };
      
      if (editingId) {
        await api.put(`/gallery/${editingId}`, data, true);
        setSuccess(t('admin.gallery.updated'));
        setEditingId(null);
      } else {
        await api.post('/gallery', data, true);
        setSuccess(t('admin.gallery.added'));
      }
      
      setUrl('');
      setCaption('');
      setTitle('');
      setThumbnail('');
      setPreviewUrl('');
      await load();
    } catch (err) {
      console.error('❌ Error saving gallery item:', err);
      setError(err instanceof ApiError ? err.message : t('admin.gallery.error_save'));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: GalleryImage) {
    setEditingId(item.id);
    setUrl(item.url);
    setTitle(item.title || '');
    setCaption(item.caption || '');
    setType(item.type || 'IMAGE');
    setThumbnail(item.thumbnail || '');
    setPreviewUrl(item.url);
    setShowPreviewModal(false);
    document.getElementById('add-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setUrl('');
    setTitle('');
    setCaption('');
    setType('IMAGE');
    setThumbnail('');
    setPreviewUrl('');
    setError('');
  }

  async function remove(id: string) {
    if (!confirm(t('admin.gallery.confirm_delete'))) return;
    try {
      await api.delete(`/gallery/${id}`, true);
      setSuccess(t('admin.gallery.removed'));
      await load();
    } catch (error) {
      console.error('❌ Failed to remove item:', error);
      alert(t('admin.gallery.error_remove'));
    }
  }

  const handleRefresh = async () => {
    await load();
  };

  function openPreview(item: GalleryImage) {
    setPreviewItem(item);
    setShowPreviewModal(true);
    document.body.style.overflow = 'hidden';
  }

  function closePreview() {
    setShowPreviewModal(false);
    setPreviewItem(null);
    document.body.style.overflow = 'auto';
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPreviewModal) {
        closePreview();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPreviewModal]);

  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-clinical-900">{t('admin.gallery.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('admin.gallery.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
            {images.length} {t('admin.gallery.item')}{images.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-clinical-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('admin.gallery.refresh')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Add/Edit Item Form */}
      <form id="add-form" onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 mb-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-clinical-900 text-lg flex items-center gap-2">
            {editingId ? (
              <>
                <Edit2 className="w-5 h-5 text-clinical-600" />
                {t('admin.gallery.edit_item')}
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-clinical-600" />
                {t('admin.gallery.add_item')}
              </>
            )}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              {t('button.cancel')}
            </button>
          )}
        </div>
        
        <p className="text-xs text-gray-500">
          {t('admin.gallery.url_hint')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.gallery.type')} <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'IMAGE' | 'VIDEO')}
              className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors bg-white"
            >
              <option value="IMAGE">📷 {t('admin.gallery.image')}</option>
              <option value="VIDEO">🎬 {t('admin.gallery.video')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.gallery.url')} <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={type === 'VIDEO' ? t('admin.gallery.video_placeholder') : t('admin.gallery.image_placeholder')}
              className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
            />
          </div>
        </div>
        
        {previewUrl && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">{t('admin.gallery.preview')}:</p>
            <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
              {type === 'VIDEO' ? (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  {isEmbeddableVideo(previewUrl) ? (
                    <iframe
                      src={getEmbedUrl(previewUrl)}
                      className="w-full h-full"
                      allowFullScreen
                      title={t('admin.gallery.video_preview')}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={previewUrl}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  )}
                </div>
              ) : (
                <Image 
                  src={previewUrl} 
                  alt={t('admin.gallery.preview')} 
                  fill 
                  className="object-cover"
                  onError={() => setPreviewUrl('')}
                />
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.gallery.title_label')} <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('admin.gallery.title_placeholder')}
              className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.gallery.caption_label')}
            </label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t('admin.gallery.caption_placeholder')}
              className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
            />
          </div>
        </div>
        
        {type === 'VIDEO' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t('admin.gallery.thumbnail_label')}
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder={t('admin.gallery.thumbnail_placeholder')}
              className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              {t('admin.gallery.thumbnail_hint')}
            </p>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !url}
            className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('button.saving')}
              </>
            ) : (
              <>
                {editingId ? (
                  <>
                    <Save className="w-4 h-4" />
                    {t('button.update')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {t('button.add')}
                  </>
                )}
              </>
            )}
          </button>
          {!editingId && (
            <button
              type="button"
              onClick={() => { 
                setUrl(''); 
                setCaption(''); 
                setTitle(''); 
                setThumbnail('');
                setPreviewUrl(''); 
                setError(''); 
              }}
              className="focus-ring rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-2.5 hover:bg-gray-50 transition-colors"
            >
              {t('button.clear')}
            </button>
          )}
        </div>
      </form>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-clinical-700 animate-spin" />
            <p className="text-sm text-clinical-500">{t('admin.gallery.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          {images.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('admin.gallery.no_items')}</h3>
              <p className="text-sm text-gray-500">{t('admin.gallery.no_items_hint')}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((item) => (
                <div key={item.id} className="group relative border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-200">
                  {/* Image/Video Preview */}
                  <div className="relative aspect-[4/3] bg-gray-100 cursor-pointer" onClick={() => openPreview(item)}>
                    {item.type === 'VIDEO' ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        {item.thumbnail ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-clinical-700 ml-1" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            {isEmbeddableVideo(item.url) ? (
                              <iframe
                                src={getEmbedUrl(item.url)}
                                className="w-full h-full pointer-events-none"
                                title={item.title}
                              />
                            ) : (
                              <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-clinical-700 ml-1" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      item.url ? (
                        <Image 
                          src={item.url} 
                          alt={item.title || item.caption || t('admin.gallery.gallery_item')} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                          {t('admin.gallery.invalid_url')}
                        </div>
                      )
                    )}
                    
                    {/* Type Badge */}
                    {item.type === 'VIDEO' && (
                      <div className="absolute top-2 left-2">
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          {t('admin.gallery.video')}
                        </span>
                      </div>
                    )}
                    
                    {/* Preview Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(item);
                        }}
                        className="text-xs bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1 hover:bg-black/90"
                      >
                        <Eye className="w-3 h-3" />
                        {t('admin.gallery.preview')}
                      </button>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.title || t('admin.gallery.untitled')}
                    </p>
                    {item.caption && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.caption}</p>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => startEdit(item)} 
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                          title={t('button.edit')}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => remove(item.id)} 
                          className="text-xs text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                          title={t('button.delete')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {!loading && images.length > 0 && (
        <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
          <span>{t('admin.gallery.showing')} {images.length} {t('admin.gallery.item')}{images.length !== 1 ? 's' : ''}</span>
          <button
            onClick={handleRefresh}
            className="text-clinical-600 hover:text-clinical-800 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {t('button.refresh')}
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closePreview}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">{previewItem.title || t('admin.gallery.untitled')}</h3>
              {previewItem.caption && (
                <p className="text-white/80 text-sm">{previewItem.caption}</p>
              )}
            </div>

            {/* Content */}
            <div className="w-full h-[80vh] flex items-center justify-center">
              {previewItem.type === 'VIDEO' ? (
                <div className="w-full h-full">
                  {isEmbeddableVideo(previewItem.url) ? (
                    <iframe
                      src={getEmbedUrl(previewItem.url)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={previewItem.title}
                    />
                  ) : (
                    <video
                      src={previewItem.url}
                      className="w-full h-full object-contain"
                      controls
                      autoPlay
                      poster={previewItem.thumbnail || undefined}
                    />
                  )}
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={previewItem.url}
                    alt={previewItem.title || previewItem.caption || t('admin.gallery.gallery_image')}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white/60 text-xs">
                    {previewItem.type} • {new Date(previewItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {previewItem.type === 'VIDEO' && isEmbeddableVideo(previewItem.url) && (
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white text-xs flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t('admin.gallery.open_new_tab')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}