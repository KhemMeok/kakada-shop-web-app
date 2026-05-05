<script setup>
import { ref, computed, watch } from 'vue';
import { useProductStore } from '@/src/stores/productStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import { t } from '@/src/locales/index';
import ProductCard from '@/src/components/ProductCard.vue';
import { Search } from 'lucide-vue-next';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const productStore = useProductStore();
const languageStore = useLanguageStore();
const modules = [Autoplay, Pagination];

// Local sort state for search results
const searchSortBy = ref('name');
</script>

<template>
  <div class="space-y-8 pb-6">
    <!-- Promotional Banner (Hidden when searching) -->
    <section v-if="!productStore.searchQuery"
      class="relative h-48 rounded-lg overflow-hidden bg-stone-900 text-white flex items-center px-8 shadow-xl animate-in fade-in duration-500"
      aria-labelledby="promo-title">
      <div class="relative z-10 max-w-[60%]">
        <h2 id="promo-title" class="text-2xl font-bold leading-tight mb-2 serif">{{ t('home.title',
          languageStore.locale) }}</h2>
        <p class="text-xs text-stone-300 mb-4 font-mono uppercase tracking-widest">{{ t('home.subtitle',
          languageStore.locale) }}</p>
        <button
          class="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-md active:scale-95 transition-transform uppercase tracking-wider"
          :aria-label="`${t('home.shopBtn', languageStore.locale)}`">
          {{ t('home.shopBtn', languageStore.locale) }}
        </button>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-0"></div>
      <img src="https://picsum.photos/seed/skincare-promo/800/400" alt="Promo"
        class="absolute inset-0 w-full h-full object-cover opacity-60" referrerpolicy="no-referrer" />
    </section>

    <!-- Featured Products Carousel (Hidden when searching) -->
    <section v-if="!productStore.searchQuery" class="space-y-4 animate-in fade-in duration-500"
      aria-labelledby="featured-title">
      <div class="flex items-center justify-between px-2">
        <h3 id="featured-title" class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ t('home.featured',
          languageStore.locale) }}</h3>
        <RouterLink to="/shop"
          class="text-xs font-bold text-emerald-600 uppercase tracking-widest active:opacity-70 transition-opacity"
          :aria-label="`${t('home.viewAll', languageStore.locale)}`">{{ t('home.viewAll', languageStore.locale) }}
        </RouterLink>
      </div>

      <Swiper :modules="modules" :slides-per-view="1.2" :space-between="16" :pagination="{ clickable: true }"
        :autoplay="{ delay: 3000, disableOnInteraction: false }" class="featured-swiper !pb-10">
        <SwiperSlide v-for="product in productStore.featuredProducts" :key="product.id">
          <ProductCard :product="product" />
        </SwiperSlide>
      </Swiper>
    </section>

    <!-- Search Results (Only shown when searching) -->
    <section v-if="productStore.searchQuery" class="space-y-4 animate-in fade-in duration-500" role="status"
      aria-live="polite">
      <div class="flex items-center justify-between px-2 gap-3">
        <h3 class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ t('home.searchResults',
          languageStore.locale) }}</h3>
        <select v-model="searchSortBy"
          class="px-3 py-2 border border-stone-200 rounded-md text-xs font-bold uppercase tracking-widest text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="name">{{ t('shop.nameAZ', languageStore.locale) }}</option>
          <option value="name-desc">{{ t('shop.nameZA', languageStore.locale) }}</option>
          <option value="price-asc">{{ t('shop.priceLowHigh', languageStore.locale) }}</option>
          <option value="price-desc">{{ t('shop.priceHighLow', languageStore.locale) }}</option>
          <option value="rating-desc">{{ t('shop.ratingHigh', languageStore.locale) }}</option>
        </select>
      </div>

      <div v-if="productStore.filteredProducts.length > 0" class="space-y-4">
        <!-- Apply sorting to search results -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProductCard v-for="product in (() => {
            const sorted = [...productStore.filteredProducts];
            switch (searchSortBy) {
              case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
              case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
              case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
              case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
              case 'rating-desc':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            }
            return sorted;
          })()" :key="product.id" :product="product" />
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 space-y-4">
        <div class="w-12 h-12 bg-stone-100 rounded-md flex items-center justify-center text-stone-300"
          aria-hidden="true">
          <Search :size="24" />
        </div>
        <p class="text-sm font-bold text-stone-900 serif">{{ t('home.noProducts', languageStore.locale) }}</p>
        <button @click="productStore.searchQuery = ''"
          class="text-xs font-bold text-emerald-600 uppercase tracking-widest active:opacity-70"
          :aria-label="`${t('home.clearSearch', languageStore.locale)}`">
          {{ t('home.clearSearch', languageStore.locale) }}
        </button>
      </div>
    </section>

    <!-- Shop Info Bottom Panel -->
    <footer
      class="pt-12 pb-8 border-t border-stone-200 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="grid grid-cols-1 gap-8 px-2">
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">The Studio</h3>
          <p class="text-sm text-stone-600 leading-relaxed">
            Founded by <span class="text-stone-900 font-semibold">Kakada Co.</span>, our shop is dedicated to premium
            products
            with exceptional service and quality that celebrate your lifestyle.
          </p>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">Connect</h3>
          <div class="space-y-1.5">
            <p class="text-sm text-stone-900 font-medium">hello@kakadashop.com</p>
            <p class="text-sm text-stone-600">+1 (555) 892-0122</p>
            <p class="text-sm text-stone-600">Premier Plaza, Suite 100<br>Phnom Penh, Cambodia 12250</p>
          </div>
        </div>

        <div class="pt-8 flex flex-col items-center gap-4 text-center">
          <div class="text-2xl font-bold tracking-tighter text-stone-900">
            KAKADA<span class="text-emerald-600">.</span>
          </div>
          <p class="text-[10px] text-stone-400 font-mono uppercase tracking-[0.15em]">
            &copy; 2026 Kakada Shop Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.featured-swiper .swiper-pagination-bullet-active {
  background: #059669;
}

.featured-swiper .swiper-pagination {
  bottom: 0 !important;
}

.serif {
  font-family: var(--font-serif);
}
</style>
