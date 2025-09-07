import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Property {
  id: string;
  title: string;
  description?: string;
  location: string;
  priceValue?: number;
  photos?: string[];
  features?: string[];
}

interface FeaturedProjectsCarouselProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  onTrackEvent: (eventName: string, data: any) => void;
}

export const FeaturedProjectsCarousel = ({ 
  properties, 
  onPropertyClick, 
  onTrackEvent 
}: FeaturedProjectsCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      dragFree: false,
      containScroll: 'trimSnaps'
    }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  if (!properties.length) return null

  return (
    <div className="relative">
      {/* Carousel */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {properties.map((property, index) => (
            <div key={property.id} className="embla__slide flex-[0_0_100%] min-w-0 pl-4">
              <motion.div
                className="relative bg-card border-border/50 rounded-3xl shadow-premium overflow-hidden backdrop-blur-sm h-[600px]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Background Parallax Image */}
                <motion.div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url(${property.photos?.[0] || 'https://picsum.photos/1200/800?random=' + property.id})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                </motion.div>
                
                {/* Glassmorphism Overlay */}
                <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8 backdrop-blur-sm bg-background/30 h-full">
                  {/* Property Info Column */}
                  <motion.div 
                    className="lg:w-1/2 space-y-6"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h3 className="text-3xl lg:text-5xl font-light tracking-tight text-white">{property.title}</h3>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-5 h-5" />
                      <span>{property.location}</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      €{Number(property.priceValue || 0).toLocaleString()}
                    </Badge>
                    <p className="text-white/90 leading-relaxed">
                      {property.description || 'Une propriété premium offrant des équipements modernes et des vues exceptionnelles.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(property.features || []).slice(0, 4).map((feature: string, i: number) => (
                        <Badge key={i} className="bg-white/10 text-white border-white/20">{feature}</Badge>
                      ))}
                    </div>
                    <Button 
                      onClick={() => {
                        onTrackEvent('featured_property_clicked', {
                          property_id: property.id,
                          property_title: property.title,
                          property_location: property.location,
                          section: 'featured_projects_carousel'
                        });
                        onPropertyClick(property);
                      }}
                      className="bg-white text-primary hover:bg-white/90 mt-4"
                    >
                      Explorer la propriété
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  
                  {/* Image Column */}
                  <motion.div 
                    className="lg:w-1/2 h-64 lg:h-96 overflow-hidden rounded-2xl"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <motion.img
                      src={property.photos?.[1] || property.photos?.[0] || 'https://picsum.photos/600/400?random=' + (property.id + '2')}
                      alt={`${property.title} - Vue détaillée`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {properties.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === selectedIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/40 hover:bg-white/60"
              )}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default FeaturedProjectsCarousel