<script setup>
import { ref, computed, watch } from 'vue';
import { useProductStore } from '@/src/stores/productStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import { t } from '@/src/locales/index';
import ProductCard from '@/src/components/ProductCard.vue';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-vue-next';

const productStore = useProductStore();
const languageStore = useLanguageStore();

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => {
  return Math.ceil(productStore.filteredProducts.length / itemsPerPage);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return productStore.filteredProducts.slice(start, end);
});

// Filter modal state
const showFilters = ref(false);

// Local filter state for UI (synced with store)
const localCategory = ref(productStore.selectedCategory.value);
const localPriceRange = ref(Array.isArray(productStore.priceRange.value) ? [...productStore.priceRange.value] : [0, 100]);
const localMinRating = ref(productStore.minRating.value);
const localInStockOnly = ref(productStore.inStockOnly.value);
const localFeaturedOnly = ref(productStore.featuredOnly.value);
const localSortBy = ref(productStore.sortBy.value);

// Reset to first page when search or filters change
watch(() => productStore.searchQuery, () => {
  currentPage.value = 1;
});

watch(() => productStore.filteredProducts, () => {
  currentPage.value = 1;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const applyFilters = () => {
  productStore.setCategory(localCategory.value);
  productStore.setPriceRange(localPriceRange.value[0], localPriceRange.value[1]);
  productStore.setMinRating(localMinRating.value);
  productStore.setInStockOnly(localInStockOnly.value);
  productStore.setFeaturedOnly(localFeaturedOnly.value);
  productStore.setSortBy(localSortBy.value);
  showFilters.value = false;
  currentPage.value = 1;
};

const resetFilters = () => {
  productStore.clearAllFilters();
  localCategory.value = '';
  localPriceRange.value = [0, 100];
  localMinRating.value = 0;
  localInStockOnly.value = false;
  localFeaturedOnly.value = false;
  localSortBy.value = 'name';
  currentPage.value = 1;
};

const closeFilters = () => {
  showFilters.value = false;
  // Reset local state to match store
  localCategory.value = productStore.selectedCategory.value;
  localPriceRange.value = Array.isArray(productStore.priceRange.value) ? [...productStore.priceRange.value] : [0, 100];
  localMinRating.value = productStore.minRating.value;
  localInStockOnly.value = productStore.inStockOnly.value;
  localFeaturedOnly.value = productStore.featuredOnly.value;
  localSortBy.value = productStore.sortBy.value;
};
</script>

<template>
  <div class="space-y-8 pb-10">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ t('shop.title', languageStore.locale) }}
      </h1>
      <button @click="showFilters = true"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-md text-xs font-bold uppercase tracking-widest text-stone-600 active:bg-stone-50 transition-colors"
        :aria-label="t('shop.filter', languageStore.locale)">
        <Filter :size="14" aria-hidden="true" />
        {{ t('shop.filter', languageStore.locale) }}
      </button>
    </div>

    <div v-if="paginatedProducts.length > 0" class="space-y-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-500" role="list">
        <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" role="listitem" />
      </div>

      <!-- Pagination Controls -->
      <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-6 border-t border-stone-100"
        aria-label="Pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
          class="p-2 rounded-md border border-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
          aria-label="Previous page">
          <ChevronLeft :size="20" aria-hidden="true" />
        </button>

        <div class="flex items-center gap-1">
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            class="w-10 h-10 rounded-md text-sm font-bold transition-all" :class="currentPage === page
              ? 'bg-stone-900 text-white shadow-lg'
              : 'text-stone-500 hover:bg-stone-100'" :aria-label="`Page ${page}`"
            :aria-current="currentPage === page ? 'page' : undefined">
            {{ page }}
          </button>
        </div>

        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="p-2 rounded-md border border-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-50 transition-colors"
          aria-label="Next page">
          <ChevronRight :size="20" aria-hidden="true" />
        </button>
      </nav>
    </div>

    <!-- No Results State -->
    <div v-else class="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-500"
      role="status" aria-live="polite">
      <div class="w-16 h-16 bg-stone-100 rounded-md flex items-center justify-center text-stone-300">
        <Search :size="32" aria-hidden="true" />
      </div>
      <div class="text-center space-y-1">
        <p class="text-sm font-bold text-stone-900 serif">{{ t('shop.noProducts', languageStore.locale) }}</p>
        <p class="text-xs text-stone-400 font-mono uppercase tracking-widest">Try adjusting your filters or search</p>
      </div>
      <button @click="resetFilters"
        class="text-xs font-bold text-emerald-600 uppercase tracking-widest active:opacity-70"
        aria-label="Clear all filters">
        {{ t('shop.clearFilters', languageStore.locale) }}
      </button>
    </div>

    <!-- Filter Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFilters" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="closeFilters" />
      </Transition>
      <Transition name="slide-up">
        <div v-if="showFilters"
          class="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-stone-900 serif">{{ t('shop.filterBy', languageStore.locale) }}</h2>
              <button @click="closeFilters" class="p-2 hover:bg-stone-100 rounded-md transition-colors"
                :aria-label="t('shop.filter', languageStore.locale)">
                <X :size="20" aria-hidden="true" />
              </button>
            </div>

            <!-- Category Filter -->
            <div class="space-y-3">
              <label class="text-sm font-bold text-stone-900 uppercase tracking-widest">{{ t('shop.category',
                languageStore.locale) }}</label>
              <select v-model="localCategory"
                class="w-full px-4 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">{{ t('shop.allCategories', languageStore.locale) }}</option>
                <option v-for="cat in productStore.categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <!-- Price Range Filter -->
            <div class="space-y-3">
              <label class="text-sm font-bold text-stone-900 uppercase tracking-widest">{{ t('shop.priceRange',
                languageStore.locale) }}</label>
              <div class="space-y-2">
                <div class="flex gap-3 items-center">
                  <div class="flex-1">
                    <label class="text-xs text-stone-600 font-mono">{{ t('shop.minPrice', languageStore.locale)
                    }}</label>
                    <input v-model.number="localPriceRange[0]" type="number" min="0" max="200"
                      class="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div class="flex-1">
                    <label class="text-xs text-stone-600 font-mono">{{ t('shop.maxPrice', languageStore.locale)
                    }}</label>
                    <input v-model.number="localPriceRange[1]" type="number" min="0" max="200"
                      class="w-full px-3 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="space-y-3">
              <label class="text-sm font-bold text-stone-900 uppercase tracking-widest">{{ t('shop.rating',
                languageStore.locale) }}</label>
              <select v-model.number="localMinRating"
                class="w-full px-4 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option :value="0">Any Rating</option>
                <option :value="4">4.0 & Up</option>
                <option :value="4.5">4.5 & Up</option>
                <option :value="4.8">4.8 & Up</option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="space-y-3">
              <label class="text-sm font-bold text-stone-900 uppercase tracking-widest">{{ t('shop.sortBy',
                languageStore.locale) }}</label>
              <select v-model="localSortBy"
                class="w-full px-4 py-2 border border-stone-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="name">{{ t('shop.nameAZ', languageStore.locale) }}</option>
                <option value="name-desc">{{ t('shop.nameZA', languageStore.locale) }}</option>
                <option value="price-asc">{{ t('shop.priceLowHigh', languageStore.locale) }}</option>
                <option value="price-desc">{{ t('shop.priceHighLow', languageStore.locale) }}</option>
                <option value="rating-desc">{{ t('shop.ratingHigh', languageStore.locale) }}</option>
                <option value="newest">{{ t('shop.newest', languageStore.locale) }}</option>
              </select>
            </div>

            <!-- Checkboxes -->
            <div class="space-y-3">
              <label class="flex items-center gap-3 cursor-pointer">
                <input v-model="localInStockOnly" type="checkbox"
                  class="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />
                <span class="text-sm font-medium text-stone-700">{{ t('shop.inStock', languageStore.locale) }}</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer">
                <input v-model="localFeaturedOnly" type="checkbox"
                  class="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />
                <span class="text-sm font-medium text-stone-700">{{ t('shop.featured', languageStore.locale) }}</span>
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-6 border-t border-stone-200">
              <button @click="resetFilters"
                class="flex-1 px-4 py-3 border border-stone-200 rounded-md text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
                {{ t('shop.clearFilters', languageStore.locale) }}
              </button>
              <button @click="applyFilters"
                class="flex-1 px-4 py-3 bg-stone-900 text-white rounded-md text-sm font-bold hover:bg-stone-800 transition-colors">
                {{ t('shop.applyFilters', languageStore.locale) }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.serif {
  font-family: var(--font-serif);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
