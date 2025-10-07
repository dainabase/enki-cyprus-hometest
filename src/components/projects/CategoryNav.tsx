'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CategoryNavProps, CategoryType } from '@/types/project.types';

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "w-full z-40 transition-all duration-500",
        isSticky 
          ? "fixed top-0 backdrop-blur-md bg-white/80 shadow-lg border-b border-black/5" 
          : "relative bg-neutral-50"
      )}
      style={{
        backdropFilter: isSticky ? "blur(20px)" : "none",
      }}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Desktop - Horizontal Tabs */}
        <div className="hidden lg:block relative">
          <div className="flex items-center gap-1 py-4 overflow-x-auto">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "relative px-6 py-3 text-sm font-light tracking-wide whitespace-nowrap transition-all duration-300",
                  activeCategory === category.id
                    ? "text-black"
                    : "text-black/60 hover:text-black"
                )}
              >
                {category.label}
                {category.count !== undefined && (
                  <span className={cn(
                    "ml-2 text-xs transition-colors duration-300",
                    activeCategory === category.id ? "text-black/60" : "text-black/40"
                  )}>
                    ({category.count})
                  </span>
                )}
                
                {/* Ligne animée sous la catégorie active */}
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mobile - Dropdown avec style amélioré */}
        <div className="lg:hidden py-4">
          <motion.select
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-black/10 text-black font-light focus:outline-none focus:border-black/40 transition-all duration-300 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '3rem'
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
                {category.count !== undefined && ` (${category.count})`}
              </option>
            ))}
          </motion.select>
        </div>

        {/* Active Indicator Bar (Desktop) */}
        {!isSticky && (
          <div className="hidden lg:block h-[1px] bg-black/10" />
        )}
      </div>
    </motion.nav>
  );
}
