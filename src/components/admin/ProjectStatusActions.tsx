import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Archive, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle,
  RotateCcw
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProjectActionDialog } from './ProjectActionDialog';

interface ProjectStatusActionsProps {
  project: {
    id: string;
    title: string;
    status: string;
  };
  compact?: boolean;
}

export const ProjectStatusActions: React.FC<ProjectStatusActionsProps> = ({ 
  project, 
  compact = false 
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'publish' | 'unpublish' | 'archive' | 'activate' | null>(null);
  const queryClient = useQueryClient();

  const statusConfig = {
    available: { 
      label: 'Publié', 
      color: 'bg-emerald-100 text-emerald-800', 
      icon: <CheckCircle2 className="h-3 w-3" /> 
    },
    draft: { 
      label: 'Brouillon', 
      color: 'bg-slate-100 text-slate-800', 
      icon: <Clock className="h-3 w-3" /> 
    },
    archived: { 
      label: 'Archivé', 
      color: 'bg-amber-100 text-amber-800', 
      icon: <Archive className="h-3 w-3" /> 
    },
    unavailable: { 
      label: 'Indisponible', 
      color: 'bg-red-100 text-red-800', 
      icon: <XCircle className="h-3 w-3" /> 
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', project.id);
      
      if (error) throw error;
    },
    onSuccess: (_, newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      
      const statusLabels = {
        available: 'publié',
        draft: 'mis en brouillon',
        archived: 'archivé',
        unavailable: 'rendu indisponible'
      };
      
      toast.success(`✅ Projet ${statusLabels[newStatus as keyof typeof statusLabels]}`, {
        description: `"${project.title}" a été ${statusLabels[newStatus as keyof typeof statusLabels]} avec succès.`,
        duration: 4000
      });
    },
    onError: (error) => {
      toast.error('Erreur de mise à jour', {
        description: 'Impossible de modifier le statut du projet.',
        duration: 4000
      });
      console.error('Status update error:', error);
    },
    onSettled: () => {
      setDialogOpen(false);
      setPendingAction(null);
    }
  });

  const handleAction = (action: 'publish' | 'unpublish' | 'archive' | 'activate') => {
    setPendingAction(action);
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    
    const statusMap = {
      publish: 'available',
      unpublish: 'draft',
      archive: 'archived',
      activate: 'available'
    };
    
    updateStatusMutation.mutate(statusMap[pendingAction]);
  };

  const currentStatus = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.draft;

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Badge className={`${currentStatus.color} border-0 text-xs`}>
            {currentStatus.icon}
            {currentStatus.label}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {project.status !== 'available' && (
                <DropdownMenuItem onClick={() => handleAction('publish')}>
                  <Eye className="h-4 w-4 mr-2" />
                  Publier
                </DropdownMenuItem>
              )}
              {project.status === 'available' && (
                <DropdownMenuItem onClick={() => handleAction('unpublish')}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Dépublier
                </DropdownMenuItem>
              )}
              {project.status !== 'archived' && (
                <DropdownMenuItem onClick={() => handleAction('archive')}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver
                </DropdownMenuItem>
              )}
              {project.status === 'archived' && (
                <DropdownMenuItem onClick={() => handleAction('activate')}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réactiver
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ProjectActionDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={confirmAction}
          action={pendingAction || 'publish'}
          projectTitle={project.title}
          isLoading={updateStatusMutation.isPending}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Badge className={`${currentStatus.color} border-0`}>
          {currentStatus.icon}
          {currentStatus.label}
        </Badge>

        <div className="flex gap-2">
          {project.status !== 'available' && (
            <Button 
              size="sm" 
              onClick={() => handleAction('publish')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              Publier
            </Button>
          )}
          
          {project.status === 'available' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAction('unpublish')}
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Dépublier
            </Button>
          )}
          
          {project.status !== 'archived' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAction('archive')}
            >
              <Archive className="h-4 w-4 mr-1" />
              Archiver
            </Button>
          )}
          
          {project.status === 'archived' && (
            <Button 
              size="sm" 
              onClick={() => handleAction('activate')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Réactiver
            </Button>
          )}
        </div>
      </div>

      <ProjectActionDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmAction}
        action={pendingAction || 'publish'}
        projectTitle={project.title}
        isLoading={updateStatusMutation.isPending}
      />
    </>
  );
};