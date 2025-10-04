import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Brain as Train, GraduationCap, Hospital, ShoppingCart, TreePalm as Palmtree, Euro, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { trackSectionView } from '../utils/tracking';

interface LocationInteractiveProps {
  projectSlug?: string;
}

const categoryIcons = {
  transport: Train,
  schools: GraduationCap,
  health: Hospital,
  shopping: ShoppingCart,
  leisure: Palmtree
};

export function LocationInteractive({ projectSlug }: LocationInteractiveProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [project, setProject] = useState<any>(null);
  const [proximities, setProximities] = useState<any[]>([]);

  useEffect(() => {
    if (isInView) {
      trackSectionView('location_interactive');
    }
  }, [isInView]);

  useEffect(() => {
    loadData();
  }, [projectSlug]);

  async function loadData() {
    try {
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('url_slug', projectSlug || 'marina-bay-residences-limassol')
        .maybeSingle();

      if (projectData) {
        setProject(projectData);

        // Use surrounding_amenities from project data instead of separate proximities table
        const amenities = Array.isArray(projectData.surrounding_amenities) 
          ? projectData.surrounding_amenities 
          : [];
        setProximities(amenities);
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    }
  }

  if (!project) return null;

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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            Emplacement Premium
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            53% des acheteurs priorisent le temps de trajet. D\u00e9couvrez tout ce qui compte \u00e0 proximit\u00e9.
          </p>
        </motion.div>

        {/* SPLIT VIEW - CRITIQUE: Liste + Carte c\u00f4te-\u00e0-c\u00f4te */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* GAUCHE: Liste Proximit\u00e9s */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Adresse */}
            <Card className="bg-white border-gray-200 rounded-xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-gray-900 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Adresse</h3>
                    <p className="text-gray-600">{project.location_address}</p>
                    <p className="text-gray-600">
                      {project.location_city}, {project.location_country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prix secteur */}
            {project.location_neighborhood_price && (
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Euro className="w-5 h-5" />
                        <h3 className="text-sm font-medium uppercase tracking-wide">Prix Secteur</h3>
                      </div>
                      <p className="text-3xl font-light">{project.location_neighborhood_price} \u20ac/m\u00b2</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Proximit\u00e9s par Cat\u00e9gorie */}
            {Object.entries(groupedProximities).map(([category, items]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || MapPin;
              const categoryLabels = {
                transport: 'Transports',
                schools: '\u00c9coles & Universit\u00e9s',
                health: 'Sant\u00e9',
                shopping: 'Commerces',
                leisure: 'Loisirs'
              };

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="bg-white border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {categoryLabels[category as keyof typeof categoryLabels] || category}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {(items as any[]).slice(0, 5).map((prox, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{prox.name}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {prox.distance && (
                                <span className="whitespace-nowrap">
                                  {prox.distance < 1000
                                    ? `${prox.distance}m`
                                    : `${(prox.distance / 1000).toFixed(1)}km`
                                  }
                                </span>
                              )}
                              {prox.time_minutes && (
                                <Badge variant="outline" className="whitespace-nowrap">
                                  {prox.time_minutes} min
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* DROITE: Carte Google Maps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:sticky lg:top-24 h-[500px] lg:h-[800px]"
          >
            <Card className="bg-white border-gray-200 rounded-xl shadow-xl overflow-hidden h-full">
              <CardContent className="p-0 h-full">
                {project.location_coordinates ? (
                  <iframe
                    src={`https://www.google.com/maps?q=${project.location_coordinates.lat},${project.location_coordinates.lng}&z=14&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Project Location Map"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">Carte non disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Note Statistique */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Donn\u00e9es march\u00e9 : 53% des acheteurs classent la localisation comme crit\u00e8re #1
          </p>
        </motion.div>
      </div>
    </section>
  );
}
