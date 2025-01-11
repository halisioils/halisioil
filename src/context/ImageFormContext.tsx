"use client";
import { createContext, useContext, useState } from "react";

import type { ReactNode, SetStateAction } from "react";

type ImageContextProps = {
  files: File[]; // Array of File objects
  setFiles: (fileInput: SetStateAction<File[]>) => void; // Function to set the files state
  progress: number;
  setProgress: (progressInput: number) => void;
  isUploading: boolean;
  setIsUploading: (progressInput: boolean) => void;
  previews: string[]; // Array of string URLs for image previews
  setPreviews: (previewInput: SetStateAction<string[]>) => void;
};

// Create the context
const ImageContext = createContext<ImageContextProps | undefined>(undefined);

interface ImageProviderProps {
  children: ReactNode;
}

const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]); // Store multiple files
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previews, setPreviews] = useState<string[]>([]); // Store previews for multiple images

  const appContextValue: ImageContextProps = {
    files,
    setFiles,
    progress,
    setProgress,
    isUploading,
    setIsUploading,
    previews,
    setPreviews,
  };

  return (
    <ImageContext.Provider value={appContextValue}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook
const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};

export { ImageProvider, useImageContext };
