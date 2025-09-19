import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PropertySearch from '@/components/PropertySearch';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building, Star, TrendingUp, Euro, MessageSquare } from 'lucide-react';
import { LexaiaCalculator } from '@/components/LexaiaCalculator';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
}

export default function LexaiaPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCalculatorSubmit = useCallback(async (data: any) => {
    setLoading(true);
    try {
      // Fetch properties
      const { data: projectsData, error } = await supabase
        .from('projects_clean')
        .select('id, title, city, address, description')
        .limit(5);

      if (error) throw error;

      const transformedProperties = (projectsData || []).map((property: any) => ({
        id: property.id,
        title: property.title,
        price: 0,
        location: `${property.city || ''} ${property.address || ''}`.trim(),
        description: property.description || ''
      }));

      setProperties(transformedProperties);
      
      toast.success('Properties loaded successfully!');
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Lexaia AI Property Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your perfect property investment with AI-powered recommendations
              </p>
            </div>

            {/* Calculator Component */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Property Investment Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LexaiaCalculator />
              </CardContent>
            </Card>

            {/* Results */}
            {properties.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Recommended Properties
                </h2>
                <div className="grid gap-6">
                  {properties.map((property) => (
                    <Card key={property.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{property.location}</span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            Investment Ready
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {property.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center text-primary">
                              <Euro className="h-4 w-4 mr-1" />
                              <span className="font-semibold">Contact for Price</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => navigate(`/projects/${property.id}`)}
                            variant="outline"
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading recommendations...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}