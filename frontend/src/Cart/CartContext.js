// CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id && item.selectedColor === product.selectedColor && item.selectedSize === product.selectedSize);

      if (existingProductIndex !== -1) {
        // Update quantity if the product already exists
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        // Add new product to the cart
        return [...prevCart, { ...product, quantity: product.quantity }];
      }
    });
  };

  const getCart = () => {
    return cart; // Optional: if you want to expose a way to read the cart
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, getCart }}>
      {children}
    </CartContext.Provider>
  );
};
