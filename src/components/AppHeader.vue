<script setup>
import { ref, watch, computed } from 'vue';
import { ShoppingCart, Search, Menu, X, History, Trash2, Home, ShoppingBag, Heart, User, ChevronRight, Globe } from 'lucide-vue-next';
import { useCartStore } from '@/src/stores/cartStore';
import { useProductStore } from '@/src/stores/productStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import { RouterLink, useRoute } from 'vue-router';
import { t, languages } from '@/src/locales/index';

const cartStore = useCartStore();
const productStore = useProductStore();
const languageStore = useLanguageStore();
const route = useRoute();

const isSearchOpen = ref(false);
const isMenuOpen = ref(false);
const isLanguageOpen = ref(false);
const searchInput = ref(null);

const navItems = [
  { name: 'header.home', path: '/', icon: Home },
  { name: 'header.shop', path: '/shop', icon: ShoppingBag },
  { name: 'header.favorites', path: '/favorites', icon: Heart },
  { name: 'header.profile', path: '/profile', icon: User },
];

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value) {
    isMenuOpen.value = false;
    setTimeout(() => searchInput.value?.focus(), 100);
  } else {
    productStore.searchQuery = '';
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    isSearchOpen.value = false;
    isLanguageOpen.value = false;
  }
};

const toggleLanguage = () => {
  isLanguageOpen.value = !isLanguageOpen.value;
  if (isLanguageOpen.value) {
    isMenuOpen.value = false;
    isSearchOpen.value = false;
  }
};

const changeLanguage = (locale) => {
  languageStore.setLocale(locale);
  isLanguageOpen.value = false;
};

const handleSearchSubmit = () => {
  if (productStore.searchQuery.trim()) {
    productStore.addRecentSearch(productStore.searchQuery);
    searchInput.value?.blur();
  }
};

const selectRecentSearch = (query) => {
  productStore.searchQuery = query;
  productStore.addRecentSearch(query);
  searchInput.value?.blur();
};

const categories = computed(() => {
  const cats = productStore.products.map(p => p.category);
  return [...new Set(cats)].sort();
});

const selectCategory = (cat) => {
  productStore.searchQuery = cat;
  isMenuOpen.value = false;
};
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50 flex items-center justify-between px-4 sm:px-6">
    <div v-if="!isSearchOpen"
      class="flex items-center justify-between w-full animate-in fade-in slide-in-from-top-2 duration-300">
      <div class="flex items-center gap-3">
        <button @click="toggleMenu" class="p-2 -ml-2 text-stone-600 active:scale-95 transition-transform"
          :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'" :aria-expanded="isMenuOpen" aria-controls="main-menu">
          <Menu v-if="!isMenuOpen" :size="24" aria-hidden="true" />
          <X v-else :size="24" aria-hidden="true" />
        </button>
        <RouterLink to="/" class="text-2xl font-bold tracking-tight text-stone-900" aria-label="Kakada Shop Home">
          KAKADA
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <button @click="toggleSearch" class="p-2 text-stone-600 active:scale-95 transition-transform"
          aria-label="Search products" :aria-expanded="isSearchOpen">
          <Search :size="22" aria-hidden="true" />
        </button>
        <button @click="toggleLanguage" class="p-2 text-stone-600 active:scale-95 transition-transform relative"
          :aria-label="t('header.language', languageStore.locale)" :aria-expanded="isLanguageOpen">
          <Globe :size="22" aria-hidden="true" />
        </button>
        <RouterLink to="/cart" class="relative p-2 text-stone-600 active:scale-95 transition-transform"
          :aria-label="t('header.cart', languageStore.locale)">
          <ShoppingCart :size="22" aria-hidden="true" />
          <span v-if="cartStore.totalItems > 0"
            class="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-sm"
            aria-live="polite">
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>
      </div>
    </div>

    <div v-else class="flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div class="flex items-center gap-3 w-full h-16">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" :size="18" aria-hidden="true" />
          <input ref="searchInput" v-model="productStore.searchQuery" type="text"
            :placeholder="t('header.search', languageStore.locale)" aria-label="Search products"
            @keyup.enter="handleSearchSubmit"
            class="w-full h-10 pl-10 pr-4 bg-stone-100 border-none rounded-md text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
        </div>
        <button @click="toggleSearch" class="p-2 text-stone-600 active:scale-95 transition-transform"
          aria-label="Close search">
          <X :size="22" aria-hidden="true" />
        </button>
      </div>

      <div v-if="!productStore.searchQuery && productStore.recentSearches.length > 0"
        class="absolute top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-300">
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <History :size="16" class="text-stone-400" />
              <h4 class="text-xs font-bold uppercase tracking-widest text-stone-400">{{ t('header.recentSearches',
                languageStore.locale) }}</h4>
            </div>
            <button @click="productStore.clearRecentSearches()"
              class="text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <Trash2 :size="14" />
              {{ t('header.clearAll', languageStore.locale) }}
            </button>
          </div>

          <div class="flex flex-wrap gap-2">
            <button v-for="search in productStore.recentSearches" :key="search" @click="selectRecentSearch(search)"
              class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-sm font-medium transition-colors active:scale-95">
              {{ search }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Compact Dropdown Menu -->
    <Transition name="fade-scale">
      <div v-if="isMenuOpen" class="fixed inset-0 z-[60]">
        <!-- Backdrop -->
        <div @click="isMenuOpen = false" class="absolute inset-0 bg-stone-900/10 backdrop-blur-[2px]"></div>

        <div id="main-menu"
          class="absolute top-16 left-4 w-48 bg-white rounded-lg shadow-2xl border border-stone-100 overflow-hidden origin-top-left"
          role="menu">
          <div class="p-1.5 space-y-0.5">
            <RouterLink v-for="item in navItems" :key="item.name" :to="item.path" @click="isMenuOpen = false"
              class="flex items-center gap-2.5 p-2 rounded-md transition-all group"
              :class="route.path === item.path ? 'bg-emerald-50 text-emerald-600' : 'text-stone-700 hover:bg-stone-50'"
              role="menuitem">
              <div class="w-8 h-8 rounded flex items-center justify-center transition-all"
                :class="route.path === item.path ? 'bg-emerald-100' : 'bg-stone-100 group-hover:bg-stone-200'"
                aria-hidden="true">
                <component :is="item.icon" :size="16" :stroke-width="route.path === item.path ? 2.5 : 2" />
              </div>
              <span class="font-bold serif tracking-tight text-sm">{{ t(item.name, languageStore.locale) }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Language Switcher Menu -->
    <Transition name="fade-scale">
      <div v-if="isLanguageOpen" class="fixed inset-0 z-[60]">
        <!-- Backdrop -->
        <div @click="isLanguageOpen = false" class="absolute inset-0 bg-stone-900/10 backdrop-blur-[2px]"></div>

        <div id="language-menu"
          class="absolute top-16 right-4 w-40 bg-white rounded-lg shadow-2xl border border-stone-100 overflow-hidden origin-top-right"
          role="menu">
          <div class="p-1.5 space-y-0.5">
            <button v-for="lang in languages" :key="lang.code" @click="changeLanguage(lang.code)"
              class="w-full flex items-center gap-3 p-2 rounded-md transition-all group text-left"
              :class="languageStore.locale === lang.code ? 'bg-emerald-50 text-emerald-600' : 'text-stone-700 hover:bg-stone-50'"
              role="menuitem">
              <div class="w-8 h-8 rounded flex items-center justify-center transition-all"
                :class="languageStore.locale === lang.code ? 'bg-emerald-100' : 'bg-stone-100 group-hover:bg-stone-200'"
                aria-hidden="true">
                <Globe :size="16" :stroke-width="languageStore.locale === lang.code ? 2.5 : 2" />
              </div>
              <div class="flex flex-col">
                <span class="font-bold serif tracking-tight text-sm">{{ lang.label }}</span>
                <span class="text-xs text-stone-400">{{ lang.name }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.serif {
  font-family: var(--font-serif);
}
</style>
