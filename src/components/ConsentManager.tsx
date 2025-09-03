import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Bell, Cookie } from 'lucide-react';

interface ConsentData {
  notifications: boolean;
  marketing: boolean;
  analytics: boolean;
  cookies: boolean;
}

interface ConsentManagerProps {
  onConsentChange: (consent: ConsentData) => void;
  initialConsent?: ConsentData;
  compact?: boolean;
}

const defaultConsent: ConsentData = {
  notifications: false,
  marketing: false,
  analytics: false,
  cookies: true // Required for functionality
};

export const ConsentManager: React.FC<ConsentManagerProps> = ({
  onConsentChange,
  initialConsent = defaultConsent,
  compact = false
}) => {
  const [consent, setConsent] = useState<ConsentData>(initialConsent);

  const handleConsentChange = (key: keyof ConsentData, value: boolean) => {
    const newConsent = { ...consent, [key]: value };
    setConsent(newConsent);
    onConsentChange(newConsent);
  };

  const consentItems = [
    {
      key: 'notifications' as keyof ConsentData,
      icon: <Bell className="h-4 w-4" />,
      title: 'Notifications par email',
      description: 'Recevoir des notifications sur vos favoris, checklist et commissions',
      required: false
    },
    {
      key: 'marketing' as keyof ConsentData,
      icon: <Mail className="h-4 w-4" />,
      title: 'Communications marketing',
      description: 'Recevoir des offres spéciales et des nouvelles de nos projets',
      required: false
    },
    {
      key: 'analytics' as keyof ConsentData,
      icon: <Shield className="h-4 w-4" />,
      title: 'Analytics et amélioration',
      description: 'Nous aider à améliorer l\'expérience utilisateur',
      required: false
    },
    {
      key: 'cookies' as keyof ConsentData,
      icon: <Cookie className="h-4 w-4" />,
      title: 'Cookies fonctionnels',
      description: 'Nécessaires pour le bon fonctionnement du site',
      required: true
    }
  ];

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Préférences de confidentialité
        </h3>
        
        <div className="space-y-3">
          {consentItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <Checkbox
                id={item.key}
                checked={consent[item.key]}
                onCheckedChange={(checked) => 
                  handleConsentChange(item.key, checked as boolean)
                }
                disabled={item.required}
              />
              <Label 
                htmlFor={item.key} 
                className="text-sm flex items-center gap-2 cursor-pointer"
              >
                {item.icon}
                {item.title}
                {item.required && (
                  <span className="text-xs text-muted-foreground">(obligatoire)</span>
                )}
              </Label>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gestion des Consentements RGPD
        </CardTitle>
        <CardDescription>
          Gérez vos préférences de confidentialité et de communication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {consentItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4 p-4 border rounded-lg"
          >
            <Checkbox
              id={item.key}
              checked={consent[item.key]}
              onCheckedChange={(checked) => 
                handleConsentChange(item.key, checked as boolean)
              }
              disabled={item.required}
              className="mt-1"
            />
            <div className="flex-1">
              <Label 
                htmlFor={item.key} 
                className="flex items-center gap-2 font-medium cursor-pointer"
              >
                {item.icon}
                {item.title}
                {item.required && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    Obligatoire
                  </span>
                )}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Vos droits RGPD</h4>
          <p className="text-sm text-muted-foreground">
            Vous pouvez à tout moment modifier vos préférences, demander l'accès à vos données, 
            leur rectification ou leur suppression. Contactez-nous à{' '}
            <a href="mailto:privacy@enki-realty.com" className="text-primary hover:underline">
              privacy@enki-realty.com
            </a> pour exercer vos droits.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};