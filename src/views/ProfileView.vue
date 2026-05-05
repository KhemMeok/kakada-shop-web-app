<script setup>
import { User, Settings, CreditCard, MapPin, Bell, LogOut, ChevronRight, LayoutDashboard } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useLanguageStore } from '@/src/stores/languageStore';
import { t } from '@/src/locales/index';

const languageStore = useLanguageStore();

const menuItems = [
  { icon: User, labelKey: 'profile.personalInfo', descKey: 'profile.personalInfoDesc', path: '/profile' },
  { icon: CreditCard, labelKey: 'profile.paymentMethods', descKey: 'profile.paymentMethodsDesc', path: '/profile' },
  { icon: MapPin, labelKey: 'profile.shippingAddress', descKey: 'profile.shippingAddressDesc', path: '/profile' },
  { icon: Bell, labelKey: 'profile.notifications', descKey: 'profile.notificationsDesc', path: '/profile' },
  { icon: LayoutDashboard, labelKey: 'profile.adminDashboard', descKey: 'profile.adminDashboardDesc', path: '/admin' },
  { icon: Settings, labelKey: 'profile.settings', descKey: 'profile.settingsDesc', path: '/profile' },
];
</script>

<template>
  <div class="space-y-10 pb-16">
    <div class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ t('profile.title', languageStore.locale) }}
      </h1>
      <p class="text-[10px] text-stone-400 font-mono uppercase tracking-[0.2em]">{{ t('profile.subtitle',
        languageStore.locale) }}</p>
    </div>

    <!-- User Info Card -->
    <div
      class="relative overflow-hidden p-8 bg-stone-900 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
      <div class="relative z-10 flex items-center gap-6">
        <div class="w-20 h-20 rounded-full border-2 border-white/20 p-1 bg-stone-800 overflow-hidden">
          <img src="https://picsum.photos/seed/user-kakada/400" alt="User"
            class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />
        </div>
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-white serif">Emma Vance</h2>
          <p class="text-xs text-stone-400 font-mono uppercase tracking-widest">emma.vance@kakadashop.com</p>
          <div class="pt-2">
            <span
              class="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-[9px] font-bold uppercase tracking-[0.15em] rounded-full border border-emerald-400/30">
              Gold Member
            </span>
          </div>
        </div>
      </div>
      <!-- Decorative background element -->
      <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Menu Section -->
    <div class="space-y-4">
      <h3 class="px-2 text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">{{ t('profile.accountSettings',
        languageStore.locale) }}</h3>
      <div class="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-50 overflow-hidden"
        role="menu">
        <RouterLink v-for="item in menuItems" :key="item.labelKey" :to="item.path"
          class="w-full group flex items-center justify-between p-5 hover:bg-stone-50 active:bg-stone-100 transition-all duration-300"
          role="menuitem"
          :aria-label="`${t(item.labelKey, languageStore.locale)}: ${t(item.descKey, languageStore.locale)}`">
          <div class="flex items-center gap-5">
            <div
              class="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors duration-300"
              aria-hidden="true">
              <component :is="item.icon" :size="22" stroke-width="1.5" />
            </div>
            <div class="text-left">
              <p class="text-sm font-bold text-stone-900 serif">{{ t(item.labelKey, languageStore.locale) }}</p>
              <p class="text-[10px] text-stone-400 font-medium tracking-wide">{{ t(item.descKey, languageStore.locale)
              }}</p>
            </div>
          </div>
          <ChevronRight :size="18"
            class="text-stone-300 group-hover:text-stone-900 group-hover:translate-x-1 transition-all duration-300"
            aria-hidden="true" />
        </RouterLink>
      </div>
    </div>

    <!-- Logout Button -->
    <div class="pt-4">
      <button
        class="w-full flex items-center justify-center gap-3 p-5 bg-stone-50 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border border-transparent hover:border-rose-100"
        :aria-label="t('profile.logout', languageStore.locale)">
        <LogOut :size="18" stroke-width="2" aria-hidden="true" />
        {{ t('profile.logout', languageStore.locale) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.serif {
  font-family: var(--font-serif);
}
</style>
