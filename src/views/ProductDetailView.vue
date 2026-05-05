<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, Share2, Heart, ShoppingCart, Minus, Plus, Star } from 'lucide-vue-next';
import { useProductStore } from '@/src/stores/productStore';
import { useCartStore } from '@/src/stores/cartStore';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import { t } from '@/src/locales/index';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const languageStore = useLanguageStore();

const productId = computed(() => parseInt(route.params.id));
const product = computed(() => productStore.getProductById(productId.value));

const quantity = ref(1);

const isFavorited = computed(() => {
  return favoritesStore.isFavorited(productId.value);
});

const isOutOfStock = computed(() => {
  return !product.value || product.value.stock <= 0;
});

const handleAddToCart = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addToCart(product.value);
    }
    router.push('/cart');
  }
};

const handleToggleFavorite = () => {
  favoritesStore.toggleFavorite(productId.value);
};

const handleShare = async () => {
  if (navigator.share && product.value) {
    try {
      await navigator.share({
        title: product.value.name,
        text: product.value.description,
        url: window.location.href,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }
};
</script>

<template>
  <div v-if="product" class="relative -mx-4 -mt-16 pb-24">
    <div class="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 pointer-events-none">
      <button @click="router.back()"
        class="p-2 bg-white/80 backdrop-blur-md border border-stone-200 rounded-md text-stone-900 shadow-sm active:scale-90 transition-transform pointer-events-auto"
        :aria-label="t('product.goBack', languageStore.locale)">
        <ChevronLeft :size="24" aria-hidden="true" />
      </button>
      <div class="flex gap-2 pointer-events-auto">
        <button @click="handleShare"
          class="p-2 bg-white/80 backdrop-blur-md border border-stone-200 rounded-md text-stone-900 shadow-sm active:scale-90 transition-transform"
          :aria-label="t('product.shareProduct', languageStore.locale)">
          <Share2 :size="20" aria-hidden="true" />
        </button>
        <button @click="handleToggleFavorite"
          class="p-2 bg-white/80 backdrop-blur-md border border-stone-200 rounded-md shadow-sm active:scale-90 transition-transform"
          :class="isFavorited ? 'text-rose-500' : 'text-stone-900'"
          :aria-label="isFavorited ? t('product.removeFromFavorites', languageStore.locale) : t('product.addToFavorites', languageStore.locale)"
          :aria-pressed="isFavorited">
          <Heart :size="20" :fill="isFavorited ? 'currentColor' : 'none'" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Image Gallery -->
    <div class="relative aspect-[3/4] bg-stone-100 overflow-hidden">
      <Swiper :modules="[Pagination]" :pagination="{ clickable: true }" class="h-full">
        <SwiperSlide v-for="(image, index) in product.images" :key="index">
          <img :src="image" :alt="product.name" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- Product Info -->
    <div class="px-6 pt-8 space-y-6">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest">{{ product.category }}</p>
          <div class="flex items-center gap-1.5">
            <div class="flex items-center gap-0.5 text-amber-400">
              <Star :size="14" fill="currentColor" />
              <span class="text-sm font-bold text-stone-900">{{ product.rating }}</span>
            </div>
            <span class="text-[10px] text-stone-400 font-medium uppercase tracking-widest">({{ product.reviewCount }}
              Reviews)</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ product.name }}</h1>
        <p class="text-2xl font-bold text-stone-900">${{ product.price.toFixed(2) }}</p>
      </div>

      <div class="space-y-2">
        <h3 class="text-xs font-bold uppercase tracking-widest text-stone-400">{{ t('product.description',
          languageStore.locale) }}</h3>
        <p class="text-sm text-stone-600 leading-relaxed">{{ product.description }}</p>
      </div>

      <!-- Quantity Selector -->
      <div class="flex items-center justify-between py-4 border-y border-stone-100">
        <h3 class="text-xs font-bold uppercase tracking-widest text-stone-400">{{ t('product.quantity',
          languageStore.locale) }}</h3>
        <div class="flex items-center gap-4 bg-stone-100 rounded-md px-2 py-1">
          <button @click="quantity = Math.max(1, quantity - 1)"
            class="p-2 text-stone-600 active:scale-90 transition-transform"
            :aria-label="`${t('product.quantity', languageStore.locale)} ${quantity - 1}`">
            <Minus :size="18" aria-hidden="true" />
          </button>
          <span class="text-sm font-bold w-4 text-center" aria-live="polite" :aria-label="`Quantity: ${quantity}`">{{
            quantity }}</span>
          <button @click="quantity++" class="p-2 text-stone-600 active:scale-90 transition-transform"
            :aria-label="`${t('product.quantity', languageStore.locale)} ${quantity + 1}`">
            <Plus :size="18" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="space-y-6 pt-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-widest text-stone-400">{{ t('product.userReviews',
            languageStore.locale) }}</h3>
          <button
            class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline transition-all">{{
              t('product.writeReview', languageStore.locale) }}</button>
        </div>

        <div v-if="product.reviews && product.reviews.length > 0" class="space-y-6">
          <div v-for="review in product.reviews" :key="review.id"
            class="space-y-2 pb-6 border-b border-stone-100 last:border-0">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {{review.user.split(' ').map(n => n[0]).join('')}}
                </div>
                <div>
                  <p class="text-xs font-bold text-stone-900">{{ review.user }}</p>
                  <div class="flex items-center gap-0.5 text-amber-400">
                    <Star v-for="i in 5" :key="i" :size="10" :fill="i <= review.rating ? 'currentColor' : 'none'" />
                  </div>
                </div>
              </div>
              <span class="text-[10px] text-stone-400 font-mono">{{ review.date }}</span>
            </div>
            <p class="text-sm text-stone-600 leading-relaxed">{{ review.comment }}</p>
          </div>
        </div>
        <div v-else class="py-8 text-center bg-stone-50 rounded-lg border border-dashed border-stone-200">
          <p class="text-xs text-stone-400 font-mono uppercase tracking-widest">{{ t('product.noReviews',
            languageStore.locale) }}</p>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Bar -->
    <div
      class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-stone-200 z-50 flex gap-4">
      <button @click="handleAddToCart" :disabled="isOutOfStock"
        :class="{ 'opacity-50 cursor-not-allowed': isOutOfStock }"
        class="flex-1 h-14 bg-stone-900 text-white rounded-md flex items-center justify-center gap-3 font-bold uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-stone-900/10">
        <ShoppingCart :size="20" />
        {{ isOutOfStock ? t('product.soldOut', languageStore.locale) : t('product.addToCart', languageStore.locale) }}
      </button>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-[60vh]">
    <p class="text-stone-400 font-mono uppercase tracking-widest">{{ t('product.productNotFound', languageStore.locale)
    }}</p>
  </div>
</template>

<style scoped>
.serif {
  font-family: var(--font-serif);
}
</style>
