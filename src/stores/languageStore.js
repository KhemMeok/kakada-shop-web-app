import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLanguageStore = defineStore('language', () => {
    const locale = ref(localStorage.getItem('locale') || 'en');

    const setLocale = (newLocale) => {
        locale.value = newLocale;
        localStorage.setItem('locale', newLocale);
    };

    const toggleLanguage = () => {
        const newLocale = locale.value === 'en' ? 'kh' : 'en';
        setLocale(newLocale);
    };

    return {
        locale,
        setLocale,
        toggleLanguage,
    };
});
