'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  Dumbbell, 
  Car, 
  Trees, 
  Wifi, 
  Shield, 
  MapPin,
  Clock,
  Car as CarIcon
} from 'lucide-react';
import { formatDistance } from '@/lib/utils/formatters';

interface AmenitiesProps {
  project: any;
}

const amenityIcons: { [key: string]: React.ReactNode } = {
  'pool': <Waves className="w-5 h-5" />,
  'gym': <Dumbbell className="w-5 h-5" />,
  'parking': <Car className="w-5 h-5" />,
  'garden': <Trees className="w-5 h-5" />,
  'wifi': <Wifi className="w-5 h-5" />,
  'security': <Shield className="w-5 h-5" />,
  'default': <Shield className="w-5 h-5" />
};

export default function Amenities({ project }: AmenitiesProps) {
  const projectAmenities = project.project_amenities || [];
  const nearbyAmenities = project.project_nearby_amenities || [];
  
  // Fallback amenities if none in database
  const fallbackAmenities = [
    { amenity: { name: 'Swimming Pool', icon: 'pool', category: 'recreation' } },
    { amenity: { name: 'Fitness Center', icon: 'gym', category: 'health' } },
    { amenity: { name: 'Parking', icon: 'parking', category: 'convenience' } },
    { amenity: { name: 'Garden', icon: 'garden', category: 'outdoor' } },
    { amenity: { name: 'WiFi', icon: 'wifi', category: 'technology' } },
    { amenity: { name: '24/7 Security', icon: 'security', category: 'security' } }
  ];

  const displayAmenities = projectAmenities.length > 0 ? projectAmenities : fallbackAmenities;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Project Amenities (Grouped by Category) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Property Amenities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the amenities, organized by category
            </p>
          </div>

          {(() => {
            const grouped = displayAmenities.reduce((acc: Record<string, any[]>, item: any) => {
              const cat = item.amenity?.category || 'other';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            }, {});

            return (
              <div className="space-y-10">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold mb-4 capitalize">{category.replace('-', ' ')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {(items as any[]).map((item, index) => {
                        const amenity = item.amenity;
                        const icon = amenityIcons[amenity.icon] || amenityIcons.default;
                        return (
                          <Card key={`${category}-${index}`} className="text-center hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="text-primary">
                                  {icon}
                                </div>
                                <h4 className="font-medium text-sm">{amenity.name}</h4>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Nearby Amenities (Grouped by Category, distance only) */}
        {nearbyAmenities.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Nearby Amenities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Distances to nearby points of interest
              </p>
            </div>

            {(() => {
              const grouped = nearbyAmenities.reduce((acc: Record<string, any[]>, item: any) => {
                const cat = item.amenity?.category || 'other';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
              }, {});

              return (
                <div className="space-y-10">
                  {Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xl font-semibold mb-4 capitalize">{category.replace('-', ' ')}</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(items as any[]).map((item, index) => {
                          const amenity = item.amenity;
                          const icon = amenityIcons[amenity.icon] || amenityIcons.default;
                          return (
                            <Card key={`${category}-${index}`} className="hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="text-primary">{icon}</div>
                                    <div>
                                      <div className="font-medium">{amenity.name}</div>
                                      {amenity.category && (
                                        <div className="text-xs text-muted-foreground capitalize">{amenity.category}</div>
                                      )}
                                    </div>
                                  </div>
                                  {item.distance_km && (
                                    <div className="text-sm text-muted-foreground">
                                      {formatDistance(item.distance_km)}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </section>
  );
}