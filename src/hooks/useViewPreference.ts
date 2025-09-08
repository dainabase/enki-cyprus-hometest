import { useState, useEffect } from 'react';

export type ViewType = 'cards' | 'list' | 'table' | 'compact' | 'detailed';

export const useViewPreference = (storageKey: string, defaultView: ViewType = 'cards') => {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const saved = localStorage.getItem(storageKey);
    return (saved as ViewType) || defaultView;
  });

  const changeView = (view: ViewType) => {
    setCurrentView(view);
    localStorage.setItem(storageKey, view);
  };

  return { currentView, changeView };
};