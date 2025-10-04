'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bed, 
  Ruler, 
  Euro, 
  Waves, 
  Plane, 
  Zap, 
  Calendar,
  Building,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatPrice, formatArea, formatDistance, formatPercentage } from '@/lib/utils/formatters';

interface SpecificationsProps {
  project: any;
}

export default function Specifications({ project }: SpecificationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const specifications = [
    {
      icon: <Bed className="w-6 h-6" />,
      label: 'Bedrooms',
      value: project.bedrooms_range || 'Studio - 3BR',
      color: 'text-blue-600',
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      label: 'Area',
      value: project.built_area_m2 ? formatArea(project.built_area_m2) : '50-200 m²',
      color: 'text-green-600',
    },
    {
      icon: <Euro className="w-6 h-6" />,
      label: 'Price from',
      value: `${formatPrice(project.price_from_new || project.price)} + ${project.vat_rate || 5}% VAT`,
      color: 'text-orange-600',
    },
    {
      icon: <Waves className="w-6 h-6" />,
      label: 'Sea',
      value: project.proximity_sea_km ? formatDistance(project.proximity_sea_km) : 'N/A',
      color: 'text-cyan-600',
    },
    {
      icon: <Plane className="w-6 h-6" />,
      label: 'Airport',
      value: project.proximity_airport_km ? formatDistance(project.proximity_airport_km) : 'N/A',
      color: 'text-purple-600',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Energy Class',
      value: project.energy_rating || 'A+',
      color: 'text-yellow-600',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Completion',
      value: project.completion_date || 'Q4 2024',
      color: 'text-red-600',
    },
    {
      icon: <Building className="w-6 h-6" />,
      label: 'Total Units',
      value: project.total_units_new || project.total_units || 'N/A',
      color: 'text-gray-600',
    },
  ];

  // Show first 6 items on mobile, all on desktop
  const visibleSpecs = isExpanded ? specifications : specifications.slice(0, 6);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Project Specifications</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Detailed information about the property features and location advantages
          </p>
        </div>

        {/* Desktop Grid - 3 columns */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {specifications.map((spec, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className={`${spec.color} mb-2`}>
                  {spec.icon}
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {spec.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xl font-bold">{spec.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-3">
          {visibleSpecs.map((spec, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={spec.color}>
                      {spec.icon}
                    </div>
                    <div>
                      <p className="font-medium">{spec.label}</p>
                      <p className="text-sm text-muted-foreground">{spec.value}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Expand/Collapse Button */}
          {specifications.length > 6 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-3 text-primary font-medium"
            >
              <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Additional Info Cards */}
        {(project.roi_estimate_percent || project.rental_yield_percent) && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {project.roi_estimate_percent && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatPercentage(project.roi_estimate_percent)}
                  </div>
                  <p className="text-green-700 font-medium">Estimated ROI</p>
                </CardContent>
              </Card>
            )}
            
            {project.rental_yield_percent && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPercentage(project.rental_yield_percent)}
                  </div>
                  <p className="text-blue-700 font-medium">Rental Yield</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </section>
  );
}