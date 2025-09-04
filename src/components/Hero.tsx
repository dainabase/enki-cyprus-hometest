import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, MapPin, TrendingUp, Home, Euro, UserPlus } from 'lucide-react';
import cyprusHero from '@/assets/cyprus-hero.jpg';
import { useABTestVariant } from '@/hooks/useABTest';
import { trackCustomEvent } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';


const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    propertyType: '',
    budget: '',
    location: ''
  });

  const { value: ctaText, variant } = useABTestVariant(
    'hero_cta_button',
    'Découvrez Projets',
    'Trouvez Votre Bien'
  );

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

  const handleInputChange = (field: string, value: string) => {
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
    
    trackCustomEvent('hero_search_clicked', {
      variant: variant,
      property_type: formData.propertyType,
      budget: formData.budget,
      location: formData.location
    });
  };

  const handleCTAClick = () => {
    trackCustomEvent('hero_cta_clicked', {
      variant: variant,
      button_text: ctaText
    });
  };

  const isFormValid = formData.propertyType && formData.budget && formData.location;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${cyprusHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Main Heading */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Découvrez l'immobilier
            <span className="block text-transparent bg-gradient-to-r from-white to-blue-200 bg-clip-text">
              premium à Chypre
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Votre partenaire de confiance pour acquérir des propriétés d'exception 
            dans le paradis méditerranéen de Chypre
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="w-5 h-5 text-blue-200" />
              <span className="text-lg font-medium">5+ villes couvertes</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <TrendingUp className="w-5 h-5 text-blue-200" />
              <span className="text-lg font-medium">500+ propriétés</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Search className="w-5 h-5 text-blue-200" />
              <span className="text-lg font-medium">Recherche intelligente</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={handleCTAClick}
            >
              <Search className="w-5 h-5 mr-2" />
              {ctaText}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              Découvrir nos projets
            </Button>
          </motion.div>

          {/* Formulaire de Recherche Agentique */}
          <motion.div 
            className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="flex items-center justify-center space-x-2 text-white mb-6">
              <Search className="w-5 h-5" />
              <span className="font-medium text-lg">Faire une recherche agentique de mon bien immobilier</span>
            </div>
            
            <div className="bg-white/5 rounded-lg border border-white/10 p-6">
              {/* Form Fields */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
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
                  <Label htmlFor="propertyType" className="flex items-center gap-2 text-sm font-medium text-white">
                    <Home className="w-4 h-4 text-blue-200" />
                    Type de bien
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger className="h-12 bg-white/90 text-gray-900 border-white/20">
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
                  <Label htmlFor="budget" className="flex items-center gap-2 text-sm font-medium text-white">
                    <Euro className="w-4 h-4 text-blue-200" />
                    Budget
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger className="h-12 bg-white/90 text-gray-900 border-white/20">
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
                  <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium text-white">
                    <MapPin className="w-4 h-4 text-blue-200" />
                    Localisation à Chypre
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger className="h-12 bg-white/90 text-gray-900 border-white/20">
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
                    className="px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                    className="pt-4 border-t border-white/20"
                  >
                    <p className="text-sm text-blue-100 mb-3">
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
                        className="border-white/30 text-white bg-white/10 hover:bg-white/20"
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
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div 
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-white rounded-full mt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;