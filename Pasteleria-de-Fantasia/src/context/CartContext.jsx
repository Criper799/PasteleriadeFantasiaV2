import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('fantasia_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error cargando el carrito desde localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fantasia_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error guardando el carrito en localStorage:', error);
    }
  }, [cart]);

  const generateUniqueId = (item) => {
    if (item.isCustom) {
      const detailsStr = `${item.customDetails.portions}-${item.customDetails.sponge}-${item.customDetails.fillings.join('-')}-${item.customDetails.frosting}-${item.customDetails.cakeText}`;
      return `custom-${btoa(unescape(encodeURIComponent(detailsStr))).slice(0, 16)}`;
    } else {
      return `standard-${item.product.id}-${item.selectedPortions}`;
    }
  };

  const addToCart = (product, quantity = 1, selectedPortions) => {
    setCart((prevCart) => {
      const newItem = {
        isCustom: false,
        product,
        quantity,
        selectedPortions: selectedPortions || product.portions[0]
      };
      
      const itemId = generateUniqueId(newItem);
      const existingItemIndex = prevCart.findIndex(item => item.id === itemId);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...newItem, id: itemId }];
      }
    });
  };

  const addCustomCakeToCart = (customDetails, quantity = 1) => {
    setCart((prevCart) => {
      const newItem = {
        isCustom: true,
        customDetails,
        quantity,
        product: {
          id: 999, 
          name: 'Torta Personalizada de Fantasía',
          price: customDetails.price,
          image: '/img/pastel.jpg', 
          description: `Bizcocho de ${customDetails.sponge}, rellenos de ${customDetails.fillings.join(' y ')}, cubierto de ${customDetails.frosting}.`
        }
      };

      const itemId = generateUniqueId(newItem);
      const existingItemIndex = prevCart.findIndex(item => item.id === itemId);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...newItem, id: itemId }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cálculos derivados
  const getProductPrice = (item) => {
    if (item.isCustom) {
      return item.customDetails.price;
    }
    // Si es un producto estándar, el precio base escala según la porción elegida
    // Si la porción elegida es la primera (por defecto), mantiene el precio base.
    // Si es mayor, se aplica un incremento multiplicador
    const basePrice = item.product.price;
    const basePortion = item.product.portions[0];
    const currentPortion = item.selectedPortions;

    if (currentPortion === basePortion || !currentPortion) {
      return basePrice;
    }
    
    // Proporción simple para calcular el incremento del precio por porción adicional
    const ratio = currentPortion / basePortion;
    return Math.round(basePrice * (1 + (ratio - 1) * 0.7)); // 70% de incremento proporcional
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (getProductPrice(item) * item.quantity);
  }, 0);

  const cartCount = cart.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      addCustomCakeToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getProductPrice,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
