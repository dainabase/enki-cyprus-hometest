import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, Euro } from 'lucide-react';
import type { ProjectData } from '@/hooks/useProjectData';

interface ProjectUnitsProps {
  project: ProjectData;
}

export function ProjectUnits({ project }: ProjectUnitsProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = ['all', ...new Set(project.properties?.map(p => p.property_type) || [])];

  const filteredUnits = selectedType === 'all'
    ? project.properties
    : project.properties?.filter(p => p.property_type === selectedType);

  return (
    <section id="units" className="py-24 md:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="swaarg-large-title text-primary mb-4">
            Typologies Disponibles
          </h2>
          <p className="swaarg-subtitle text-muted-foreground max-w-2xl mx-auto mb-8">
            Choisissez parmi notre sélection de {project.units_available} unités disponibles
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {types.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                onClick={() => setSelectedType(type)}
                className={selectedType === type ? 'bg-primary hover:bg-primary-hover' : ''}
              >
                {type === 'all' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits?.slice(0, 9).map((unit, index) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all"
            >
              <div className="relative h-48">
                <img
                  src={unit.property_images?.[0]?.url || '/placeholder.svg'}
                  alt={`${unit.property_type} ${unit.bedrooms_count} bed`}
                  className="w-full h-full object-cover"
                />
                {unit.sale_status === 'available' && (
                  <Badge className="absolute top-3 right-3 bg-green-500">Disponible</Badge>
                )}
              </div>
              <div className="p-5">
                <h3 className="swaarg-card-title mb-3">
                  {unit.property_sub_type || unit.property_type}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {unit.bedrooms_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {unit.bathrooms_count}
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    {unit.internal_area}m²
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary font-bold text-xl">
                    <Euro className="w-5 h-5" />
                    {unit.price_including_vat?.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
