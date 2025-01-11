"use client";
import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";

type HeaderContextProps = {
  mobileNav: boolean;
  setMobileNav: (toggleInput: boolean) => void;
};

// Create the context
const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

interface HeaderProviderProps {
  children: ReactNode;
}

const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [mobileNav, setMobileNav] = useState<boolean>(false);

  const appContextValue: HeaderContextProps = {
    mobileNav,
    setMobileNav,
  };

  return (
    <HeaderContext.Provider value={appContextValue}>
      {children}
    </HeaderContext.Provider>
  );
};

// Custom hook
const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within an HeaderProvider");
  }
  return context;
};

export { HeaderProvider, useHeaderContext };
