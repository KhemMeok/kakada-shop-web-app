<script setup>
import { Plus, Star, Heart } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useProductStore } from '@/src/stores/productStore';
import { useCartStore } from '@/src/stores/cartStore';
import { useFavoritesStore } from '@/src/stores/favoritesStore';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const productStore = useProductStore();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();

const handleProductClick = () => {
  if (productStore.searchQuery.trim()) {
    productStore.addRecentSearch(productStore.searchQuery);
  }
};

const handleAddToCart = (e) => {
  e.preventDefault();
  e.stopPropagation();
  cartStore.addToCart(props.product);
};

const handleToggleFavorite = (e) => {
  e.preventDefault();
  e.stopPropagation();
  favoritesStore.toggleFavorite(props.product.id);
};

const isOutOfStock = () => {
  return props.product.stock <= 0;
};

const isFavorited = () => {
  return favoritesStore.isFavorited(props.product.id);
};
</script>

<template>
  <RouterLink :to="`/product/${product.id}`" @click="handleProductClick"
    class="group block bg-white rounded-md overflow-hidden border border-stone-100 shadow-sm active:scale-[0.98] transition-all duration-200">
    <div class="relative aspect-[3/4] overflow-hidden bg-stone-100">
      <img :src="product.images[0]" :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"
        referrerpolicy="no-referrer" />

      <!-- Out of Stock Overlay -->
      <div v-if="isOutOfStock()"
        class="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center">
        <span class="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded-md">
          Sold Out
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="absolute bottom-3 right-3 flex gap-2 z-10">
        <button @click="handleToggleFavorite"
          class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-sm flex items-center justify-center text-stone-900 shadow-md active:scale-90 transition-transform"
          :aria-label="`${isFavorited() ? 'Remove from' : 'Add to'} favorites`"
          :class="{ 'text-rose-500': isFavorited() }">
          <Heart :size="20" :fill="isFavorited() ? 'currentColor' : 'none'" aria-hidden="true" />
        </button>
        <button v-if="!isOutOfStock()" @click="handleAddToCart"
          class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-sm flex items-center justify-center text-stone-900 shadow-md active:scale-90 transition-transform z-10"
          :aria-label="`Add ${product.name} to cart`">
          <Plus :size="20" aria-hidden="true" />
        </button>
      </div>

      <div v-if="product.isFeatured"
        class="absolute top-3 left-3 px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-md"
        role="status">
        Featured
      </div>
    </div>

    <div class="p-4">
    <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1 sm:text-[10px]">
        {{ product.category }}
      </p>
    <h3 class="text-base font-semibold text-stone-900 line-clamp-1 mb-1 sm:text-sm">
        {{ product.name }}
      </h3>
    <div class="flex items-center gap-1.5 mb-2 sm:gap-2">
        <div class="flex items-center gap-0.5 text-amber-400" :aria-label="`Rating: ${product.rating} out of 5 stars`">
          <Star :size="12" fill="currentColor" aria-hidden="true" />
          <span class="text-xs font-bold text-stone-900">{{ product.rating }}</span>
        </div>
        <span class="text-[10px] text-stone-400 font-medium uppercase tracking-widest"
          :aria-label="`${product.reviewCount} reviews`">({{ product.reviewCount }})</span>
      </div>

      <!-- Price and Stock -->
      <div class="flex items-center justify-between">
    <p class="text-lg font-bold text-stone-900 sm:text-base">
          ${{ product.price.toFixed(2) }}
        </p>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
          :class="product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'">
          {{ product.stock > 0 ? `${product.stock} left` : 'Out' }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>
