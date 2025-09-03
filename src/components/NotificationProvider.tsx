import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ToastProvider';
import { supabase } from '@/integrations/supabase/client';
import { trackCommissionTriggered } from '@/lib/analytics';

interface NotificationContextType {
  triggerCommissionEmail: (data: CommissionData) => void;
  triggerChecklistEmail: (data: ChecklistData) => void;
  triggerWelcomeEmail: (email: string, name: string) => void;
}

interface CommissionData {
  promoter_id: string;
  project_id: string;
  amount: number;
  project_title: string;
}

interface ChecklistData {
  user_id: string;
  tasks_completed: number;
  total_tasks: number;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { addToast } = useToast();

  // Subscribe to realtime changes for automatic notifications
  useEffect(() => {
    const commissionsChannel = supabase
      .channel('commissions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'commissions'
        },
        (payload) => {
          // New commission detected
          addToast({
            type: 'success',
            title: 'Commission Créée',
            message: `Nouvelle commission de ${payload.new.amount}€ générée!`
          });
        }
      )
      .subscribe();

    const checklistsChannel = supabase
      .channel('checklists-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'checklists'
        },
        (payload) => {
          // Checklist updated
          const newItems = payload.new.items || [];
          const completedTasks = newItems.filter((item: any) => item.done).length;
          
          addToast({
            type: 'info',
            title: 'Checklist Mise à Jour',
            message: `${completedTasks}/${newItems.length} tâches complétées`
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commissionsChannel);
      supabase.removeChannel(checklistsChannel);
    };
  }, [addToast]);

  const triggerCommissionEmail = async (data: CommissionData) => {
    try {
      // Get promoter email
      const { data: promoter } = await supabase
        .from('promoters')
        .select('name, contact')
        .eq('id', data.promoter_id)
        .single();

      if (promoter?.contact && typeof promoter.contact === 'object' && 'email' in promoter.contact) {
        await supabase.functions.invoke('send-notification', {
          body: {
            to: (promoter.contact as any).email,
            template: 'commission',
            data: {
              promoter: promoter.name,
              amount: data.amount,
              project: data.project_title
            }
          }
        });

        addToast({
          type: 'success',
          title: 'Email Envoyé',
          message: `Commission notifiée à ${promoter.name}`
        });

        trackCommissionTriggered({
          project_id: data.project_id,
          amount: data.amount,
          promoter_id: data.promoter_id,
          conversion_type: 'email_notification'
        });
      }
    } catch (error) {
      console.error('Error sending commission email:', error);
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'envoyer l\'email de commission'
      });
    }
  };

  const triggerChecklistEmail = async (data: ChecklistData) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, profile')
        .eq('id', data.user_id)
        .single();

      if (profile?.email) {
        await supabase.functions.invoke('send-notification', {
          body: {
            to: profile.email,
            template: 'checklist',
            data: {
              name: (profile.profile as any)?.name || 'Utilisateur',
              tasks_completed: data.tasks_completed,
              total_tasks: data.total_tasks
            }
          }
        });

        addToast({
          type: 'success',
          title: 'Notification Checklist',
          message: 'Email de progression envoyé!'
        });
      }
    } catch (error) {
      console.error('Error sending checklist email:', error);
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Impossible d\'envoyer l\'email checklist'
      });
    }
  };

  const triggerWelcomeEmail = async (email: string, name: string) => {
    try {
      await supabase.functions.invoke('send-notification', {
        body: {
          to: email,
          template: 'welcome',
          data: { name }
        }
      });

      addToast({
        type: 'success',
        title: 'Bienvenue!',
        message: 'Email de bienvenue envoyé'
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      addToast({
        type: 'info',
        title: 'Bienvenue!',
        message: 'Votre compte a été créé avec succès'
      });
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        triggerCommissionEmail,
        triggerChecklistEmail,
        triggerWelcomeEmail
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};