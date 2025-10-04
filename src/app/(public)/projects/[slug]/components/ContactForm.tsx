'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin,
  Send,
  CheckCircle,
  User,
  Calendar
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils/formatters';

interface ContactFormProps {
  project: any;
}

export default function ContactForm({ project }: ContactFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    interestedIn: 'viewing',
    contactPreference: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.email) {
      setStep(2);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const developer = project.developer;
  const whatsappMessage = `Hi, I'm interested in ${project.title}. Could you please provide more information?`;
  const whatsappUrl = developer?.phone_numbers?.[0] 
    ? getWhatsAppUrl(developer.phone_numbers[0], whatsappMessage)
    : '#';

  if (isSubmitted) {
    return (
      <section id="contact-form" className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-6">
                We've received your inquiry and will contact you within 24 hours.
              </p>
              <Button 
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: '',
                    interestedIn: 'viewing',
                    contactPreference: 'email'
                  });
                }}
                variant="outline"
              >
                Send Another Inquiry
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="py-16 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to take the next step? Contact us for more information or to schedule a viewing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Send us a Message</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Badge variant={step === 1 ? "default" : "secondary"}>1. Contact Info</Badge>
                  <Badge variant={step === 2 ? "default" : "secondary"}>2. Your Inquiry</Badge>
                </div>
              </CardHeader>
              <CardContent>
                
                {/* Step 1 - Basic Info */}
                {step === 1 && (
                  <form onSubmit={handleStep1Submit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Continue
                    </Button>
                  </form>
                )}

                {/* Step 2 - Detailed Inquiry */}
                {step === 2 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestedIn">I'm interested in</Label>
                      <select
                        id="interestedIn"
                        value={formData.interestedIn}
                        onChange={(e) => handleInputChange('interestedIn', e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="viewing">Scheduling a viewing</option>
                        <option value="investment">Investment information</option>
                        <option value="financing">Financing options</option>
                        <option value="golden-visa">Golden Visa process</option>
                        <option value="general">General information</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your requirements..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Inquiry
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            
            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium">{project.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{project.city || project.cyprus_zone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price from</span>
                  <span className="font-medium">€{project.price_from_new || project.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Schedule */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Calendar className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Schedule a Viewing</h3>
                    <p className="text-sm text-muted-foreground">
                      Available 7 days a week, 9 AM - 6 PM
                    </p>
                  </div>
                  <Button variant="outline">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}