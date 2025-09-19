import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MapPin, Home, Building, Star, Phone, Mail, Globe } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  city?: string;
  address?: string;
  photos?: string[];
  ai_description?: string;
  price?: number;
  [key: string]: any;
}

interface ProjectImageData {
  [key: string]: any;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects_clean')
          .select(`
            *,
            project_images(*)
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching project:', error);
          toast.error('Error loading project');
          return;
        }

        if (data) {
          setProject(data);
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project not found</h1>
            <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-primary to-primary-dark">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative h-full flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <MapPin className="h-4 w-4" />
                <span>{project.city} {project.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.ai_description || project.description || 'No description available.'}
                  </p>
                </CardContent>
              </Card>

              {/* Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.photos && project.photos.length > 0 ? (
                      project.photos.slice(0, 4).map((photo: string, index: number) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                          <OptimizedImage
                            src={photo}
                            alt={`${project.title} - Image ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No images available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">Contact for details</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{(project as any).property_type || 'Residential'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline">{project.status || 'Available'}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Request Info
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}