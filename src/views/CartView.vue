<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/src/stores/cartStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import { t } from '@/src/locales/index';
import { ShoppingBag, Trash2, Minus, Plus, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-vue-next';
import { RouterLink, useRouter } from 'vue-router';

const cartStore = useCartStore();
const languageStore = useLanguageStore();
const router = useRouter();
const isCheckoutSuccess = ref(false);

const handleCheckout = () => {
  // Mock checkout
  isCheckoutSuccess.value = true;
  cartStore.checkout();
  setTimeout(() => {
    isCheckoutSuccess.value = false;
    router.push('/');
  }, 3000);
};
</script>

<template>
  <div class="space-y-8 pb-32">
    <!-- Success Message Overlay -->
    <Transition name="fade">
      <div v-if="isCheckoutSuccess"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm" role="alert"
        aria-live="assertive">
        <div
          class="bg-white p-8 rounded-2xl shadow-2xl text-center space-y-4 max-w-xs animate-in zoom-in-95 duration-300">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 :size="32" />
          </div>
          <div class="space-y-1">
            <h2 class="text-2xl font-bold text-stone-900 serif">{{ t('cart.orderConfirmed', languageStore.locale) }}
            </h2>
            <p class="text-sm text-stone-500 leading-relaxed">{{ t('cart.orderMessage', languageStore.locale) }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="flex items-center gap-4">
      <button @click="router.back()"
        class="p-2 bg-white border border-stone-200 rounded-md text-stone-900 active:scale-90 transition-transform"
        :aria-label="t('cart.goBack', languageStore.locale)">
        <ArrowLeft :size="20" aria-hidden="true" />
      </button>
      <h1 class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ t('cart.title', languageStore.locale) }}
      </h1>
    </div>

    <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-[50vh] space-y-6">
      <div class="w-24 h-24 bg-stone-100 rounded-md flex items-center justify-center text-stone-300">
        <ShoppingBag :size="48" />
      </div>
      <div class="text-center space-y-2">
        <p class="text-2xl font-bold text-stone-900 serif">{{ t('cart.empty', languageStore.locale) }}</p>
        <p class="text-sm text-stone-400 font-mono uppercase tracking-widest">{{ t('cart.emptySubtitle',
          languageStore.locale) }}</p>
      </div>
      <RouterLink to="/"
        class="px-8 py-4 bg-stone-900 text-white rounded-md font-bold uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-stone-900/10">
        {{ t('cart.exploreProducts', languageStore.locale) }}
      </RouterLink>
    </div>

    <div v-else class="space-y-6">
      <!-- Cart Items -->
      <div class="space-y-4">
        <div v-for="item in cartStore.items" :key="item.id"
          class="flex gap-4 p-4 bg-white rounded-md border border-stone-100 shadow-sm">
          <div class="w-24 h-24 bg-stone-100 rounded overflow-hidden flex-shrink-0">
            <img :src="item.images[0]" :alt="item.name" class="w-full h-full object-cover"
              referrerpolicy="no-referrer" />
          </div>

          <div class="flex-1 flex flex-col justify-between py-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-bold text-stone-900 line-clamp-1 serif">{{ item.name }}</h3>
                <p class="text-xs text-stone-400 font-mono uppercase tracking-widest">{{ item.category }}</p>
              </div>
              <button @click="cartStore.removeFromCart(item.id)"
                class="p-1 text-stone-300 hover:text-rose-500 active:scale-90 transition-all"
                :aria-label="`Remove ${item.name} from cart`">
                <Trash2 :size="18" aria-hidden="true" />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <p class="text-sm font-bold text-stone-900">${{ item.price.toFixed(2) }}</p>

              <div class="flex items-center gap-3 bg-stone-100 rounded-md px-2 py-1">
                <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="p-1 text-stone-600 active:scale-90 transition-transform"
                  :aria-label="`Decrease quantity of ${item.name}`">
                  <Minus :size="14" aria-hidden="true" />
                </button>
                <span class="text-xs font-bold w-4 text-center" aria-live="polite"
                  :aria-label="`Quantity: ${item.quantity}`">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="p-1 text-stone-600 active:scale-90 transition-transform"
                  :aria-label="`Increase quantity of ${item.name}`">
                  <Plus :size="14" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="p-6 bg-white rounded-lg border border-stone-100 shadow-sm space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-widest text-stone-400">{{ t('cart.checkout',
          languageStore.locale) }}</h3>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-stone-400">Subtotal</span>
            <span class="font-bold text-stone-900">${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-stone-400">Shipping</span>
            <span class="font-bold text-emerald-600 uppercase tracking-widest">Free</span>
          </div>
          <div class="pt-4 border-t border-stone-100 flex justify-between">
            <span class="text-2xl font-bold text-stone-900 serif">{{ t('cart.total', languageStore.locale) }}</span>
            <span class="text-lg font-bold text-stone-900">${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Checkout Bar -->
    <div v-if="cartStore.items.length > 0"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-stone-200 z-50">
      <button @click="handleCheckout"
        class="w-full h-14 bg-stone-900 text-white rounded-md flex items-center justify-between px-6 font-bold uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-stone-900/10">
        <span class="flex items-center gap-2">
          {{ t('cart.checkout', languageStore.locale) }}
          <ChevronRight :size="18" />
        </span>
        <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.serif {
  font-family: var(--font-serif);
}
</style>
