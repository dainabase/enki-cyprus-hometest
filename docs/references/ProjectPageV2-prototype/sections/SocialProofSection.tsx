import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, Play, Award as AwardIcon, TrendingUp, Users, Building, Calendar, Shield, CircleCheck as CheckCircle2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjectSocialProof } from '@/hooks/useProjectSocialProof';
import { trackSectionView } from '../utils/tracking';

interface SocialProofSectionProps {
  project: any;
}

export function SocialProofSection({ project }: SocialProofSectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const developerId = project?.developer_id;
  const { data: socialProof, isLoading } = useProjectSocialProof(project?.id, developerId);

  useEffect(() => {
    if (isInView) {
      trackSectionView('social_proof');
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <section className="w-full bg-white py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!socialProof) return null;

  const hasTestimonials = socialProof.testimonials.length > 0;
  const hasAwards = socialProof.awards.length > 0;
  const hasPress = socialProof.press_mentions.length > 0;
  const hasStats = socialProof.developer_stats;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-white to-gray-50 py-16 sm:py-20 md:py-24"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            Preuve <span className="font-normal">Sociale</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez ce que disent nos clients et la reconnaissance de notre excellence
          </p>
        </motion.div>

        {hasStats && (
          <DeveloperStats stats={socialProof.developer_stats!} isInView={isInView} />
        )}

        {hasTestimonials && (
          <TestimonialsCarousel testimonials={socialProof.testimonials} isInView={isInView} />
        )}

        {hasAwards && (
          <AwardsShowcase awards={socialProof.awards} isInView={isInView} />
        )}

        {hasPress && (
          <PressMentionsGrid pressMentions={socialProof.press_mentions} isInView={isInView} />
        )}

        {hasStats && socialProof.developer_stats!.certifications && (
          <CertificationsDisplay certifications={socialProof.developer_stats!.certifications!} isInView={isInView} />
        )}
      </div>
    </section>
  );
}

function DeveloperStats({ stats, isInView }: { stats: any; isInView: boolean }) {
  const statItems = [
    { label: 'Années d\'expérience', value: stats.years_experience, icon: Calendar, suffix: ' ans' },
    { label: 'Projets livrés', value: stats.projects_completed, icon: Building },
    { label: 'Unités livrées', value: stats.units_delivered, icon: TrendingUp },
    { label: 'Familles satisfaites', value: stats.families_satisfied, icon: Users },
  ].filter(s => s.value);

  if (statItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
    >
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <motion.p
                className="text-4xl font-bold text-blue-600 mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {stat.value?.toLocaleString()}{stat.suffix || ''}
              </motion.p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        );
      })}

      {stats.average_customer_rating && (
        <Card className="text-center hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <motion.p
                    className="text-5xl font-bold text-amber-600"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {stats.average_customer_rating.toFixed(1)}
                  </motion.p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(stats.average_customer_rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{stats.total_reviews} avis clients</p>
              </div>
              {stats.repeat_customer_rate && (
                <div className="border-l-2 border-gray-200 pl-8">
                  <p className="text-3xl font-bold text-green-600">{stats.repeat_customer_rate}%</p>
                  <p className="text-sm text-gray-600">Clients récurrents</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function TestimonialsCarousel({ testimonials, isInView }: { testimonials: any[]; isInView: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-16"
    >
      <h3 className="text-2xl font-light text-center mb-8">
        Témoignages <span className="font-normal">Clients</span>
      </h3>

      <div className="relative">
        <div className="overflow-hidden">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} delay={0.1 * index} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, delay, isInView }: { testimonial: any; delay: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="h-full hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            {testimonial.client_photo_url && (
              <img
                src={testimonial.client_photo_url}
                alt={testimonial.client_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{testimonial.client_name}</h4>
                  {testimonial.client_title && (
                    <p className="text-sm text-gray-600">{testimonial.client_title}</p>
                  )}
                  {testimonial.client_location && (
                    <p className="text-xs text-gray-500">{testimonial.client_location}</p>
                  )}
                </div>
                {testimonial.is_verified && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <Quote className="w-8 h-8 text-gray-300 absolute -top-2 -left-2" />
            <p className="text-gray-700 relative z-10 pl-6">{testimonial.testimonial_text}</p>
          </div>

          {testimonial.video_url && (
            <button className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
              <Play className="w-4 h-4" />
              <span className="text-sm font-medium">Voir la vidéo</span>
            </button>
          )}

          {(testimonial.purchase_type || testimonial.unit_type) && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
              {testimonial.purchase_type && <Badge variant="outline">{testimonial.purchase_type}</Badge>}
              {testimonial.unit_type && <Badge variant="outline">{testimonial.unit_type}</Badge>}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AwardsShowcase({ awards, isInView }: { awards: any[]; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-16"
    >
      <h3 className="text-2xl font-light text-center mb-8">
        Prix & <span className="font-normal">Reconnaissances</span>
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {awards.slice(0, 4).map((award, index) => (
          <motion.div
            key={award.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="text-center hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                {award.award_logo_url ? (
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <img
                      src={award.award_logo_url}
                      alt={award.award_name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <AwardIcon className="w-12 h-12 text-white" />
                  </div>
                )}

                {award.award_level && (
                  <Badge className="mb-3 bg-amber-100 text-amber-800 border-amber-300">
                    {award.award_level}
                  </Badge>
                )}

                <h4 className="font-semibold mb-2">{award.award_name}</h4>
                <p className="text-sm text-gray-600 mb-2">{award.issuing_organization}</p>
                <p className="text-xs text-gray-500">
                  {new Date(award.award_date).getFullYear()}
                </p>

                {award.description && (
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{award.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PressMentionsGrid({ pressMentions, isInView }: { pressMentions: any[]; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mb-16"
    >
      <h3 className="text-2xl font-light text-center mb-8">
        Dans la <span className="font-normal">Presse</span>
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pressMentions.slice(0, 6).map((press, index) => (
          <motion.div
            key={press.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="h-full hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                {press.publication_logo_url && (
                  <div className="h-12 flex items-center justify-center mb-3">
                    <img
                      src={press.publication_logo_url}
                      alt={press.publication_name}
                      className="max-h-full object-contain"
                    />
                  </div>
                )}
                <h4 className="font-semibold text-lg line-clamp-2">{press.article_title}</h4>
              </CardHeader>
              <CardContent>
                {press.article_excerpt && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{press.article_excerpt}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  {press.author_name && <span>Par {press.author_name}</span>}
                  <span>{new Date(press.published_date).toLocaleDateString('fr-FR')}</span>
                </div>

                {press.article_url && (
                  <a
                    href={press.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Lire l'article
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {press.article_category && (
                  <Badge variant="outline" className="mt-3">
                    {press.article_category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CertificationsDisplay({ certifications, isInView }: { certifications: any[]; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-2xl font-light text-center mb-8">
        Certifications & <span className="font-normal">Accréditations</span>
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{cert.name}</p>
                    <p className="text-xs text-gray-600 truncate">{cert.organization}</p>
                    <p className="text-xs text-gray-500">{cert.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
