// Travylway Multi-Language System
// Supports: English, Spanish, Japanese, German, French, Chinese

(function() {
  'use strict';

  // Language configuration
  const LANGUAGES = {
    'en': { name: 'English', flag: '🇺🇸', code: 'en' },
    'es': { name: 'Español', flag: '🇪🇸', code: 'es' },
    'ja': { name: '日本語', flag: '🇯🇵', code: 'ja' },
    'de': { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
    'fr': { name: 'Français', flag: '🇫🇷', code: 'fr' },
    'zh': { name: '中文', flag: '🇨🇳', code: 'zh' }
  };

  // Default language
  let currentLanguage = 'en';

  // Get saved language or detect from browser
  function detectLanguage() {
    // Check localStorage first
    const saved = localStorage.getItem('travylway_language');
    if (saved && LANGUAGES[saved]) {
      return saved;
    }

    // Auto-detect from browser
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Map browser language to supported languages
    if (LANGUAGES[langCode]) {
      return langCode;
    }

    // Default to English
    return 'en';
  }

  // Save language preference
  function saveLanguage(lang) {
    localStorage.setItem('travylway_language', lang);
  }

  // Create language selector
  function createLanguageSelector() {
    const selector = document.createElement('div');
    selector.id = 'language-selector';
    selector.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 8px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      max-width: 300px;
    `;

    Object.keys(LANGUAGES).forEach(code => {
      const lang = LANGUAGES[code];
      const btn = document.createElement('button');
      btn.textContent = `${lang.flag}`;
      btn.title = lang.name;
      btn.style.cssText = `
        background: ${code === currentLanguage ? '#667eea' : 'transparent'};
        border: 2px solid ${code === currentLanguage ? '#667eea' : '#e2e8f0'};
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.2s;
      `;
      
      btn.addEventListener('click', () => {
        switchLanguage(code);
      });

      btn.addEventListener('mouseenter', () => {
        if (code !== currentLanguage) {
          btn.style.borderColor = '#667eea';
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (code !== currentLanguage) {
          btn.style.borderColor = '#e2e8f0';
        }
      });

      selector.appendChild(btn);
    });

    document.body.appendChild(selector);
  }

  // Switch language
  function switchLanguage(lang) {
    if (!LANGUAGES[lang]) return;
    
    currentLanguage = lang;
    saveLanguage(lang);
    
    // Update button styles
    document.querySelectorAll('#language-selector button').forEach((btn, index) => {
      const code = Object.keys(LANGUAGES)[index];
      if (code === lang) {
        btn.style.background = '#667eea';
        btn.style.borderColor = '#667eea';
      } else {
        btn.style.background = 'transparent';
        btn.style.borderColor = '#e2e8f0';
      }
    });

    // Translate page
    translatePage(lang);
  }

  // Translate all elements with data-i18n attribute
  function translatePage(lang) {
    if (!window.translations || !window.translations[lang]) {
      console.warn(`No translations found for language: ${lang}`);
      return;
    }

    const translations = window.translations[lang];

    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        element.placeholder = translations[key];
      }
    });

    // Translate values (for buttons)
    document.querySelectorAll('[data-i18n-value]').forEach(element => {
      const key = element.getAttribute('data-i18n-value');
      if (translations[key]) {
        element.value = translations[key];
      }
    });

    // Translate titles
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      if (translations[key]) {
        element.title = translations[key];
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }

  // Initialize on page load
  function init() {
    // Detect language
    currentLanguage = detectLanguage();
    
    // Create selector
    createLanguageSelector();
    
    // Apply translations
    setTimeout(() => {
      translatePage(currentLanguage);
    }, 100);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to window for external access
  window.TravylwayI18n = {
    getCurrentLanguage: () => currentLanguage,
    switchLanguage: switchLanguage,
    getSupportedLanguages: () => LANGUAGES
  };

})();
