import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
    const favoriteIds = ref([]);

    // Load from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favoriteIds.value = JSON.parse(savedFavorites);
    }

    const addToFavorites = (productId) => {
        if (!favoriteIds.value.includes(productId)) {
            favoriteIds.value.push(productId);
            saveFavorites();
        }
    };

    const removeFromFavorites = (productId) => {
        const index = favoriteIds.value.indexOf(productId);
        if (index !== -1) {
            favoriteIds.value.splice(index, 1);
            saveFavorites();
        }
    };

    const toggleFavorite = (productId) => {
        if (isFavorited(productId)) {
            removeFromFavorites(productId);
        } else {
            addToFavorites(productId);
        }
    };

    const isFavorited = (productId) => {
        return favoriteIds.value.includes(productId);
    };

    const clearFavorites = () => {
        favoriteIds.value = [];
        saveFavorites();
    };

    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favoriteIds.value));
    };

    const getFavoriteCount = computed(() => favoriteIds.value.length);

    return {
        favoriteIds,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorited,
        clearFavorites,
        getFavoriteCount,
    };
});
