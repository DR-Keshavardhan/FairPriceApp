// translate.js
export const translatePage = (language) => {
    if (window.google && window.google.translate) {
      const gtConstEvalStartTime = new Date(); // Required by Google Translate script
  
      const translateElement = new window.google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: language },
        'google_translate_element'
      );
  
      window.google.translate.TranslateElement.prototype.showBanner = (a, c) => {
        const pageLang = document.documentElement.lang;
        if (pageLang !== language) {
          const url = new URL(window.location.href);
          url.searchParams.set('hl', language);
          window.location.href = url.toString();
        }
      };
  
      translateElement.showBanner(translateElement, gtConstEvalStartTime);
    }
  };
  