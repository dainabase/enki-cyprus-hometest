import { Eye, Edit, Trash2, Building, Mail, Phone, Globe, MapPin, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Developer {
  id: string;
  name: string;
  logo?: string;
  main_city?: string;
  status?: string;
  commission_rate?: number;
  contact_info?: any;
  total_projects?: number;
  rating_score?: number;
  founded_year?: number;
  years_experience?: number;
  main_activities?: string;
  key_projects?: string;
  website?: string;
  financial_stability?: string;
  payment_terms?: string;
}

interface DeveloperDetailedViewProps {
  developers: Developer[];
  getLogo: (dev: Developer) => string | undefined;
  onEdit: (dev: Developer) => void;
  onDelete: (dev: Developer) => void;
  onViewDetails: (dev: Developer) => void;
}

export const DeveloperDetailedView = ({ 
  developers, 
  getLogo, 
  onEdit, 
  onDelete, 
  onViewDetails 
}: DeveloperDetailedViewProps) => {
  return (
    <div className="space-y-8">
      {developers.map(dev => (
        <Card key={dev.id} className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <CardHeader className="pb-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/20">
                  {getLogo(dev) ? (
                    <img 
                      src={getLogo(dev)} 
                      alt={`${dev.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {dev.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-2xl font-bold text-white">{dev.name}</h3>
                    <Badge 
                      variant={dev.status === 'active' ? 'default' : 'secondary'}
                      className={`
                        ${dev.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-white/20 text-white border-white/30'
                        }
                      `}
                    >
                      {dev.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                    {dev.rating_score && (
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-white">{dev.rating_score}/10</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-white/80">
                    {dev.main_city && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{dev.main_city}</span>
                      </div>
                    )}
                    
                    {dev.founded_year && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>Fondé en {dev.founded_year}</span>
                      </div>
                    )}
                    
                    {dev.years_experience && (
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{dev.years_experience} ans d'expérience</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-200"
                  onClick={() => onViewDetails(dev)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-200"
                  onClick={() => onEdit(dev)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-red-500/20 border-red-300/50 text-red-200 hover:bg-red-500/30 transition-all duration-200"
                  onClick={() => onDelete(dev)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                  <h4 className="font-bold text-slate-900 text-lg">Contact</h4>
                </div>
                <div className="space-y-3">
                  {dev.contact_info?.email && (
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-blue-900 truncate">{dev.contact_info.email}</span>
                    </div>
                  )}
                  
                  {dev.contact_info?.phone && (
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-green-50 border border-green-200">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium text-green-900">{dev.contact_info.phone}</span>
                    </div>
                  )}
                  
                  {dev.website && (
                    <div className="flex items-center space-x-3 p-3 rounded-xl bg-purple-50 border border-purple-200">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-purple-600" />
                      </div>
                      <a 
                        href={dev.website.startsWith('http') ? dev.website : `https://${dev.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-600 hover:text-purple-800 font-medium underline truncate transition-colors"
                      >
                        {dev.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Statistiques */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full"></div>
                  <h4 className="font-bold text-slate-900 text-lg">Statistiques</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-800 font-medium">Stabilité financière:</span>
                      <span className="font-bold text-amber-900">{dev.financial_stability || 'N/A'}</span>
                    </div>
                  </div>
                  {dev.rating_score && (
                    <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-800 font-medium">Note:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="font-bold text-yellow-900">{dev.rating_score}/10</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Activités */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-slate-600 to-slate-400 rounded-full"></div>
                  <h4 className="font-bold text-slate-900 text-lg">Activités</h4>
                </div>
                <div className="space-y-3">
                  {dev.main_activities && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <p className="text-slate-700 font-medium">{dev.main_activities}</p>
                    </div>
                  )}
                  {dev.payment_terms && (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                      <div className="space-y-1">
                        <span className="text-indigo-800 font-medium text-sm">Conditions de paiement:</span>
                        <p className="text-indigo-900 font-medium">{dev.payment_terms}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {dev.key_projects && (
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-emerald-400 rounded-full"></div>
                  <h4 className="font-bold text-slate-900 text-lg">Projets clés</h4>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-emerald-900 font-medium leading-relaxed">{dev.key_projects}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};