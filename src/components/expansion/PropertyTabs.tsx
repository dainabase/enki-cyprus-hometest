import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, FileText, MapIcon, TrendingDown } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';
import { TabPhotos } from './TabPhotos';
import { TabDetails } from './TabDetails';

type TabType = 'photos' | 'details' | 'map' | 'fiscal';

interface PropertyTabsProps {
  property: PropertyData;
}

export const PropertyTabs = ({ property }: PropertyTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  const tabs = [
    { id: 'photos' as TabType, label: 'Photos', icon: Image },
    { id: 'details' as TabType, label: 'Details', icon: FileText },
    { id: 'map' as TabType, label: 'Location', icon: MapIcon, disabled: true },
    { id: 'fiscal' as TabType, label: 'Fiscal', icon: TrendingDown, disabled: true },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-black/10">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Property tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-black'
                    : tab.disabled
                    ? 'text-black/30 cursor-not-allowed'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {activeTab === 'photos' && (
          <TabPhotos images={property.images} title={property.title} />
        )}

        {activeTab === 'details' && <TabDetails property={property} />}

        {activeTab === 'map' && (
          <div className="text-center py-12 text-black/60 font-light">
            Map view coming in next step...
          </div>
        )}

        {activeTab === 'fiscal' && (
          <div className="text-center py-12 text-black/60 font-light">
            Fiscal analysis coming in next step...
          </div>
        )}
      </motion.div>
    </div>
  );
};
