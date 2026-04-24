import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormAutosave } from '@/hooks/useFormAutosave';
import { toast } from 'sonner';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Calendar,
  Globe,
  Send 
} from 'lucide-react';
import { logger } from '@/lib/logger';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    propertyType: '',
    budget: ''
  });

  // Initialize autosave for contact form
  const { isAutoSaving, loadDraft, clearDraft } = useFormAutosave({
    table: 'contact_drafts',
    formData,
    enabled: true,
    showToasts: false
  });

  // Load draft on component mount
  useEffect(() => {
    const loadContactDraft = async () => {
      const draft = await loadDraft();
      if (draft && draft.form_data) {
        const draftData = draft.form_data as any;
        setFormData({
          firstName: draftData.firstName || '',
          lastName: draftData.lastName || '',
          email: draftData.email || '',
          phone: draftData.phone || '',
          subject: draftData.subject || '',
          message: draftData.message || '',
          propertyType: draftData.propertyType || '',
          budget: draftData.budget || ''
        });
        toast.info('Brouillon de contact restauré');
      }
    };

    loadContactDraft();
  }, [loadDraft]);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Limassol Marina', 'Chypre, 3601'],
      link: '#'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+357 25 123 456', '+357 99 987 654'],
      link: 'tel:+35725123456'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@enki-realty.com', 'info@enki-realty.com'],
      link: 'mailto:contact@enki-realty.com'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lun - Ven: 9h - 18h', 'Sam: 10h - 16h'],
      link: '#'
    }
  ];

  const services = [
    {
      icon: MessageSquare,
      title: 'Consultation Gratuite',
      description: 'Échangez avec nos experts pour définir vos besoins et objectifs.',
      cta: 'Réserver un appel'
    },
    {
      icon: Calendar,
      title: 'Visite Personnalisée',
      description: 'Organisez une visite guidée des propriétés qui vous intéressent.',
      cta: 'Programmer une visite'
    },
    {
      icon: Globe,
      title: 'Accompagnement Complet',
      description: 'De la recherche à la signature, nous vous accompagnons à chaque étape.',
      cta: 'En savoir plus'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    logger.info('Form submitted:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
              Contactez-Nous
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Notre équipe d'experts est à votre disposition pour vous accompagner 
              dans votre projet immobilier à Chypre
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
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
              Plusieurs Moyens de Nous Contacter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choisissez la méthode qui vous convient le mieux
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center card-hover bg-gradient-card h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-premium rounded-full flex items-center justify-center">
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground mb-1">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-hover bg-gradient-card h-full">
                  <CardContent className="p-6">
                    <service.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <Button className="w-full btn-outline-premium">
                      {service.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Formulaire de Contact
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  Décrivez-nous votre projet, nous vous recontacterons rapidement
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Type de bien recherché</Label>
                      <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="apartment">Appartement</SelectItem>
                          <SelectItem value="penthouse">Penthouse</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="land">Terrain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget approximatif</Label>
                      <Select onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-300k">Moins de 300k€</SelectItem>
                          <SelectItem value="300k-500k">300k€ - 500k€</SelectItem>
                          <SelectItem value="500k-1M">500k€ - 1M€</SelectItem>
                          <SelectItem value="1M-2M">1M€ - 2M€</SelectItem>
                          <SelectItem value="2M+">Plus de 2M€</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Objet de votre demande"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Décrivez votre projet, vos critères de recherche, vos questions..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="text-center">
                    <Button type="submit" size="lg" className="btn-premium">
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      * Champs obligatoires. Nous nous engageons à répondre sous 24h.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Notre Localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-primary/10 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto text-primary/40 mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">
                      Limassol Marina, Chypre
                    </p>
                    <p className="text-muted-foreground">
                      Intégration Google Maps à venir
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;