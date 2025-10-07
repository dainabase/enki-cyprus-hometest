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
        "w-full z-40 transition-all duration-300",
        isSticky ? "fixed top-0 bg-white shadow-md" : "relative bg-neutral-50"
      )}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Desktop - Horizontal Tabs */}
        <div className="hidden lg:flex items-center gap-1 py-4 overflow-x-auto">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-6 py-3 text-sm font-light tracking-wide whitespace-nowrap transition-all duration-300",
                activeCategory === category.id
                  ? "bg-black text-white"
                  : "bg-transparent text-black hover:bg-black/5"
              )}
            >
              {category.label}
              {category.count !== undefined && (
                <span className={cn(
                  "ml-2 text-xs",
                  activeCategory === category.id ? "text-white/60" : "text-black/40"
                )}>
                  ({category.count})
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Mobile - Dropdown */}
        <div className="lg:hidden py-4">
          <select
            value={activeCategory}
            onChange={(e) => onCategoryChange(e.target.value as CategoryType)}
            className="w-full px-4 py-3 bg-white border border-black/10 text-black font-light focus:outline-none focus:border-black/40 transition-colors"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
                {category.count !== undefined && ` (${category.count})`}
              </option>
            ))}
          </select>
        </div>

        {/* Active Indicator Bar (Desktop) */}
        {!isSticky && (
          <div className="hidden lg:block h-[1px] bg-black/10" />
        )}
      </div>
    </motion.nav>
  );
}
