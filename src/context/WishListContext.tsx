"use client";
import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";

type WishListContextProps = {
  addToWishList: (id: string, categoryId: string, categoryName: string) => void;
  removeFromWishList: (id: string, categoryId: string) => void;
  isInWishList: (id: string, categoryId: string) => boolean;
  WishListQuantity: number;
  WishListItems: WishListItem[];
};

interface WishListProviderProps {
  children: ReactNode;
}

type WishListItem = {
  id: string;
  categoryId: string;
  categoryName: string;
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

  function addToWishList(id: string, categoryId: string, categoryName: string) {
    setWishListItems((currItems) => {
      if (
        !currItems.find(
          (item) => item.id === id && item.categoryId === categoryId,
        )
      ) {
        return [...currItems, { id, categoryId, categoryName }];
      }
      return currItems;
    });
  }

  function removeFromWishList(id: string, categoryId: string) {
    setWishListItems((currItems) => {
      return currItems.filter(
        (item) => !(item.id === id && item.categoryId === categoryId),
      );
    });
  }

  function isInWishList(id: string, categoryId: string) {
    return WishListItems.some(
      (item) => item.id === id && item.categoryId === categoryId,
    );
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
