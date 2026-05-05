import en from './en.json';
import kh from './kh.json';

export const translations = {
    en,
    kh,
};

export const languages = [
    { code: 'en', name: 'ENG', label: 'English' },
    { code: 'kh', name: 'KH', label: 'ខ្មែរ' },
];

export const t = (key, locale = 'en') => {
    const keys = key.split('.');
    let value = translations[locale];

    for (const k of keys) {
        value = value?.[k];
    }

    return value || key;
};
