'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, MapPin, CircleCheck as CheckCircle } from 'lucide-react';
import { truncateText } from '@/lib/utils/formatters';

interface OverviewProps {
  project: any;
}

export default function Overview({ project }: OverviewProps) {
  const description = project.detailed_description || project.description || '';
  const shortDescription = truncateText(description, 200);
  
  let uspPoints = [];
  if (project.unique_selling_points) {
    uspPoints = Array.isArray(project.unique_selling_points)
      ? project.unique_selling_points
      : JSON.parse(project.unique_selling_points);
  } else {
    uspPoints = [
      'Emplacement privilégié',
      'Design architectural moderne',
      'Finitions de qualité supérieure',
      'Équipements complets',
      'Opportunité d\'investissement'
    ];
  }

  // Default coordinates for Cyprus if GPS data not available
  const latitude = project.gps_latitude || 34.7768;
  const longitude = project.gps_longitude || 32.4245;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Description & USPs */}
          <div className="space-y-8">
            {/* Golden Visa Badge */}
            {project.golden_visa_eligible && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                <Crown className="w-4 h-4 mr-2" />
                Golden Visa Eligible Property
              </Badge>
            )}

            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {shortDescription}
              </p>
            </div>

            {/* USP Points */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Key Features</h3>
              <div className="space-y-3">
                {uspPoints.slice(0, 5).map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Info */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {project.location?.city || project.location?.address || 'Chypre'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Map */}
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden">
                  {/* Simple embedded map */}
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.${latitude}!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDQ2JzM2LjUiTiAzMsKwMjUnMjguMiJF!5e0!3m2!1sen!2scy!4v1234567890123!5m2!1sen!2scy`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  />
                </div>
                
                {/* Map Footer */}
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Exact Location
                    </span>
                    <button 
                      className="text-primary hover:underline"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
                          '_blank'
                        );
                      }}
                    >
                      View on Google Maps
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}