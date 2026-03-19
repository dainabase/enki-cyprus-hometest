import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// TODO: Connect to Supabase - fetch developers list
const partners = [
  'LEPTOS Group',
  'PAFILIA Property',
  'CYBARCO-CITYCHAMP',
  'ARISTO Developers',
  'LIMASSOL DEL MAR',
  'IMPERIO Properties',
  'DEMETRA Group',
  'GIOVANI Group',
  'ALTAMIRA',
  'KORANTINA Homes'
];
import { 
  Building2, 
  Users, 
  Award, 
  Globe, 
  Shield, 
  TrendingUp, 
  Heart, 
  Star 
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Transparence',
      description: 'Nous privilégions la clarté et l\'honnêteté dans toutes nos relations clients.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous nous efforçons de dépasser les attentes avec un service premium.'
    },
    {
      icon: Heart,
      title: 'Engagement',
      description: 'Votre satisfaction et votre réussite sont au cœur de nos priorités.'
    },
    {
      icon: Globe,
      title: 'Expertise Locale',
      description: 'Une connaissance approfondie du marché immobilier chypriote.'
    }
  ];

  const team = [
    {
      name: 'Marie Dubois',
      role: 'Directrice Générale',
      expertise: '15+ ans d\'expérience immobilière',
      description: 'Spécialiste en investissements de luxe et accompagnement international.'
    },
    {
      name: 'Andreas Christou',
      role: 'Expert Local',
      expertise: 'Natif de Chypre',
      description: 'Connaissance approfondie du marché local et des réglementations.'
    },
    {
      name: 'Sophie Laurent',
      role: 'Conseillère Clientèle',
      expertise: 'Trilingue FR/EN/GR',
      description: 'Accompagnement personnalisé pour les clients francophones.'
    },
    {
      name: 'Dimitris Papadopoulos',
      role: 'Directeur Commercial',
      expertise: '12+ ans en développement',
      description: 'Relations privilégiées avec les meilleurs promoteurs de l\'île.'
    }
  ];

  const achievements = [
    { icon: Building2, value: '500+', label: 'Propriétés vendues' },
    { icon: Users, value: '1000+', label: 'Clients satisfaits' },
    { icon: Star, value: '4.9/5', label: 'Note moyenne' },
    { icon: TrendingUp, value: '€50M+', label: 'Volume de ventes' }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              À Propos d'ENKI-REALTY
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Votre partenaire de confiance pour découvrir et acquérir 
              les plus belles propriétés de Chypre
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Depuis notre création, ENKI-REALTY s'est imposée comme la référence 
                en matière d'immobilier premium à Chypre. Nous accompagnons nos clients 
                internationaux dans la découverte et l'acquisition de propriétés d'exception 
                sur cette île méditerranéenne unique.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Notre expertise combine une connaissance approfondie du marché local 
                avec un service personnalisé de haute qualité, garantissant à nos clients 
                une expérience d'achat sereine et réussie.
              </p>
              <Button className="btn-premium">
                Découvrir notre approche
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="text-center p-6 card-hover bg-gradient-card">
                    <achievement.icon className="w-8 h-8 mx-auto text-primary mb-3" />
                    <div className="text-2xl font-bold text-primary mb-1">
                      {achievement.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.label}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nos Valeurs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre travail quotidien et notre relation avec nos clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 card-hover bg-gradient-card h-full">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-premium rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Notre Équipe Experte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des professionnels passionnés, alliant expertise locale et vision internationale
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center card-hover bg-gradient-card">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-premium rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <Badge variant="outline" className="mb-2">
                      {member.role}
                    </Badge>
                    <div className="text-sm text-primary font-medium mb-3">
                      {member.expertise}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nos Partenaires Développeurs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nous collaborons exclusivement avec les meilleurs promoteurs de Chypre
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {partners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 card-hover bg-gradient-card">
                  <div className="text-center">
                    <Building2 className="w-8 h-8 mx-auto text-primary mb-3" />
                    <div className="text-sm font-medium text-foreground">
                      {partner}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Rejoignez Notre Communauté
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Bénéficiez de notre expertise et découvrez les meilleures opportunités 
              d'investissement immobilier à Chypre.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
              >
                Prendre rendez-vous
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
              >
                Télécharger notre brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;