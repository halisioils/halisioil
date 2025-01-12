"use client";

import { useEffect, useState } from "react";
import { heroImageSources } from "~/utils/heroImageSources";

interface UseHeroImagesReturn {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
  nextIndex: number;
  setNextIndex: (index: number) => void;
  paginationIndex: number;
  setPaginationIndex: (index: number) => void;
}

export const useHeroImages = (): UseHeroImagesReturn => {
  // State definitions
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [paginationIndex, setPaginationIndex] = useState<number>(0);
  const [nextIndex, setNextIndex] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Effect for image transitions
  useEffect(() => {
    const totalImages = Object.keys(heroImageSources).length;

    const interval = setInterval(() => {
      setPaginationIndex((prevIndex) => (prevIndex + 1) % totalImages);
      setIsAnimating(true);

      // Delay for animation
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
        setNextIndex((prevIndex) => (prevIndex + 1) % totalImages);
        setIsAnimating(false);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    currentIndex,
    setCurrentIndex,
    isAnimating,
    setIsAnimating,
    nextIndex,
    setNextIndex,
    paginationIndex,
    setPaginationIndex,
  };
};
