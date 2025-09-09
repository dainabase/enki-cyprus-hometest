'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Phone, 
  Bot,
  X
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils/formatters';

interface StickyBarProps {
  project: any;
}

export default function StickyBar({ project }: StickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const showThreshold = windowHeight * 0.3; // Show after 30% scroll
      
      setIsVisible(scrolled > showThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const developer = project.developer;
  const whatsappMessage = `Hi, I'm interested in ${project.title}. Could you please provide more information?`;
  const whatsappUrl = developer?.phone_numbers?.[0] 
    ? getWhatsAppUrl(developer.phone_numbers[0], whatsappMessage)
    : '#';

  const handleInquiryClick = () => {
    setShowInquiryModal(true);
  };

  const handleCallClick = () => {
    if (developer?.phone_numbers?.[0]) {
      window.location.href = `tel:${developer.phone_numbers[0]}`;
    }
  };

  const handleChatBotClick = () => {
    // Placeholder for chatbot functionality
    alert('Chatbot coming soon! Please use WhatsApp or contact form for now.');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Project Info */}
            <div className="hidden sm:block">
              <h3 className="font-semibold text-sm">{project.title}</h3>
              <p className="text-xs text-muted-foreground">
                From €{project.price_from_new || project.price}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex space-x-2 flex-1 sm:flex-none">
              
              {/* WhatsApp Chat */}
              <Button 
                asChild
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </Button>

              {/* Phone Call */}
              {developer?.phone_numbers?.[0] && (
                <Button 
                  onClick={handleCallClick}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Call</span>
                </Button>
              )}

              {/* Inquiry Form */}
              <Button 
                onClick={handleInquiryClick}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
                size="sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Inquiry</span>
              </Button>

              {/* Chat Bot */}
              <Button 
                onClick={handleChatBotClick}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Chat</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Quick Inquiry</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowInquiryModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Choose how you'd like to get in touch:
              </p>
              
              <div className="space-y-2">
                <Button 
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowInquiryModal(false)}
                >
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                </Button>

                {developer?.phone_numbers?.[0] && (
                  <Button 
                    onClick={() => {
                      handleCallClick();
                      setShowInquiryModal(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call {developer.phone_numbers[0]}
                  </Button>
                )}

                <Button 
                  onClick={() => {
                    setShowInquiryModal(false);
                    // Scroll to contact form
                    document.getElementById('contact-form')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Form
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button (Alternative) */}
      <div className="fixed bottom-20 right-4 z-40">
        <Button 
          asChild
          className="rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
        >
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </a>
        </Button>
      </div>
    </>
  );
}