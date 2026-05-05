<script setup>
import { Heart, ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useLanguageStore } from '@/src/stores/languageStore';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { useProductStore } from '@/src/stores/productStore';
import { t } from '@/src/locales/index';
import ProductCard from '@/src/components/ProductCard.vue';

const router = useRouter();
const languageStore = useLanguageStore();
const favoritesStore = useFavoritesStore();
const productStore = useProductStore();

// Local sort state for favorites
const favoritesSortBy = ref('name');

const favoriteProducts = computed(() => {
  const favorites = productStore.products.filter(product => favoritesStore.isFavorited(product.id));

  // Apply sorting
  const sorted = [...favorites];
  switch (favoritesSortBy.value) {
    case 'name-asc':
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
});
</script>

<template>
  <div class="space-y-8 pb-10">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <button @click="router.back()"
          class="p-2 bg-white border border-stone-200 rounded-md text-stone-900 active:scale-90 transition-transform"
          :aria-label="t('cart.goBack', languageStore.locale)">
          <ArrowLeft :size="20" aria-hidden="true" />
        </button>
        <h1 class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ t('favorites.title', languageStore.locale)
          }}</h1>
      </div>
      <select v-if="favoriteProducts.length > 0" v-model="favoritesSortBy"
        class="px-3 py-2 border border-stone-200 rounded-md text-xs font-bold uppercase tracking-widest text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
        <option value="name-asc">{{ t('shop.nameAZ', languageStore.locale) }}</option>
        <option value="name-desc">{{ t('shop.nameZA', languageStore.locale) }}</option>
        <option value="price-asc">{{ t('shop.priceLowHigh', languageStore.locale) }}</option>
        <option value="price-desc">{{ t('shop.priceHighLow', languageStore.locale) }}</option>
        <option value="rating-desc">{{ t('shop.ratingHigh', languageStore.locale) }}</option>
      </select>
    </div>

    <!-- Favorites Grid -->
    <div v-if="favoriteProducts.length > 0" class="space-y-6">
      <div class="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
        <ProductCard v-for="product in favoriteProducts" :key="product.id" :product="product" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center h-[50vh] space-y-6">
      <div class="w-24 h-24 bg-stone-100 rounded-md flex items-center justify-center text-stone-300">
        <Heart :size="48" />
      </div>
      <div class="text-center space-y-2">
        <p class="text-2xl font-bold text-stone-900 serif">{{ t('favorites.empty', languageStore.locale) }}</p>
        <p class="text-sm text-stone-400 font-mono uppercase tracking-widest">{{ t('favorites.emptySubtitle',
          languageStore.locale) }}</p>
      </div>
      <RouterLink to="/shop"
        class="px-8 py-4 bg-stone-900 text-white rounded-md font-bold uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-stone-900/10">
        Go Shopping
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.serif {
  font-family: var(--font-serif);
}
</style>
