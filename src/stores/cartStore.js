import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useProductStore } from './productStore';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const productStore = useProductStore();

  // Load from localStorage
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    items.value = JSON.parse(savedCart);
  }

  // Persist to localStorage
  watch(items, (newItems) => {
    localStorage.setItem('cart', JSON.stringify(newItems));
  }, { deep: true });

  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((total, item) => total + (item.price * item.quantity), 0));

  const addToCart = (product) => {
    const existingItem = items.value.find(item => item.id === product.id);
    const storeProduct = productStore.getProductById(product.id);
    
    if (!storeProduct || storeProduct.stock <= 0) return;

    if (existingItem) {
      if (existingItem.quantity < storeProduct.stock) {
        existingItem.quantity++;
      }
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (productId) => {
    const index = items.value.findIndex(item => item.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId);
    const storeProduct = productStore.getProductById(productId);
    
    if (item && storeProduct) {
      const newQuantity = Math.min(Math.max(0, quantity), storeProduct.stock);
      item.quantity = newQuantity;
      if (item.quantity === 0) {
        removeFromCart(productId);
      }
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  const checkout = () => {
    // Decrement stock for each item in cart
    items.value.forEach(item => {
      productStore.updateStock(item.id, productStore.getProductById(item.id).stock - item.quantity);
    });
    clearCart();
  };

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout
  };
});
