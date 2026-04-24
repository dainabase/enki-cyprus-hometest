import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Bed, Bath, Maximize2, TrendingUp, Download, Eye, Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '../utils/calculations';
import { trackSectionView, trackPlanDownload } from '../utils/tracking';

interface UnitTypologiesSectionProps {
  project: any;
}

export function UnitTypologiesSection({ project }: UnitTypologiesSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [sortBy, setSortBy] = useState('price');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (isInView) {
      trackSectionView('unit_typologies');
    }
  }, [isInView]);

  if (!project.unitTypes || project.unitTypes.length === 0) {
    return null;
  }

  const filteredUnits = project.unitTypes
    .filter((unit: any) => filterType === 'all' || unit.category === filterType)
    .sort((a: any, b: any) => {
      if (sortBy === 'price') return a.priceFrom - b.priceFrom;
      if (sortBy === 'surface') return b.surfaceTotal - a.surfaceTotal;
      return 0;
    });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-16 sm:py-20 md:py-24"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            Typologies & Disponibilites
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
            Plans detailles et disponibilites en temps reel. 31% des acheteurs
            classent les plans comme l'information #1.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="apartment">Appartements</SelectItem>
                <SelectItem value="penthouse">Penthouses</SelectItem>
                <SelectItem value="villa">Villas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Prix croissant</SelectItem>
              <SelectItem value="surface">Surface decroissante</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredUnits.map((unit: any, index: number) => (
            <UnitCard
              key={unit.id || index}
              unit={unit}
              index={index}
              isInView={isInView}
              onClick={() => setSelectedUnit(unit)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Donnees marche : 31% des acheteurs classent les plans comme information #1
          </p>
        </motion.div>
      </div>

      <PlanModal
        unit={selectedUnit}
        open={!!selectedUnit}
        onClose={() => setSelectedUnit(null)}
      />
    </section>
  );
}

function UnitCard({ unit, index, isInView, onClick }: any) {
  const isUrgent = unit.availableCount > 0 && unit.availableCount < 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="bg-white border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {unit.floorPlan3D ? (
            <img
              src={unit.floorPlan3D}
              alt={`Plan ${unit.name}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Maximize2 className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {unit.status === 'Disponible' && isUrgent && (
            <Badge className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 animate-pulse">
              {unit.availableCount} restantes
            </Badge>
          )}

          {unit.status === 'Reserve' && (
            <Badge className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1">
              Reserve
            </Badge>
          )}

          {unit.status === 'Vendu' && (
            <Badge className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1">
              Vendu
            </Badge>
          )}
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-medium text-gray-900 mb-2">{unit.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{unit.bedrooms} ch</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{unit.bathrooms} sdb</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize2 className="w-4 h-4" />
                <span>{unit.surfaceTotal}m²</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-2xl font-light text-gray-900 mb-1">
              A partir de {formatCurrency(unit.priceFrom)}
            </p>
            <p className="text-sm text-gray-600">
              {formatCurrency(unit.pricePerSqm)}/m²
            </p>
          </div>

          {unit.orientation && (
            <div className="mb-4">
              <Badge variant="outline" className="text-xs">
                Orientation {unit.orientation}
              </Badge>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={onClick}
              className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlanModal({ unit, open, onClose }: any) {
  if (!unit) return null;

  const handleDownload = (type: string) => {
    trackPlanDownload(`${unit.name}-${type}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-light">{unit.name}</DialogTitle>
        <DialogDescription className="text-gray-600">
          Plans detailles 2D et 3D avec mesures precises
        </DialogDescription>

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Bed className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <p className="text-sm text-gray-600">Chambres</p>
              <p className="text-xl font-medium">{unit.bedrooms}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Bath className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <p className="text-sm text-gray-600">Salles de bain</p>
              <p className="text-xl font-medium">{unit.bathrooms}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Maximize2 className="w-6 h-6 mx-auto mb-2 text-gray-700" />
              <p className="text-sm text-gray-600">Surface totale</p>
              <p className="text-xl font-medium">{unit.surfaceTotal}m²</p>
            </div>
          </div>

          {unit.floorPlan3D && (
            <div>
              <h4 className="text-lg font-medium mb-3">Plan 3D Isometrique</h4>
              <img
                src={unit.floorPlan3D}
                alt={`Plan 3D ${unit.name}`}
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
          )}

          {unit.floorPlan2D && (
            <div>
              <h4 className="text-lg font-medium mb-3">Plan 2D Technique</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Plan technique avec mesures precises Carrez
                </p>
                <Button
                  onClick={() => handleDownload('2d')}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Telecharger PDF Plan 2D
                </Button>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-light mb-1">
                  {formatCurrency(unit.priceFrom)}
                </p>
                <p className="text-sm text-white/70">
                  {formatCurrency(unit.pricePerSqm)}/m² • {unit.surfaceTotal}m²
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>

            {unit.availableCount > 0 && (
              <Badge className="bg-white/20 text-white border-white/30">
                {unit.availableCount} unites disponibles
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
