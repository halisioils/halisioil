"use client";
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";

type CartContextProps = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: string, categoryId: string) => number;
  increaseCartQuantity: (
    id: string,
    categoryId: string,
    categoryName: string,
  ) => void;
  decreaseCartQuantity: (id: string, categoryId: string) => void;
  removeFromCart: (id: string, categoryId: string) => void;
  cartQuantity: number;
  cartItems: CartItem[];
  isOpen: boolean;
  emptyCart: () => void;
};

interface CartProviderProps {
  children: ReactNode;
}

type CartItem = {
  id: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
};

// Create the context
const CartContext = createContext({} as CartContextProps);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "halisi-cart",
    [],
  );

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0,
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  function getItemQuantity(id: string, categoryId: string) {
    return (
      cartItems.find((item) => item.id === id && item.categoryId === categoryId)
        ?.quantity ?? 0
    );
  }

  function increaseCartQuantity(
    id: string,
    categoryId: string,
    categoryName: string,
  ) {
    setCartItems((currItems) => {
      const existingItem = currItems.find(
        (item) => item.id === id && item.categoryId === categoryId,
      );

      if (!existingItem) {
        return [...currItems, { id, categoryId, categoryName, quantity: 1 }];
      } else {
        return currItems.map((item) =>
          item.id === id && item.categoryId === categoryId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
    });
  }

  function decreaseCartQuantity(id: string, categoryId: string) {
    setCartItems((currItems) => {
      const existingItem = currItems.find(
        (item) => item.id === id && item.categoryId === categoryId,
      );

      if (existingItem?.quantity === 1) {
        return currItems.filter(
          (item) => item.id !== id || item.categoryId !== categoryId,
        );
      } else {
        return currItems.map((item) =>
          item.id === id && item.categoryId === categoryId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
    });
  }

  function removeFromCart(id: string, categoryId: string) {
    setCartItems((currItems) => {
      return currItems.filter(
        (item) => item.id !== id || item.categoryId !== categoryId,
      );
    });
  }

  function emptyCart() {
    setCartItems([]); // Clear all items from the cart
  }

  const appContextValue: CartContextProps = {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    openCart,
    closeCart,
    cartItems,
    cartQuantity,
    isOpen,
    emptyCart,
  };

  return (
    <CartContext.Provider value={appContextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCartContext };
