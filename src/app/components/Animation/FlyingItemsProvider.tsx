"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import FlyingItem from "./FlyingItem";

interface FlyingItemData {
  id: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  image: string;
}

interface FlyingItemsContextType {
  flyItem: (
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number },
    image: string
  ) => void;
}

const FlyingItemsContext = createContext<FlyingItemsContextType | undefined>(
  undefined
);

export function useFlyingItems() {
  const context = useContext(FlyingItemsContext);
  if (!context) {
    throw new Error("useFlyingItems must be used within a FlyingItemsProvider");
  }
  return context;
}

export default function FlyingItemsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [flyingItems, setFlyingItems] = useState<FlyingItemData[]>([]);

  const flyItem = (
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number },
    image: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFlyingItems((prev) => [
      ...prev,
      { id, startPosition, endPosition, image },
    ]);
  };

  const removeFlyingItem = (id: string) => {
    setFlyingItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <FlyingItemsContext.Provider value={{ flyItem }}>
      {children}

      {/* Render flying items */}
      {flyingItems.map((item) => (
        <FlyingItem
          key={item.id}
          startPosition={item.startPosition}
          endPosition={item.endPosition}
          image={item.image}
          onComplete={() => removeFlyingItem(item.id)}
        />
      ))}
    </FlyingItemsContext.Provider>
  );
}
