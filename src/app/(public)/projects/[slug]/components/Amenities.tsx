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
  'default': <div className="w-5 h-5 bg-primary rounded-full" />
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
        
        {/* Project Amenities */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Property Amenities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enjoy premium facilities and services designed for modern living
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayAmenities.map((item, index) => {
              const amenity = item.amenity;
              const icon = amenityIcons[amenity.icon] || amenityIcons.default;
              
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-primary group-hover:scale-110 transition-transform">
                        {icon}
                      </div>
                      <h3 className="font-medium text-sm">{amenity.name}</h3>
                      {item.is_paid && (
                        <Badge variant="outline" className="text-xs">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Nearby Amenities */}
        {nearbyAmenities.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Nearby Amenities</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need is within easy reach
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyAmenities.map((item, index) => {
                const amenity = item.amenity;
                const icon = amenityIcons[amenity.icon] || amenityIcons.default;
                
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-primary">
                            {icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{amenity.name}</CardTitle>
                            {amenity.category && (
                              <p className="text-sm text-muted-foreground capitalize">
                                {amenity.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        {item.distance_km && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{formatDistance(item.distance_km)}</span>
                          </div>
                        )}
                        
                        {item.distance_minutes_walk && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{item.distance_minutes_walk} min walk</span>
                          </div>
                        )}
                        
                        {item.distance_minutes_drive && (
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <CarIcon className="w-4 h-4" />
                            <span>{item.distance_minutes_drive} min drive</span>
                          </div>
                        )}
                        
                        {item.quantity && item.quantity > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            {item.quantity} locations
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Lifestyle Benefits */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Premium Lifestyle</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Experience the perfect blend of luxury, convenience, and community living. 
                Our carefully curated amenities are designed to enhance your daily life 
                and provide exceptional value for your investment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}