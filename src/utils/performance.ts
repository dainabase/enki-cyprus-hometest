// Performance utilities for optimization

import React from 'react';
import { debounce } from 'lodash';

// Debounced search function
export const createDebouncedSearch = (searchFn: Function, delay: number = 300) => {
  return debounce(searchFn, delay);
};

// Image optimization utility
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url) return '';
  
  // If it's a Supabase storage URL, add transformation parameters
  if (url.includes('supabase')) {
    const params = new URLSearchParams();
    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());
    params.set('quality', '85');
    
    return `${url}?${params.toString()}`;
  }
  
  return url;
};

// Lazy loading utility for components
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return React.lazy(importFn);
};

// Memoization utility for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Performance measurement utility
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};