import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ProjectModification {
  field: string;
  label: string;
  oldValue: unknown;
  newValue: unknown;
  type: 'added' | 'modified' | 'removed';
}

interface ProjectActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'save' | 'publish' | 'unpublish' | 'archive' | 'activate';
  projectTitle: string;
  modifications?: ProjectModification[];
  validationErrors?: Array<{
    field: string;
    label: string;
    message: string;
  }>;
  isLoading?: boolean;
}

export const ProjectActionDialog: React.FC<ProjectActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  projectTitle,
  modifications = [],
  validationErrors = [],
  isLoading = false
}) => {
  console.log('ProjectActionDialog rendered:', {
    isOpen,
    action,
    projectTitle,
    modificationsCount: modifications.length,
    validationErrorsCount: validationErrors.length,
    isLoading
  });
  const getActionConfig = () => {
    switch (action) {
      case 'activate':
        return {
          title: 'Réactiver le projet',
          description: 'Le projet sera réactivé et visible dans les recherches.',
          buttonText: 'Réactiver',
          buttonClass: 'bg-blue-600 hover:bg-blue-700',
          icon: <CheckCircle2 className="h-5 w-5" />
        };
      case 'publish':
        return {
          title: 'Publier le projet',
          description: 'Le projet sera visible publiquement et accessible aux visiteurs.',
          buttonText: 'Publier maintenant',
          buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
          icon: <CheckCircle2 className="h-5 w-5" />
        };
      case 'unpublish':
        return {
          title: 'Dépublier le projet',
          description: 'Le projet ne sera plus visible publiquement.',
          buttonText: 'Dépublier',
          buttonClass: 'bg-orange-600 hover:bg-orange-700',
          icon: <AlertCircle className="h-5 w-5" />
        };
      case 'archive':
        return {
          title: 'Archiver le projet',
          description: 'Le projet sera archivé et retiré des recherches actives.',
          buttonText: 'Archiver',
          buttonClass: 'bg-slate-600 hover:bg-slate-700',
          icon: <AlertCircle className="h-5 w-5" />
        };
      default:
        return {
          title: 'Sauvegarder les modifications',
          description: 'Les modifications apportées au projet seront sauvegardées.',
          buttonText: 'Confirmer la sauvegarde',
          buttonClass: 'bg-primary hover:bg-primary/90',
          icon: <Info className="h-5 w-5" />
        };
    }
  };

  const config = getActionConfig();

  const getModificationIcon = (type: ProjectModification['type']) => {
    switch (type) {
      case 'added':
        return <span className="text-emerald-600">✓ Ajouté</span>;
      case 'modified':
        return <span className="text-blue-600">Modifié</span>;
      case 'removed':
        return <span className="text-red-600">✗ Supprimé</span>;
    }
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'Non defini';
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'Aucun';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {config.icon}
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            <strong>{projectTitle}</strong>
            <br />
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {validationErrors && validationErrors.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2 text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Erreurs à corriger ({validationErrors.length})
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {validationErrors.map((error, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="destructive">❌ Erreur</Badge>
                    <span className="font-medium text-red-800">{error.label}</span>
                  </div>
                  <p className="text-red-700 text-sm">{error.message}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                🚫 Impossible de publier le projet tant que ces erreurs ne sont pas corrigées.
              </p>
              <p className="text-red-700 text-sm mt-1">
                Retournez au formulaire et complétez les champs requis avant de republier.
              </p>
            </div>
          </div>
        )}

        {(!validationErrors || validationErrors.length === 0) && modifications.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Modifications détectées ({modifications.length})
            </h3>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {modifications.map((mod, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{mod.label}</span>
                    <Badge variant="outline">
                      {getModificationIcon(mod.type)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    {mod.type !== 'added' && (
                      <div className="text-slate-600">
                        <span className="font-medium">Ancien :</span> {formatValue(mod.oldValue)}
                      </div>
                    )}
                    {mod.type !== 'removed' && (
                      <div className="text-slate-900">
                        <span className="font-medium">Nouveau :</span> {formatValue(mod.newValue)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!validationErrors || validationErrors.length === 0) && modifications.length === 0 && action === 'publish' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">✅ Aucune erreur détectée</p>
            <p className="text-green-700 text-sm">Le projet est prêt à être publié.</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {validationErrors && validationErrors.length > 0 ? 'Retour au formulaire' : 'Annuler'}
          </Button>
          {(!validationErrors || validationErrors.length === 0) && (
            <Button 
              onClick={onConfirm} 
              disabled={isLoading}
              className={config.buttonClass}
            >
              {isLoading ? 'En cours...' : config.buttonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};