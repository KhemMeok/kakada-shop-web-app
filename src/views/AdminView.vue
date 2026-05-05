<script setup>
import { ref, computed } from 'vue';
import { useProductStore } from '@/src/stores/productStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import { t } from '@/src/locales/index';
import {
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Trash2,
  Edit3,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const productStore = useProductStore();
const languageStore = useLanguageStore();
const router = useRouter();

const searchQuery = ref('');
const showAddModal = ref(false);
const editingProduct = ref(null);

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return productStore.products;
  const query = searchQuery.value.toLowerCase();
  return productStore.products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
});

const newProduct = ref({
  name: '',
  price: 0,
  category: 'Cleansers',
  description: '',
  stock: 0,
  images: ['https://picsum.photos/seed/new/600/800'],
  isFeatured: false
});

const categories = ['Cleansers', 'Toners', 'Serums', 'Moisturizers', 'Sunscreens', 'Eye Care', 'Face Masks', 'Exfoliators', 'Lip Care', 'Body Care'];

const handleAddProduct = () => {
  productStore.addProduct({ ...newProduct.value });
  showAddModal.value = false;
  resetNewProduct();
};

const handleUpdateProduct = () => {
  if (editingProduct.value) {
    productStore.updateProduct(editingProduct.value.id, { ...editingProduct.value });
    editingProduct.value = null;
  }
};

const handleDeleteProduct = (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    productStore.deleteProduct(id);
  }
};

const resetNewProduct = () => {
  newProduct.value = {
    name: '',
    price: 0,
    category: 'Cleansers',
    description: '',
    stock: 0,
    images: ['https://picsum.photos/seed/new/600/800'],
    isFeatured: false
  };
};

const startEdit = (product) => {
  editingProduct.value = { ...product };
};

const updateStock = (id, delta) => {
  const product = productStore.getProductById(id);
  if (product) {
    productStore.updateStock(id, product.stock + delta);
  }
};
</script>

<template>
  <div class="space-y-8 pb-20">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="router.back()"
          class="p-2 bg-white border border-stone-200 rounded-md text-stone-900 active:scale-90 transition-transform"
          :aria-label="t('admin.goBack', languageStore.locale)">
          <ArrowLeft :size="20" aria-hidden="true" />
        </button>
        <h1 class="text-2xl font-bold tracking-tight text-stone-900 serif">{{ t('admin.title', languageStore.locale) }}
        </h1>
      </div>
      <button @click="showAddModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-md text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform shadow-lg shadow-stone-900/10">
        <Plus :size="14" />
        {{ t('admin.addProduct', languageStore.locale) }}
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-2">
        <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{{ t('admin.totalProducts',
          languageStore.locale) }}</p>
        <p class="text-3xl font-bold text-stone-900 serif">{{ productStore.products.length }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-2">
        <p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{{ t('admin.lowStockItems',
          languageStore.locale) }}</p>
        <p class="text-3xl font-bold text-rose-500 serif">
          {{productStore.products.filter(p => p.stock < 10).length}} </p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="relative">
      <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" :size="18" />
      <input v-model="searchQuery" type="text" :placeholder="t('admin.searchPlaceholder', languageStore.locale)"
        class="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm" />
    </div>

    <!-- Product List -->
    <div class="space-y-4">
      <div v-for="product in filteredProducts" :key="product.id"
        class="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4 group">
        <div class="w-16 h-16 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0">
          <img :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover"
            referrerpolicy="no-referrer" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">{{ product.category }}</p>
          <h3 class="text-sm font-bold text-stone-900 truncate serif">{{ product.name }}</h3>
          <div class="flex items-center gap-3 mt-1">
            <p class="text-xs font-bold text-stone-900">${{ product.price.toFixed(2) }}</p>
            <div
              class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              :class="product.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'">
              <AlertCircle v-if="product.stock < 10" :size="10" />
              Stock: {{ product.stock }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button @click="startEdit(product)"
            class="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
            :title="t('admin.editProduct', languageStore.locale)">
            <Edit3 :size="18" />
          </button>
          <button @click="handleDeleteProduct(product.id)"
            class="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            :title="t('admin.deleteProduct', languageStore.locale)">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="fade">
      <div v-if="showAddModal || editingProduct"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm">
        <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div class="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <h2 class="text-2xl font-bold text-stone-900 serif">
              {{ editingProduct ? t('admin.editProduct', languageStore.locale) : t('admin.addNewProduct',
              languageStore.locale) }}
            </h2>
            <button @click="showAddModal = false; editingProduct = null"
              class="p-2 text-stone-400 hover:text-stone-900 transition-colors">
              <X :size="20" />
            </button>
          </div>

          <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">{{
                t('admin.productName', languageStore.locale) }}</label>
              <input v-model="(editingProduct || newProduct).name" type="text"
                class="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">{{ t('admin.price',
                  languageStore.locale) }} ($)</label>
                <input v-model.number="(editingProduct || newProduct).price" type="number" step="0.01"
                  class="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">{{ t('admin.stock',
                  languageStore.locale) }}</label>
                <input v-model.number="(editingProduct || newProduct).stock" type="number"
                  class="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">{{ t('admin.category',
                languageStore.locale) }}</label>
              <select v-model="(editingProduct || newProduct).category"
                class="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">{{
                t('admin.description', languageStore.locale) }}</label>
              <textarea v-model="(editingProduct || newProduct).description" rows="3"
                class="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"></textarea>
            </div>

            <div class="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl">
              <input v-model="(editingProduct || newProduct).isFeatured" type="checkbox" id="isFeatured"
                class="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
              <label for="isFeatured"
                class="text-xs font-bold text-emerald-900 uppercase tracking-wider cursor-pointer">Feature this
                product</label>
            </div>
          </div>

          <div class="p-6 bg-stone-50/50 border-t border-stone-100">
            <button @click="editingProduct ? handleUpdateProduct() : handleAddProduct()"
              class="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs active:scale-[0.98] transition-all shadow-xl shadow-stone-900/20">
              {{ editingProduct ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.serif {
  font-family: var(--font-serif);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
