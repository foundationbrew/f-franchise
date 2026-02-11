import { getTranslation } from './translations.js';
import { updatePhoneMask } from './phoneMask.js';

let currentLang = 'ua';

const supportedLangs = ['ua', 'en'];

export function getCurrentLanguage() {
    return currentLang;
}

export function setCurrentLanguage(lang) {
    currentLang = lang;
}

function getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    return supportedLangs.includes(lang) ? lang : 'ua';
}

function updateURL(lang) {
    const params = new URLSearchParams(window.location.search);
    params.set('lang', lang);
    const newURL = window.location.pathname + '?' + params.toString() + window.location.hash;
    window.history.replaceState(null, '', newURL);
}

export function initLanguageSwitcher() {
    const detectedLang = getLangFromURL();
    setCurrentLanguage(detectedLang);
    updateURL(detectedLang);

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === detectedLang);
    });

    updateLanguage(detectedLang);

    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            langButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            setCurrentLanguage(lang);
            updateURL(lang);
            updateLanguage(lang);
        });
    });
}

export function updateLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const translation = getTranslation(el.dataset.i18n, lang);
        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        }
    });

    updatePhoneMask(lang);
}