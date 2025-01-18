"use client";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";

type WishListContextProps = {
  addToWishList: (id: string) => void;
  removeFromWishList: (id: string) => void;
  isInWishList: (id: string) => boolean;
  WishListQuantity: number;
  WishListItems: WishListItem[];
};

interface WishListProviderProps {
  children: ReactNode;
}

type WishListItem = {
  id: string;
};

// Create the context
const WishListContext = createContext({} as WishListContextProps);

const WishListProvider: React.FC<WishListProviderProps> = ({ children }) => {
  const [WishListItems, setWishListItems] = useLocalStorage<WishListItem[]>(
    "halisi-wishList",
    [],
  );

  // Calculate the total number of items in the wishlist
  const WishListQuantity = WishListItems.length;

  function addToWishList(id: string) {
    setWishListItems((currItems) => {
      if (!currItems.find((item) => item.id === id)) {
        return [...currItems, { id }];
      }
      return currItems;
    });
  }

  function removeFromWishList(id: string) {
    setWishListItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  }

  function isInWishList(id: string) {
    return WishListItems.some((item) => item.id === id);
  }

  const appContextValue: WishListContextProps = {
    addToWishList,
    removeFromWishList,
    isInWishList,
    WishListQuantity,
    WishListItems,
  };

  return (
    <WishListContext.Provider value={appContextValue}>
      {children}
    </WishListContext.Provider>
  );
};

// Custom hook to use the WishListContext
const useWishListContext = () => {
  const context = useContext(WishListContext);
  if (!context) {
    throw new Error(
      "useWishListContext must be used within a WishListProvider",
    );
  }
  return context;
};

export { WishListProvider, useWishListContext };
