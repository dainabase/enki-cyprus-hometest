import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Brain as Train, GraduationCap, Hospital, ShoppingCart, TreePalm as Palmtree } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { trackSectionView } from '../utils/tracking';

interface LocationInteractiveProps {
  project: any;
}

const categoryIcons = {
  transport: Train,
  schools: GraduationCap,
  health: Hospital,
  shopping: ShoppingCart,
  leisure: Palmtree
};

export function LocationInteractive({ project }: LocationInteractiveProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      trackSectionView('location_interactive');
    }
  }, [isInView]);

  if (!project) return null;

  const proximities = Array.isArray(project.surrounding_amenities)
    ? project.surrounding_amenities
    : [];

  const latitude = project.gps_latitude || 34.7042;
  const longitude = project.gps_longitude || 33.0222;
  const city = project.location_city || project.city || '';
  const neighborhood = project.neighborhood || '';
  const country = project.location_country || project.country || '';

  const groupedProximities = proximities.reduce((acc, prox) => {
    const category = prox.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(prox);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gray-50 py-16 sm:py-20 md:py-24"
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6">
            Localisation <span className="font-normal">Premium</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            {neighborhood && `${neighborhood}, `}{city}{city && country && ', '}{country}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=15`}
              title="Localisation du projet"
            />
          </div>
        </motion.div>

        {proximities.length > 0 && (
          <div className="space-y-8">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl sm:text-3xl font-light text-center mb-8"
            >
              Proximités & <span className="font-normal">Commodités</span>
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedProximities).map(([category, items], categoryIndex) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons] || MapPin;

                return items.map((prox: any, index: number) => (
                  <motion.div
                    key={`${category}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + (categoryIndex * 0.1) + (index * 0.05) }}
                  >
                    <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {prox.name}
                            </h4>
                            {prox.distance && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {prox.distance}
                              </p>
                            )}
                            {prox.description && (
                              <p className="text-sm text-gray-500 mt-2">
                                {prox.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ));
              })}
            </div>
          </div>
        )}

        {project.investment_highlights && project.investment_highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            {project.investment_highlights.slice(0, 3).map((highlight: string, index: number) => (
              <Card key={index} className="bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{highlight}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
