import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { refDebounced, useLocalStorage } from '@vueuse/core';

export const useProductStore = defineStore('product', () => {
  const products = useLocalStorage('kakada-products', [
    // Cleansers (5)
    {
      id: 1,
      name: "Gentle Cream Cleanser",
      price: 24.00,
      description: "A soothing cream cleanser that removes impurities without stripping moisture.",
      images: ["https://picsum.photos/seed/clean1/600/800"],
      isFeatured: true,
      category: "Cleansers",
      rating: 4.8,
      reviewCount: 128,
      stock: 45,
      reviews: [
        { id: 1, user: "Sarah M.", rating: 5, comment: "Absolutely love this cleanser! It's so gentle on my sensitive skin.", date: "2024-03-15" },
        { id: 2, user: "James L.", rating: 4, comment: "Great product, but a bit pricey for the size.", date: "2024-03-10" }
      ]
    },
    {
      id: 2,
      name: "Foaming Gel Wash",
      price: 18.00,
      description: "Deeply cleanses pores and removes excess oil for a refreshed feel.",
      images: ["https://picsum.photos/seed/clean2/600/800"],
      isFeatured: false,
      category: "Cleansers",
      rating: 4.5,
      reviewCount: 85,
      stock: 12,
      reviews: [
        { id: 1, user: "Emma W.", rating: 5, comment: "Perfect for my oily skin. Feels very clean after use.", date: "2024-03-12" }
      ]
    },
    {
      id: 3,
      name: "Oil-to-Milk Cleanser",
      price: 32.00,
      description: "Dissolves makeup and sunscreen effortlessly while nourishing the skin.",
      images: ["https://picsum.photos/seed/clean3/600/800"],
      isFeatured: false,
      category: "Cleansers",
      rating: 4.9,
      reviewCount: 210,
      stock: 8,
      reviews: [
        { id: 1, user: "Chloe B.", rating: 5, comment: "The best oil cleanser I've ever used. Turns into a lovely milk.", date: "2024-03-18" }
      ]
    },
    {
      id: 4,
      name: "Micellar Water",
      price: 12.00,
      description: "Gentle makeup remover for sensitive skin. No rinsing required.",
      images: ["https://picsum.photos/seed/clean4/600/800"],
      isFeatured: false,
      category: "Cleansers",
      rating: 4.2,
      reviewCount: 340,
      stock: 150,
      reviews: [
        { id: 1, user: "David K.", rating: 4, comment: "Good basic micellar water. Does the job.", date: "2024-03-05" }
      ]
    },
    {
      id: 5,
      name: "Clay Detox Cleanser",
      price: 26.00,
      description: "Infused with kaolin clay to draw out toxins and refine skin texture.",
      images: ["https://picsum.photos/seed/clean5/600/800"],
      isFeatured: true,
      category: "Cleansers",
      rating: 4.7,
      reviewCount: 156,
      stock: 24,
      reviews: [
        { id: 1, user: "Lily R.", rating: 5, comment: "My skin feels so smooth after using this. Highly recommend for weekly detox.", date: "2024-03-20" }
      ]
    },

    // Toners (5)
    {
      id: 6,
      name: "Hydrating Rose Water",
      price: 22.00,
      description: "Refreshes and balances skin pH with natural rose extracts.",
      images: ["https://picsum.photos/seed/tone1/600/800"],
      isFeatured: false,
      category: "Toners",
      rating: 4.6,
      reviewCount: 92,
      stock: 35,
      reviews: []
    },
    {
      id: 7,
      name: "BHA Exfoliating Toner",
      price: 28.00,
      description: "Unclogs pores and smooths skin surface with salicylic acid.",
      images: ["https://picsum.photos/seed/tone2/600/800"],
      isFeatured: true,
      category: "Toners",
      rating: 4.8,
      reviewCount: 420,
      stock: 5,
      reviews: []
    },
    {
      id: 8,
      name: "Niacinamide Mist",
      price: 20.00,
      description: "Brightens and minimizes the appearance of pores throughout the day.",
      images: ["https://picsum.photos/seed/tone3/600/800"],
      isFeatured: false,
      category: "Toners",
      rating: 4.4,
      reviewCount: 115,
      stock: 60,
      reviews: []
    },
    {
      id: 9,
      name: "Calming Cica Toner",
      price: 25.00,
      description: "Reduces redness and strengthens the skin barrier with Centella Asiatica.",
      images: ["https://picsum.photos/seed/tone4/600/800"],
      isFeatured: false,
      category: "Toners",
      rating: 4.7,
      reviewCount: 88,
      stock: 42,
      reviews: []
    },
    {
      id: 10,
      name: "Vitamin C Kakada Toner",
      price: 30.00,
      description: "Evens skin tone and provides antioxidant protection.",
      images: ["https://picsum.photos/seed/tone5/600/800"],
      isFeatured: false,
      category: "Toners",
      rating: 4.5,
      reviewCount: 134,
      stock: 18,
      reviews: []
    },

    // Serums (5)
    {
      id: 11,
      name: "Hyaluronic Acid Serum",
      price: 35.00,
      description: "Multi-weight HA for deep hydration and plumping effect.",
      images: ["https://picsum.photos/seed/serum1/600/800"],
      isFeatured: true,
      category: "Serums",
      rating: 4.9,
      reviewCount: 560,
      stock: 120,
      reviews: []
    },
    {
      id: 12,
      name: "Retinol Night Serum",
      price: 45.00,
      description: "Advanced 0.5% retinol to reduce fine lines and improve texture.",
      images: ["https://picsum.photos/seed/serum2/600/800"],
      isFeatured: false,
      category: "Serums",
      rating: 4.7,
      reviewCount: 280,
      stock: 15,
      reviews: []
    },
    {
      id: 13,
      name: "Vitamin C 15% Serum",
      price: 48.00,
      description: "Potent antioxidant serum for brightening and anti-aging.",
      images: ["https://picsum.photos/seed/serum3/600/800"],
      isFeatured: true,
      category: "Serums",
      rating: 4.8,
      reviewCount: 310,
      stock: 9,
      reviews: []
    },
    {
      id: 14,
      name: "Peptide Firming Serum",
      price: 42.00,
      description: "Boosts collagen production for firmer, more resilient skin.",
      images: ["https://picsum.photos/seed/serum4/600/800"],
      isFeatured: false,
      category: "Serums",
      rating: 4.6,
      reviewCount: 145,
      stock: 33,
      reviews: []
    },
    {
      id: 15,
      name: "Soothing Barrier Serum",
      price: 38.00,
      description: "Ceramide-rich formula to repair and protect sensitive skin.",
      images: ["https://picsum.photos/seed/serum5/600/800"],
      isFeatured: false,
      category: "Serums",
      rating: 4.9,
      reviewCount: 190,
      stock: 27,
      reviews: []
    },

    // Moisturizers (5)
    {
      id: 16,
      name: "Lightweight Water Cream",
      price: 32.00,
      description: "Fast-absorbing hydration for oily and combination skin.",
      images: ["https://picsum.photos/seed/moist1/600/800"],
      isFeatured: false,
      category: "Moisturizers",
      rating: 4.5,
      reviewCount: 220,
      stock: 55,
      reviews: []
    },
    {
      id: 17,
      name: "Rich Barrier Cream",
      price: 40.00,
      description: "Intense moisture for dry and dehydrated skin types.",
      images: ["https://picsum.photos/seed/moist2/600/800"],
      isFeatured: true,
      category: "Moisturizers",
      rating: 4.8,
      reviewCount: 340,
      stock: 4,
      reviews: []
    },
    {
      id: 18,
      name: "Night Repair Balm",
      price: 44.00,
      description: "Overnight treatment to nourish and restore skin while you sleep.",
      images: ["https://picsum.photos/seed/moist3/600/800"],
      isFeatured: false,
      category: "Moisturizers",
      rating: 4.9,
      reviewCount: 180,
      stock: 22,
      reviews: []
    },
    {
      id: 19,
      name: "Oil-Free Moisturizer",
      price: 28.00,
      description: "Non-comedogenic hydration that won't clog pores.",
      images: ["https://picsum.photos/seed/moist4/600/800"],
      isFeatured: false,
      category: "Moisturizers",
      rating: 4.3,
      reviewCount: 150,
      stock: 38,
      reviews: []
    },
    {
      id: 20,
      name: "Brightening Day Cream",
      price: 36.00,
      description: "Moisturizes while providing a subtle glow and even tone.",
      images: ["https://picsum.photos/seed/moist5/600/800"],
      isFeatured: false,
      category: "Moisturizers",
      rating: 4.6,
      reviewCount: 110,
      stock: 14,
      reviews: []
    },

    // Sunscreens (5)
    {
      id: 21,
      name: "Daily SPF 50+ Mist",
      price: 26.00,
      description: "Invisible sun protection that can be applied over makeup.",
      images: ["https://picsum.photos/seed/sun1/600/800"],
      isFeatured: true,
      category: "Sunscreens",
      rating: 4.7,
      reviewCount: 450,
      stock: 88,
      reviews: []
    },
    {
      id: 22,
      name: "Mineral Face Sunscreen",
      price: 34.00,
      description: "Zinc-based protection for sensitive skin with zero white cast.",
      images: ["https://picsum.photos/seed/sun2/600/800"],
      isFeatured: false,
      category: "Sunscreens",
      rating: 4.8,
      reviewCount: 290,
      stock: 31,
      reviews: []
    },
    {
      id: 23,
      name: "Hydrating Sun Gel",
      price: 24.00,
      description: "Water-based SPF that feels like a moisturizer.",
      images: ["https://picsum.photos/seed/sun3/600/800"],
      isFeatured: false,
      category: "Sunscreens",
      rating: 4.9,
      reviewCount: 320,
      stock: 45,
      reviews: []
    },
    {
      id: 24,
      name: "Tinted Sunscreen SPF 30",
      price: 38.00,
      description: "Sheer coverage and sun protection in one step.",
      images: ["https://picsum.photos/seed/sun4/600/800"],
      isFeatured: false,
      category: "Sunscreens",
      rating: 4.5,
      reviewCount: 180,
      stock: 12,
      reviews: []
    },
    {
      id: 25,
      name: "Matte Finish Sunscreen",
      price: 28.00,
      description: "Oil-absorbing SPF perfect for humid climates.",
      images: ["https://picsum.photos/seed/sun5/600/800"],
      isFeatured: false,
      category: "Sunscreens",
      rating: 4.4,
      reviewCount: 140,
      stock: 26,
      reviews: []
    },

    // Eye Care (5)
    {
      id: 26,
      name: "Caffeine Eye Serum",
      price: 22.00,
      description: "Reduces puffiness and dark circles instantly.",
      images: ["https://picsum.photos/seed/eye1/600/800"],
      isFeatured: false,
      category: "Eye Care",
      rating: 4.6,
      reviewCount: 210,
      stock: 40,
      reviews: []
    },
    {
      id: 27,
      name: "Retinol Eye Cream",
      price: 36.00,
      description: "Targets fine lines and crow's feet around the delicate eye area.",
      images: ["https://picsum.photos/seed/eye2/600/800"],
      isFeatured: true,
      category: "Eye Care",
      rating: 4.8,
      reviewCount: 190,
      stock: 15,
      reviews: []
    },
    {
      id: 28,
      name: "Hydrating Eye Gel",
      price: 20.00,
      description: "Cooling gel to soothe tired eyes and provide moisture.",
      images: ["https://picsum.photos/seed/eye3/600/800"],
      isFeatured: false,
      category: "Eye Care",
      rating: 4.5,
      reviewCount: 120,
      stock: 52,
      reviews: []
    },
    {
      id: 29,
      name: "Brightening Eye Balm",
      price: 25.00,
      description: "Illuminating balm to wake up the look of your eyes.",
      images: ["https://picsum.photos/seed/eye4/600/800"],
      isFeatured: false,
      category: "Eye Care",
      rating: 4.7,
      reviewCount: 150,
      stock: 28,
      reviews: []
    },
    {
      id: 30,
      name: "Peptide Eye Lift",
      price: 42.00,
      description: "Firms and lifts the appearance of the upper eyelid.",
      images: ["https://picsum.photos/seed/eye5/600/800"],
      isFeatured: false,
      category: "Eye Care",
      rating: 4.9,
      reviewCount: 85,
      stock: 10,
      reviews: []
    },

    // Face Masks (5)
    {
      id: 31,
      name: "Hydrating Sheet Mask Set",
      price: 15.00,
      description: "Pack of 5 masks for an instant moisture boost.",
      images: ["https://picsum.photos/seed/mask1/600/800"],
      isFeatured: false,
      category: "Face Masks",
      rating: 4.8,
      reviewCount: 520,
      stock: 200,
      reviews: []
    },
    {
      id: 32,
      name: "Charcoal Detox Mask",
      price: 28.00,
      description: "Deeply cleanses and minimizes the look of pores.",
      images: ["https://picsum.photos/seed/mask2/600/800"],
      isFeatured: true,
      category: "Face Masks",
      rating: 4.7,
      reviewCount: 310,
      stock: 45,
      reviews: []
    },
    {
      id: 33,
      name: "Overnight Sleeping Mask",
      price: 34.00,
      description: "Wake up to soft, glowing skin with this leave-on treatment.",
      images: ["https://picsum.photos/seed/mask3/600/800"],
      isFeatured: false,
      category: "Face Masks",
      rating: 4.9,
      reviewCount: 240,
      stock: 32,
      reviews: []
    },
    {
      id: 34,
      name: "Vitamin C Clay Mask",
      price: 26.00,
      description: "Brightens and smooths skin while absorbing excess oil.",
      images: ["https://picsum.photos/seed/mask4/600/800"],
      isFeatured: false,
      category: "Face Masks",
      rating: 4.6,
      reviewCount: 180,
      stock: 18,
      reviews: []
    },
    {
      id: 35,
      name: "Soothing Oat Mask",
      price: 24.00,
      description: "Calms irritated skin and reduces redness.",
      images: ["https://picsum.photos/seed/mask5/600/800"],
      isFeatured: false,
      category: "Face Masks",
      rating: 4.8,
      reviewCount: 130,
      stock: 44,
      reviews: []
    },

    // Exfoliators (5)
    {
      id: 36,
      name: "AHA/BHA Peeling Solution",
      price: 32.00,
      description: "Weekly treatment for professional-level exfoliation at home.",
      images: ["https://picsum.photos/seed/exf1/600/800"],
      isFeatured: true,
      category: "Exfoliators",
      rating: 4.9,
      reviewCount: 890,
      stock: 150,
      reviews: []
    },
    {
      id: 37,
      name: "Gentle Enzyme Scrub",
      price: 26.00,
      description: "Fruit enzymes dissolve dead skin cells without harsh scrubbing.",
      images: ["https://picsum.photos/seed/exf2/600/800"],
      isFeatured: false,
      category: "Exfoliators",
      rating: 4.7,
      reviewCount: 210,
      stock: 37,
      reviews: []
    },
    {
      id: 38,
      name: "Sugar Face Polish",
      price: 24.00,
      description: "Physical exfoliant that leaves skin feeling silky smooth.",
      images: ["https://picsum.photos/seed/exf3/600/800"],
      isFeatured: false,
      category: "Exfoliators",
      rating: 4.5,
      reviewCount: 160,
      stock: 24,
      reviews: []
    },
    {
      id: 39,
      name: "Lactic Acid 10% Serum",
      price: 30.00,
      description: "Mild exfoliation for sensitive skin types.",
      images: ["https://picsum.photos/seed/exf4/600/800"],
      isFeatured: false,
      category: "Exfoliators",
      rating: 4.8,
      reviewCount: 140,
      stock: 48,
      reviews: []
    },
    {
      id: 40,
      name: "Exfoliating Pads",
      price: 22.00,
      description: "Convenient pre-soaked pads for daily skin renewal.",
      images: ["https://picsum.photos/seed/exf5/600/800"],
      isFeatured: false,
      category: "Exfoliators",
      rating: 4.6,
      reviewCount: 120,
      stock: 22,
      reviews: []
    },

    // Lip Care (5)
    {
      id: 41,
      name: "Hydrating Lip Balm",
      price: 8.00,
      description: "Long-lasting moisture for dry, chapped lips.",
      images: ["https://picsum.photos/seed/lip1/600/800"],
      isFeatured: false,
      category: "Lip Care",
      rating: 4.4,
      reviewCount: 310,
      stock: 310,
      reviews: []
    },
    {
      id: 42,
      name: "Lip Sleeping Mask",
      price: 18.00,
      description: "Intense overnight treatment for plump, soft lips.",
      images: ["https://picsum.photos/seed/lip2/600/800"],
      isFeatured: true,
      category: "Lip Care",
      rating: 4.9,
      reviewCount: 650,
      stock: 50,
      reviews: []
    },
    {
      id: 43,
      name: "Sugar Lip Scrub",
      price: 12.00,
      description: "Gently removes dry skin for a smooth lip surface.",
      images: ["https://picsum.photos/seed/lip3/600/800"],
      isFeatured: false,
      category: "Lip Care",
      rating: 4.7,
      reviewCount: 180,
      stock: 47,
      reviews: []
    },
    {
      id: 44,
      name: "SPF 15 Lip Protectant",
      price: 10.00,
      description: "Protects lips from sun damage and environmental stress.",
      images: ["https://picsum.photos/seed/lip4/600/800"],
      isFeatured: false,
      category: "Lip Care",
      rating: 4.5,
      reviewCount: 120,
      stock: 120,
      reviews: []
    },
    {
      id: 45,
      name: "Tinted Lip Oil",
      price: 16.00,
      description: "Nourishing oil with a hint of color and high shine.",
      images: ["https://picsum.photos/seed/lip5/600/800"],
      isFeatured: false,
      category: "Lip Care",
      rating: 4.8,
      reviewCount: 240,
      stock: 48,
      reviews: []
    },

    // Body Care (5)
    {
      id: 46,
      name: "Nourishing Body Lotion",
      price: 20.00,
      description: "All-day hydration for smooth, healthy-looking skin.",
      images: ["https://picsum.photos/seed/body1/600/800"],
      isFeatured: false,
      category: "Body Care",
      rating: 4.6,
      reviewCount: 380,
      stock: 38,
      reviews: []
    },
    {
      id: 47,
      name: "Exfoliating Body Wash",
      price: 18.00,
      description: "Cleanses and smooths skin texture with gentle acids.",
      images: ["https://picsum.photos/seed/body2/600/800"],
      isFeatured: false,
      category: "Body Care",
      rating: 4.7,
      reviewCount: 290,
      stock: 29,
      reviews: []
    },
    {
      id: 48,
      name: "Whipped Body Butter",
      price: 28.00,
      description: "Rich, decadent moisture for extremely dry skin.",
      images: ["https://picsum.photos/seed/body3/600/800"],
      isFeatured: true,
      category: "Body Care",
      rating: 4.9,
      reviewCount: 420,
      stock: 42,
      reviews: []
    },
    {
      id: 49,
      name: "Hand & Nail Cream",
      price: 12.00,
      description: "Repairs dry hands and strengthens nails.",
      images: ["https://picsum.photos/seed/body4/600/800"],
      isFeatured: false,
      category: "Body Care",
      rating: 4.5,
      reviewCount: 150,
      stock: 15,
      reviews: []
    },
    {
      id: 50,
      name: "Firming Body Oil",
      price: 35.00,
      description: "Improves skin elasticity and provides a healthy glow.",
      images: ["https://picsum.photos/seed/body5/600/800"],
      isFeatured: false,
      category: "Body Care",
      rating: 4.8,
      reviewCount: 190,
      stock: 19,
      reviews: []
    }
  ]);

  const searchQuery = ref('');
  const debouncedSearchQuery = refDebounced(searchQuery, 300);
  const recentSearches = useLocalStorage('recent-searches', []);

  const addRecentSearch = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Remove if already exists to move it to the front
    const filtered = recentSearches.value.filter(s => s.toLowerCase() !== trimmedQuery.toLowerCase());
    recentSearches.value = [trimmedQuery, ...filtered].slice(0, 5); // Keep last 5
  };

  const clearRecentSearches = () => {
    recentSearches.value = [];
  };

  // Filter state
  const selectedCategory = ref('');
  const priceRange = ref([0, 100]);
  const minRating = ref(0);
  const inStockOnly = ref(false);
  const featuredOnly = ref(false);
  const sortBy = ref('name');

  // Filter methods
  const setCategory = (category) => {
    selectedCategory.value = category;
  };

  const setPriceRange = (min, max) => {
    priceRange.value = [min, max];
  };

  const setMinRating = (rating) => {
    minRating.value = rating;
  };

  const setInStockOnly = (value) => {
    inStockOnly.value = value;
  };

  const setFeaturedOnly = (value) => {
    featuredOnly.value = value;
  };

  const setSortBy = (sort) => {
    sortBy.value = sort;
  };

  const clearAllFilters = () => {
    selectedCategory.value = '';
    priceRange.value = [0, 100];
    minRating.value = 0;
    inStockOnly.value = false;
    featuredOnly.value = false;
    sortBy.value = 'name';
  };

  // Get unique categories from products
  const categories = computed(() => {
    const cats = new Set(products.value.map(p => p.category));
    return Array.from(cats).sort();
  });

  const filteredProducts = computed(() => {
    let result = products.value;

    // Apply search filter
    if (debouncedSearchQuery.value.trim()) {
      const query = debouncedSearchQuery.value.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory.value) {
      result = result.filter(p => p.category === selectedCategory.value);
    }

    // Apply price range filter
    const [minPrice, maxPrice] = Array.isArray(priceRange.value) ? priceRange.value : [0, 100];
    result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Apply rating filter
    result = result.filter(p => p.rating >= minRating.value);

    // Apply stock filter
    if (inStockOnly.value) {
      result = result.filter(p => p.stock > 0);
    }

    // Apply featured filter
    if (featuredOnly.value) {
      result = result.filter(p => p.isFeatured);
    }

    // Apply sorting
    const sorted = [...result];
    switch (sortBy.value) {
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
      case 'newest':
        // Assuming products added to end of array are newer
        sorted.reverse();
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  });

  const featuredProducts = computed(() => products.value.filter(p => p.isFeatured));

  const getProductById = (id) => products.value.find(p => p.id === id);

  const updateStock = (id, newStock) => {
    const product = products.value.find(p => p.id === id);
    if (product) {
      product.stock = Math.max(0, newStock);
    }
  };

  const deleteProduct = (id) => {
    products.value = products.value.filter(p => p.id !== id);
  };

  const addProduct = (productData) => {
    const newId = products.value.length > 0 ? Math.max(...products.value.map(p => p.id)) + 1 : 1;
    products.value.push({
      id: newId,
      rating: 0,
      reviewCount: 0,
      reviews: [],
      ...productData
    });
  };

  const updateProduct = (id, productData) => {
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...productData };
    }
  };

  return {
    products,
    searchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    filteredProducts,
    featuredProducts,
    categories,
    getProductById,
    updateStock,
    deleteProduct,
    addProduct,
    updateProduct,
    // Filter state
    selectedCategory,
    priceRange,
    minRating,
    inStockOnly,
    featuredOnly,
    sortBy,
    // Filter methods
    setCategory,
    setPriceRange,
    setMinRating,
    setInStockOnly,
    setFeaturedOnly,
    setSortBy,
    clearAllFilters
  };
});
