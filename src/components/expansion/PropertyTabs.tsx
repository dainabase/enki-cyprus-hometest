import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, FileText, MapIcon, TrendingDown } from 'lucide-react';
import type { PropertyData } from '@/types/expansion.types';
import { TabPhotos } from './TabPhotos';
import { TabDetails } from './TabDetails';
import { TabMap } from './TabMap';
import { TabFiscal } from './TabFiscal';

type TabType = 'photos' | 'details' | 'map' | 'fiscal';

interface PropertyTabsProps {
  property: PropertyData;
}

export const PropertyTabs = ({ property }: PropertyTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('photos');

  const tabs = [
    { id: 'photos' as TabType, label: 'Photos', icon: Image },
    { id: 'details' as TabType, label: 'Details', icon: FileText },
    { id: 'map' as TabType, label: 'Location', icon: MapIcon },
    { id: 'fiscal' as TabType, label: 'Fiscal', icon: TrendingDown },
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
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-black'
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

        {activeTab === 'map' && <TabMap property={property} />}

        {activeTab === 'fiscal' && <TabFiscal property={property} />}
      </motion.div>
    </div>
  );
};
