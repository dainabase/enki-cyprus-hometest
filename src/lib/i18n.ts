import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import el from '../locales/el.json';
import ru from '../locales/ru.json';
import es from '../locales/es.json';
import it from '../locales/it.json';
import de from '../locales/de.json';
import nl from '../locales/nl.json';

// Configuration
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      el: { translation: el },
      ru: { translation: ru },
      es: { translation: es },
      it: { translation: it },
      de: { translation: de },
      nl: { translation: nl }
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;