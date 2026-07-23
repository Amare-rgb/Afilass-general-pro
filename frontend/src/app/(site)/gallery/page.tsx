// app/(site)/gallery/page.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { GalleryImage } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Loader2, 
  Image as ImageIcon, 
  Calendar, 
  Play, 
  Video, 
  X,
  Maximize2,
  Minimize2,
  ExternalLink
} from 'lucide-react';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('📡 Fetching gallery images...');
        
        const response = await api.get<any>('/gallery');
        console.log('📡 Gallery response:', response);
        
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
          } else {
            for (const key in response) {
              if (Array.isArray(response[key])) {
                imagesData = response[key];
                break;
              }
            }
          }
        }
        
        // Normalize data
        const normalizedData = imagesData.map(item => ({
          ...item,
          type: item.type || 'IMAGE',
          title: item.title || 'Untitled',
          caption: item.caption || item.description || '',
        }));
        
        setImages(normalizedData);
        console.log(`✅ Loaded ${normalizedData.length} gallery items`);
      } catch (error) {
        console.error('❌ Failed to load gallery:', error);
        setError(t('gallery.error_load'));
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [t]);

  const openModal = (item: GalleryImage) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
    if (item.type === 'VIDEO' && videoRef.current) {
      setTimeout(() => {
        videoRef.current?.play();
      }, 300);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsFullscreen(false);
    document.body.style.overflow = 'auto';
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedItem(null);
  };

  const toggleFullscreen = () => {
    if (!modalRef.current) return;
    
    if (!document.fullscreenElement) {
      modalRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isVideoFile = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isEmbeddableVideo = (url: string) => {
    return url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com') ||
           url.includes('youtube-nocookie.com');
  };

  const getEmbedUrl = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
    }

    const shortsRegex = /youtube\.com\/shorts\/([^&\s]+)/;
    const shortsMatch = url.match(shortsRegex);
    if (shortsMatch) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&rel=0`;
    }

    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    return url;
  };

  const renderMedia = (item: GalleryImage) => {
    if (item.type === 'VIDEO' || isVideoFile(item.url) || isEmbeddableVideo(item.url)) {
      if (isEmbeddableVideo(item.url)) {
        return (
          <iframe
            src={getEmbedUrl(item.url)}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={item.title || 'Video'}
          />
        );
      } else {
        return (
          <video
            ref={videoRef}
            src={item.url}
            className="w-full h-full object-contain"
            controls
            playsInline
            poster={item.thumbnail || undefined}
            controlsList="nodownload"
          />
        );
      }
    } else {
      return (
        <Image
          src={item.url}
          alt={item.title || item.caption || 'Gallery image'}
          fill
          className="object-contain"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      );
    }
  };

  const renderThumbnail = (item: GalleryImage) => {
    const isVideo = item.type === 'VIDEO' || isVideoFile(item.url) || isEmbeddableVideo(item.url);
    
    if (isVideo) {
      return (
        <div className="w-full h-full bg-gray-900 relative">
          {item.thumbnail ? (
            <div className="relative w-full h-full">
              <Image
                src={item.thumbnail}
                alt={item.title || 'Video thumbnail'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-clinical-700 ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
              <Video className="w-12 h-12 text-white/60 mb-2" />
              <span className="text-white/60 text-xs">{t('gallery.video')}</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
              <Video className="w-3 h-3" />
              {t('gallery.video')}
            </span>
          </div>
        </div>
      );
    } else {
      return item.url ? (
        <Image 
          src={item.url} 
          alt={item.title || item.caption || 'Gallery image'} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const div = document.createElement('div');
              div.className = 'w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm';
              div.textContent = t('gallery.image_not_available');
              parent.appendChild(div);
            }
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          {t('gallery.image_not_available')}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="flex justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-clinical-700 animate-spin" />
            <p className="text-sm text-clinical-500">{t('gallery.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-5 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600 font-semibold mb-4">{t('gallery.title')}</p>
      <h1 className="font-display text-4xl text-clinical-900 mb-4">{t('gallery.heading')}</h1>
      <p className="text-gray-600 mb-12">{t('gallery.description')}</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            {t('gallery.retry')}
          </button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-clinical-600 text-sm">{t('gallery.empty')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('gallery.check_back')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item) => (
            <div
              key={item.id}
              onClick={() => openModal(item)}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {renderThumbnail(item)}
              
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-medium text-sm truncate">{item.title || t('gallery.untitled')}</h3>
                {item.caption && (
                  <p className="text-white/80 text-xs truncate">{item.caption}</p>
                )}
                <p className="text-white/60 text-xs flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {images.length > 0 && (
        <div className="mt-6 text-xs text-gray-400 text-center">
          {t('gallery.showing')} {images.length} {t('gallery.item')}{images.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Modal for full view */}
      {isModalOpen && selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className={`relative max-w-6xl w-full bg-black rounded-lg overflow-hidden ${
              isFullscreen ? 'max-w-full h-screen rounded-none' : 'max-h-[90vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controls Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={closeModal}
                  className="text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="text-white">
                  <h3 className="font-medium text-sm">{selectedItem.title || t('gallery.untitled')}</h3>
                  {selectedItem.caption && (
                    <p className="text-white/60 text-xs">{selectedItem.caption}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
                {selectedItem.type === 'VIDEO' && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="w-full h-[80vh] flex items-center justify-center">
              {renderMedia(selectedItem)}
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white/60 text-xs">
                    {selectedItem.type || 'IMAGE'} • {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {selectedItem.type === 'VIDEO' && (
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    {t('gallery.click_play')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}