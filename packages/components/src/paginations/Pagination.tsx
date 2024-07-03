"use client";

import { cn } from "@spin-spot/utils";
import { useEffect, useState } from "react";

interface PaginationProps {
  labels: string[];
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onPageChange?: (_label: string | null | undefined) => void;
  initialActiveIndex?: number | null; // Nueva prop para el índice activo inicial
}

const paginationSizes = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export function Pagination({
  labels,
  size = "md",
  className,
  onPageChange,
  initialActiveIndex = null, // Valor por defecto de la nueva prop
}: PaginationProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(
    initialActiveIndex,
  );

  useEffect(() => {
    if (initialActiveIndex !== null && initialActiveIndex !== currentIndex) {
      setCurrentIndex(initialActiveIndex);
    } else if (initialActiveIndex === null) {
      setCurrentIndex(null);
    }
  }, [initialActiveIndex]);

  const handleClick = (index: number) => {
    const newIndex = index;
    setCurrentIndex(newIndex);
    if (onPageChange) {
      onPageChange(newIndex !== null ? labels[newIndex] : null);
    }
  };

  return (
    <div className="join">
      {labels.map((label, index) => (
        <button
          key={index}
          className={cn(
            "join-item btn btn-square",
            paginationSizes[size],
            className,
            index === currentIndex ? "btn-active" : "",
          )}
          onClick={() => handleClick(index)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
