import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  MapPin, 
  Euro, 
  TrendingUp, 
  Building, 
  Shield, 
  FileText,
  ExternalLink,
  Brain,
  Calculator
} from 'lucide-react';

interface AgenticSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: any;
}

const AgenticSearchModal = ({ isOpen, onClose, results }: AgenticSearchModalProps) => {
  if (!results) return null;

  const { parsed_query, properties, lexaia_analysis, pdf_url } = results;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDownloadPDF = () => {
    // En production, cela téléchargerait le vrai PDF
    window.open(pdf_url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Brain className="w-6 h-6 text-primary" />
            Résultats de votre recherche agentique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profil client analysé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Analyse de votre profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Pays d'origine</span>
                    <p className="font-medium">{parsed_query?.pays_origine}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <p className="font-medium">{formatPrice(parsed_query?.budget)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Type d'investissement</span>
                    <p className="font-medium capitalize">{parsed_query?.type_investissement}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Localisation préférée</span>
                    <p className="font-medium">{parsed_query?.localisation_preferee}</p>
                  </div>
                </div>
                {parsed_query?.objectifs && (
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">Objectifs</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {parsed_query.objectifs.map((objectif: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {objectif}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Propriétés sélectionnées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Propriétés recommandées ({properties?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties?.map((property: any, index: number) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
                        {property.photos?.[0] ? (
                          <img 
                            src={property.photos[0]} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Building className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{property.location?.city || 'Chypre'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Euro className="w-4 h-4 text-primary" />
                          <span className="font-medium text-lg text-primary">
                            {formatPrice(property.price)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {property.description}
                        </p>
                        {property.features && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {property.features.slice(0, 3).map((feature: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button 
                        asChild 
                        className="w-full mt-3" 
                        variant="outline"
                        size="sm"
                      >
                        <Link to={`/projects/${property.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Voir les détails
                        </Link>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analyse fiscale Lexaia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Analyse d'optimisation fiscale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Économies fiscales */}
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Économies potentielles</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatPrice(lexaia_analysis?.tax_saved || 0)}/an
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Optimisations fiscales</h4>
                      <ul className="space-y-1">
                        {lexaia_analysis?.optimisation_fiscale?.map((item: string, index: number) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Règles d'achat */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Règles d'achat à Chypre</h4>
                      <ul className="space-y-1">
                        {lexaia_analysis?.regles_achat?.map((regle: string, index: number) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            {regle}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {lexaia_analysis?.societe_recommandee && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">
                          Recommandation : Création de société
                        </h4>
                        <p className="text-sm text-blue-700">
                          Avec votre budget, la création d'une société chypriote pourrait 
                          optimiser davantage vos avantages fiscaux.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scénarios comparatifs */}
                {lexaia_analysis?.scenarios && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-4">Scénarios comparatifs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Achat en nom propre</h5>
                        <p className="text-sm text-muted-foreground">
                          Taux d'imposition : {lexaia_analysis.scenarios.particulier?.tax_rate}
                        </p>
                        <p className="text-sm">
                          {lexaia_analysis.scenarios.particulier?.benefits}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-primary/5">
                        <h5 className="font-medium text-sm mb-2">Via société chypriote</h5>
                        <p className="text-sm text-muted-foreground">
                          Taux d'imposition : {lexaia_analysis.scenarios.societe?.tax_rate}
                        </p>
                        <p className="text-sm">
                          {lexaia_analysis.scenarios.societe?.benefits}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button onClick={handleDownloadPDF} className="flex-1" size="lg">
              <Download className="w-5 h-5 mr-2" />
              Télécharger le dossier complet (PDF)
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1" size="lg">
              Fermer
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgenticSearchModal;