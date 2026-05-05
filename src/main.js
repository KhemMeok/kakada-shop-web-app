import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './index.css';

// Views
import HomeView from './views/HomeView.vue';
import ShopView from './views/ShopView.vue';
import ProductDetailView from './views/ProductDetailView.vue';
import CartView from './views/CartView.vue';
import FavoritesView from './views/FavoritesView.vue';
import ProfileView from './views/ProfileView.vue';
import AdminView from './views/AdminView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/shop', component: ShopView },
  { path: '/product/:id', component: ProductDetailView },
  { path: '/cart', component: CartView },
  { path: '/favorites', component: FavoritesView },
  { path: '/profile', component: ProfileView },
  { path: '/admin', component: AdminView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount('#root');
