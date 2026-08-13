// components/WebChat.tsx
'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
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

  useEffect(() => {
    // Load Botpress WebChat scripts
    const loadWebChat = () => {
      // Check if already loaded
      if (document.querySelector('script[src*="botpress.cloud/webchat/v5.0/inject.js"]')) {
        setIsLoaded(true);
        return;
      }

      // Load the inject script
      const injectScript = document.createElement('script');
      injectScript.src = 'https://cdn.botpress.cloud/webchat/v5.0/inject.js';
      injectScript.async = true;
      document.body.appendChild(injectScript);

      // Load the config script
      const configScript = document.createElement('script');
      configScript.src = 'https://files.bpcontent.cloud/2026/07/21/07/20260721074931-YXS4TVLS.js';
      configScript.defer = true;
      configScript.async = true;
      document.body.appendChild(configScript);

      // Wait for Botpress to initialize
      const checkBotpress = setInterval(() => {
        if (window.botpressWebChat) {
          setIsLoaded(true);
          clearInterval(checkBotpress);
          
          // Configure the chat
          window.botpressWebChat.configure({
            hostUrl: 'https://cdn.botpress.cloud/webchat/v3.6',
            configUrl: 'https://files.bpcontent.cloud/2026/07/21/07/20260721074931-0IN5IKAL.json',
            hideWhenNotConnected: true,
          });
        }
      }, 500);

      // Cleanup
      setTimeout(() => clearInterval(checkBotpress), 10000);
    };

    loadWebChat();

    // Cleanup
    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress.cloud"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  const toggleChat = () => {
    if (window.botpressWebChat) {
      if (isOpen) {
        window.botpressWebChat.close();
      } else {
        window.botpressWebChat.open();
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-90' 
            : 'bg-clinical-700 hover:bg-clinical-800 hover:scale-110'
        }`}
        aria-label={t('webchat.chat_with_us')}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </button>

      {/* Pulse Animation */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full animate-ping bg-clinical-700/30" />
      )}

      {/* Status Dot */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
        <span className="absolute inset-0 rounded-full animate-pulse bg-green-400" />
      </div>

      {/* Label */}
      {!isOpen && (
        <div className="absolute -top-12 right-0 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          {t('webchat.chat_with_us')}
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
        </div>
      )}
    </div>
  );
}