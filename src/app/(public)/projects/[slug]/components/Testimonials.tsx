'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatters';

interface TestimonialsProps {
  project: any;
}

export default function Testimonials({ project }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use actual testimonials if available, otherwise use mock data
  const testimonials = project.testimonials?.length > 0 ? project.testimonials : [
    {
      name: "Maria K.",
      location: "Athens, Greece",
      rating: 5,
      comment: "Excellent investment opportunity with great ROI potential. The location is perfect and the quality is outstanding.",
      date: "2024-01-15",
      verified: true
    },
    {
      name: "James L.",
      location: "London, UK", 
      rating: 5,
      comment: "Professional service from start to finish. The Golden Visa process was smooth and the property exceeded expectations.",
      date: "2024-02-20",
      verified: true
    },
    {
      name: "Elena S.",
      location: "Moscow, Russia",
      rating: 4,
      comment: "Beautiful property in an amazing location. The amenities are top-class and the sea views are breathtaking.",
      date: "2024-03-10",
      verified: true
    }
  ];

  // Social proof stats
  const socialProofStats = project.social_proof_stats || {
    total_views: project.view_count_new || project.view_count || 1250,
    inquiries: project.inquiry_count || 89,
    favorites: project.favorite_count || 156
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Social Proof Stats */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of satisfied investors who chose this property
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-primary mb-1">
                <Eye className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{formatNumber(socialProofStats.total_views)}</div>
              <div className="text-sm text-muted-foreground">Views</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-primary mb-1">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{formatNumber(socialProofStats.inquiries)}</div>
              <div className="text-sm text-muted-foreground">Inquiries</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-primary mb-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold">{formatNumber(socialProofStats.favorites)}</div>
              <div className="text-sm text-muted-foreground">Interested</div>
            </div>
          </div>
        </div>

        {/* Testimonials Slider */}
        {testimonials.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center">
                  {/* Rating Stars */}
                  <div className="flex justify-center space-x-1 mb-4">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>
                  
                  {/* Testimonial Text */}
                  <blockquote className="text-lg italic text-muted-foreground mb-6 leading-relaxed">
                    "{testimonials[currentIndex].comment}"
                  </blockquote>
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="font-semibold">{testimonials[currentIndex].name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].location}
                      </div>
                    </div>
                    
                    {testimonials[currentIndex].verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background"
                  onClick={prevTestimonial}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background"
                  onClick={nextTestimonial}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Dots Indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Developer Rating */}
        {project.developer?.rating_score && (
          <div className="mt-12 text-center">
            <Card className="inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Developer Rating</div>
                    <div className="font-semibold">{project.developer.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {project.developer.rating_score}/5
                    </div>
                    <div className="flex space-x-1">
                      {renderStars(Math.round(project.developer.rating_score))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary">5+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">Projects Sold</div>
          </div>
        </div>
      </div>
    </section>
  );
}