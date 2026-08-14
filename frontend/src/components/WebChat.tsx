'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

declare global {
  interface Window {
    botpressWebChat: any;
  }
}

export default function WebChat() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Load Botpress WebChat scripts
    const loadWebChat = () => {
      if (document.querySelector('script[src*="botpress.cloud/webchat/v5.0/inject.js"]')) {
        setIsLoaded(true);
        return;
      }

      const injectScript = document.createElement('script');
      injectScript.src = 'https://cdn.botpress.cloud/webchat/v5.0/inject.js';
      injectScript.async = true;
      document.body.appendChild(injectScript);

      const configScript = document.createElement('script');
      configScript.src = 'https://files.bpcontent.cloud/2026/07/21/07/20260721074931-YXS4TVLS.js';
      configScript.defer = true;
      configScript.async = true;
      document.body.appendChild(configScript);

      const checkBotpress = setInterval(() => {
        if (window.botpressWebChat) {
          setIsLoaded(true);
          clearInterval(checkBotpress);
          
          window.botpressWebChat.configure({
            hostUrl: 'https://cdn.botpress.cloud/webchat/v3.6',
            configUrl: 'https://files.bpcontent.cloud/2026/07/21/07/20260721074931-0IN5IKAL.json',
            hideWhenNotConnected: true,
            botName: 'Afilas Support',
            title: t('webchat.chat_with_us') || 'Chat with us',
            header: {
              title: t('webchat.chat_with_us') || 'Chat with us',
              subtitle: t('webchat.online') || 'Online',
            },
            styles: {
              headerBackgroundColor: '#0d9488',
              headerTextColor: '#ffffff',
              botMessageBackgroundColor: '#f1f5f9',
              botMessageTextColor: '#0f172a',
              userMessageBackgroundColor: '#0d9488',
              userMessageTextColor: '#ffffff',
            },
          });

          // ✅ GUARANTEED FORCE OVERRIDE - Inject CSS directly into the shadow DOM
          const forceTealHeader = setInterval(() => {
            const container = document.querySelector('.bp-webchat-container');
            if (container && container.shadowRoot) {
              const style = document.createElement('style');
              style.textContent = `
                .bpw-header-container {
                  background-color: #0d9488 !important;
                  background: #0d9488 !important;
                }
                .bpw-header-title, 
                .bpw-header-subtitle,
                .bpw-header-icon {
                  color: #ffffff !important;
                }
                .bpw-message-bubble.user {
                  background-color: #0d9488 !important;
                  color: #ffffff !important;
                }
              `;
              container.shadowRoot.appendChild(style);
              clearInterval(forceTealHeader);
            }
          }, 300);

          setTimeout(() => clearInterval(forceTealHeader), 15000);
        }
      }, 500);

      setTimeout(() => clearInterval(checkBotpress), 10000);
    };

    loadWebChat();

    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress.cloud"]');
      scripts.forEach(script => script.remove());
    };
  }, [t]);

  const toggleChat = () => {
    if (window.botpressWebChat) {
      if (isOpen) {
        window.botpressWebChat.close();
      } else {
        if (window.botpressWebChat.sendEvent) {
          window.botpressWebChat.sendEvent({ type: 'reset' });
        }
        window.botpressWebChat.open();
        setHasInteracted(true);
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`
            relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center 
            transition-all duration-300 group
            ${isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-90' 
              : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:scale-110 animate-pulse'
            }
          `}
          aria-label={t('webchat.chat_with_us') || 'Chat with us'}
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white transition-transform duration-300" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>

        {!isOpen && (
          <div className="absolute inset-0 rounded-full animate-ping bg-teal-500/30" />
        )}

        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg">
          <span className="absolute inset-0 rounded-full animate-pulse bg-green-400" />
        </div>

        {!isOpen && (
          <div className="absolute -top-14 right-0 bg-slate-800 dark:bg-slate-700 text-white text-xs px-3.5 py-2 rounded-xl whitespace-nowrap shadow-lg transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-teal-400" />
              <span>{t('webchat.chat_with_us') || 'Chat with us'}</span>
            </div>
            <div className="absolute -bottom-1 right-5 transform rotate-45 w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700" />
          </div>
        )}

        {!isLoaded && !isOpen && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 dark:text-slate-500">
            Loading...
          </div>
        )}
      </div>

      <style jsx global>{`
        .bp-webchat-container {
          bottom: 100px !important;
          right: 24px !important;
          z-index: 40 !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        }
        
        .bp-webchat-iframe {
          border-radius: 16px !important;
        }
      `}</style>
    </>
  );
}