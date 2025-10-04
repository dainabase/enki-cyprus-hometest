import { motion } from 'framer-motion';
import { MapPin, Plane, Anchor, Building2, Car } from 'lucide-react';
import { Suspense, lazy } from 'react';
import type { ProjectData } from '@/hooks/useProjectData';

const GoogleMapComponent = lazy(() => import('@/components/GoogleMap'));

interface ProjectLocationProps {
  project: ProjectData;
}

export function ProjectLocation({ project }: ProjectLocationProps) {
  const proximities = [
    {
      icon: Anchor,
      label: 'Plage',
      distance: `${project.proximity_sea_km || 0} km`,
      highlight: true
    },
    {
      icon: Plane,
      label: 'Aéroport',
      distance: `${project.proximity_airport_km || 0} km`
    },
    {
      icon: Building2,
      label: 'Centre-ville',
      distance: `${project.proximity_city_center_km || 0} km`
    },
    {
      icon: Car,
      label: 'Autoroute',
      distance: `${project.proximity_highway_km || 0} km`
    }
  ];

  return (
    <section id="location" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="swaarg-large-title text-primary mb-4">
            Un Emplacement d'Exception
          </h2>
          <p className="swaarg-subtitle text-muted-foreground max-w-2xl mx-auto">
            Idéalement situé à {project.city}, bénéficiez d'un accès privilégié à tous les services
          </p>
        </motion.div>

        {/* Proximities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {proximities.map((prox, index) => {
            const Icon = prox.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`bg-card border rounded-xl p-6 text-center ${
                  prox.highlight ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center ${
                  prox.highlight ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Icon className={`w-6 h-6 ${prox.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {prox.distance}
                </div>
                <div className="text-sm text-muted-foreground">
                  {prox.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-border"
        >
          <Suspense fallback={
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          }>
            <GoogleMapComponent
              properties={[]}
              center={{ lat: Number(project.latitude), lng: Number(project.longitude) }}
              zoom={14}
            />
          </Suspense>

          {/* Address Overlay */}
          <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/90 border border-white/20 rounded-xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">{project.full_address}</p>
                <p className="text-sm text-muted-foreground">{project.city}, {project.region}, Chypre</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
