import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Euro, Home, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SearchFormData {
  propertyType: string;
  budget: string;
  location: string;
}

const AgenticSearchForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<SearchFormData>({
    propertyType: '',
    budget: '',
    location: ''
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'maison', label: 'Maison' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const budgetRanges = [
    { value: '0-200000', label: 'Jusqu\'à 200 000€' },
    { value: '200000-500000', label: '200 000€ - 500 000€' },
    { value: '500000-1000000', label: '500 000€ - 1 000 000€' },
    { value: '1000000-2000000', label: '1 000 000€ - 2 000 000€' },
    { value: '2000000+', label: 'Plus de 2 000 000€' }
  ];

  const locations = [
    { value: 'paphos', label: 'Paphos' },
    { value: 'limassol', label: 'Limassol' },
    { value: 'larnaca', label: 'Larnaca' },
    { value: 'nicosie', label: 'Nicosie' },
    { value: 'ayia-napa', label: 'Ayia Napa' },
    { value: 'protaras', label: 'Protaras' },
    { value: 'coral-bay', label: 'Coral Bay' }
  ];

  const handleInputChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Construire l'URL avec les paramètres de recherche
    const searchParams = new URLSearchParams();
    if (formData.propertyType) searchParams.append('type', formData.propertyType);
    if (formData.budget) searchParams.append('budget', formData.budget);
    if (formData.location) searchParams.append('location', formData.location);
    
    navigate(`/search?${searchParams.toString()}`);
  };

  const isFormValid = formData.propertyType && formData.budget && formData.location;

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-white/20 shadow-xl max-w-4xl mx-auto">
      <CardContent className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Recherche agentique de votre bien immobilier
            </h2>
            <p className="text-muted-foreground text-lg">
              Laissez notre IA vous guider vers la propriété parfaite à Chypre
            </p>
          </div>

          {/* Form Fields */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {/* Type de bien */}
            <motion.div 
              className="space-y-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Label htmlFor="propertyType" className="flex items-center gap-2 text-sm font-medium">
                <Home className="w-4 h-4 text-primary" />
                Type de bien
              </Label>
              <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choisir un type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Budget */}
            <motion.div 
              className="space-y-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium">
                <Euro className="w-4 h-4 text-primary" />
                Budget
              </Label>
              <Select onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Fourchette de prix" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((budget) => (
                    <SelectItem key={budget.value} value={budget.value}>
                      {budget.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Localisation */}
            <motion.div 
              className="space-y-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                Localisation à Chypre
              </Label>
              <Select onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choisir une ville" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>

          {/* Search Button */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: isFormValid ? 1.05 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={handleSearch}
                disabled={!isFormValid}
                size="lg"
                className="px-12 py-4 text-lg font-semibold btn-premium"
              >
                <Search className="w-5 h-5 mr-2" />
                Lancer la recherche agentique
              </Button>
            </motion.div>

            {/* CTA Inscription */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-4 border-t border-border/20"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Personnalisez votre recherche et recevez des alertes
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    asChild
                    className="border-primary/30 hover:bg-primary/5"
                  >
                    <Link to="/register">
                      <UserPlus className="w-4 h-4 mr-2" />
                      S'inscrire pour personnaliser
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default AgenticSearchForm;