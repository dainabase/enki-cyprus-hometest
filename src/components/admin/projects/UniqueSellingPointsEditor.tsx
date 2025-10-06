import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { ProjectFormData } from '@/schemas/projectSchema';
import { IconPicker } from './IconPicker';

interface UniqueSellingPointsEditorProps {
  form: UseFormReturn<ProjectFormData>;
}

export const UniqueSellingPointsEditor: React.FC<UniqueSellingPointsEditorProps> = ({ form }) => {
  const uspItems = form.watch('unique_selling_points') || [];

  const addUSP = () => {
    const current = Array.isArray(uspItems) ? uspItems : [];
    form.setValue('unique_selling_points', [
      ...current,
      { title: '', description: '', icon: 'Star' }
    ]);
  };

  const removeUSP = (index: number) => {
    const current = Array.isArray(uspItems) ? uspItems : [];
    form.setValue('unique_selling_points', current.filter((_, i) => i !== index));
  };

  const updateUSP = (index: number, field: 'title' | 'description' | 'icon', value: string) => {
    const current = Array.isArray(uspItems) ? uspItems : [];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    form.setValue('unique_selling_points', updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Points de vente uniques (USP)</h3>
          <p className="text-sm text-muted-foreground">
            Les caractéristiques clés qui rendent ce projet unique (10 maximum recommandé)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addUSP}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un USP
        </Button>
      </div>

      <div className="space-y-4">
        {Array.isArray(uspItems) && uspItems.length > 0 ? (
          uspItems.map((usp: any, index: number) => (
            <Card key={index} className="border-2">
              <CardContent className="p-4">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 pt-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-3">
                        <FormLabel className="text-sm">Icône</FormLabel>
                        <IconPicker
                          value={usp.icon || 'Star'}
                          onChange={(iconName) => updateUSP(index, 'icon', iconName)}
                        />
                      </div>
                      
                      <div className="md:col-span-9">
                        <FormLabel className="text-sm">Titre *</FormLabel>
                        <Input
                          value={usp.title || ''}
                          onChange={(e) => updateUSP(index, 'title', e.target.value)}
                          placeholder="Ex: Vue mer panoramique"
                          className="border-2"
                        />
                      </div>
                    </div>

                    <div>
                      <FormLabel className="text-sm">Description</FormLabel>
                      <Textarea
                        value={usp.description || ''}
                        onChange={(e) => updateUSP(index, 'description', e.target.value)}
                        placeholder="Détails sur cette caractéristique unique..."
                        rows={2}
                        className="border-2 resize-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUSP(index)}
                    className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">
              Aucun point de vente unique ajouté
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUSP}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter le premier USP
            </Button>
          </div>
        )}
      </div>

      {Array.isArray(uspItems) && uspItems.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {uspItems.length} point{uspItems.length > 1 ? 's' : ''} ajouté{uspItems.length > 1 ? 's' : ''}
          {uspItems.length >= 10 && ' (maximum recommandé atteint)'}
        </p>
      )}
    </div>
  );
};
