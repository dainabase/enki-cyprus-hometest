import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Star, Play, Award, Trophy, Newspaper, Users, Building2,
  TrendingUp, CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { formatNumber } from '../utils/calculations';
import { trackSectionView, trackVideoPlay } from '../utils/tracking';

interface SocialProofSectionProps {
  project: any;
}

export function SocialProofSection({ project }: SocialProofSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    if (isInView) {
      trackSectionView('social_proof');
    }
  }, [isInView]);

  const { testimonials, developer } = project;

  if (!testimonials || !developer) return null;

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
            Confiance & References
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Des milliers de clients satisfaits nous font confiance pour leurs investissements
          </p>
        </motion.div>

        <TestimonialsSection
          testimonials={testimonials}
          isInView={isInView}
          onVideoClick={(t: any) => {
            setSelectedVideo(t);
            trackVideoPlay(t.videoUrl);
          }}
        />

        <DeveloperStatsSection
          stats={developer.stats}
          isInView={isInView}
        />

        <AwardsSection
          awards={developer.awards}
          isInView={isInView}
        />

        {developer.press && (
          <PressSection
            press={developer.press}
            isInView={isInView}
          />
        )}

        <VideoModal
          testimonial={selectedVideo}
          open={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials, isInView, onVideoClick }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-20"
    >
      <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
        Temoignages Clients
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {testimonials.slice(0, 6).map((testimonial: any, index: number) => (
          <TestimonialCard
            key={index}
            testimonial={testimonial}
            index={index}
            isInView={isInView}
            onVideoClick={() => onVideoClick(testimonial)}
          />
        ))}
      </div>

      <p className="text-sm text-center text-gray-500 mt-8">
        Opportunite marche : Seulement 20% des sites immobiliers ont des testimonials.
        +68% conversion avec videos testimonials pres des CTAs.
      </p>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, index, isInView, onVideoClick }: any) {
  const hasVideo = testimonial.videoUrl && testimonial.videoThumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
    >
      <Card className="bg-white border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full">
        <CardContent className="p-6">
          {hasVideo ? (
            <div
              className="relative aspect-video mb-4 cursor-pointer group rounded-lg overflow-hidden"
              onClick={onVideoClick}
            >
              <img
                src={testimonial.videoThumbnail}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                  <Play className="w-8 h-8 text-gray-900 ml-1" />
                </div>
              </div>
              <Badge className="absolute top-3 right-3 bg-red-600 text-white">
                Video
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.photo || '/placeholder-avatar.jpg'}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">
                  {testimonial.flag} {testimonial.nationality}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            {testimonial.text}
          </p>

          {testimonial.verified && (
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verifie
            </Badge>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DeveloperStatsSection({ stats, isInView }: any) {
  if (!stats) return null;

  const statsData = [
    {
      icon: Building2,
      value: stats.experienceYears || 60,
      label: "ans d'excellence",
      suffix: ''
    },
    {
      icon: Users,
      value: stats.familiesSatisfied || 25000,
      label: 'proprietaires satisfaits',
      suffix: '+'
    },
    {
      icon: TrendingUp,
      value: stats.revenue || '3.2Mrd',
      label: 'projets livres',
      suffix: ''
    },
    {
      icon: Trophy,
      value: stats.projectsDelivered || 325,
      label: 'projets portfolio',
      suffix: ''
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-20"
    >
      <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
        Chiffres Credibilite
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0"
            >
              <CardContent className="p-8 text-center">
                <Icon className="w-10 h-10 mx-auto mb-4 text-white/80" />
                <p className="text-4xl sm:text-5xl font-light mb-2">
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                  {stat.suffix}
                </p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}

function AwardsSection({ awards, isInView }: any) {
  if (!awards || awards.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-20"
    >
      <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
        Awards & Reconnaissances
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {awards.slice(0, 8).map((award: any, index: number) => (
          <Card
            key={index}
            className="bg-white border-gray-200 hover:border-gray-900 transition-all group cursor-pointer"
          >
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 mx-auto mb-3 text-gray-700 group-hover:text-amber-600 transition" />
              <h4 className="font-medium text-sm text-gray-900 mb-2">{award.name}</h4>
              <p className="text-xs text-gray-600">{award.category}</p>
              <p className="text-xs text-gray-500 mt-1">{award.year}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function PressSection({ press, isInView }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mb-20"
    >
      <h3 className="text-2xl font-light text-gray-900 mb-8 text-center">
        Featured in...
      </h3>

      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {press.slice(0, 6).map((article: any, index: number) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
          >
            <Newspaper className="w-12 h-12 text-gray-600" />
            <p className="text-xs text-center mt-2 text-gray-600">{article.publication}</p>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

function VideoModal({ testimonial, open, onClose }: any) {
  if (!testimonial) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {testimonial.videoUrl && (
            <iframe
              src={testimonial.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Testimonial ${testimonial.name}`}
            />
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={testimonial.photo || '/placeholder-avatar.jpg'}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
              <p className="text-sm text-gray-600">
                {testimonial.flag} {testimonial.nationality}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <p className="text-gray-700">{testimonial.text}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
