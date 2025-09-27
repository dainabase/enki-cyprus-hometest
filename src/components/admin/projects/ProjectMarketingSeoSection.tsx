import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

interface MarketingSeoData {
  meta_title?: string;
  meta_description?: string;
  url_slug?: string;
}

interface ProjectMarketingSeoSectionProps {
  data: MarketingSeoData;
  onChange: (data: MarketingSeoData) => void;
  projectTitle?: string;
  t: any;
}

export const ProjectMarketingSeoSection: React.FC<ProjectMarketingSeoSectionProps> = ({
  data,
  onChange,
  projectTitle,
  t
}) => {
  const handleChange = (field: keyof MarketingSeoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // Auto-generate URL slug from title if not set
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    handleChange('meta_title', value);
    // Auto-generate slug if it's empty
    if (!data.url_slug && value) {
      handleChange('url_slug', generateSlug(value));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5" />
          {t('projectForm.marketingSeo') || 'Marketing & SEO'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            {t('projectForm.seoHelp') || 'Optimisez le référencement de votre projet pour améliorer sa visibilité sur les moteurs de recherche'}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="meta_title">
              {t('projectForm.metaTitle') || 'Titre SEO'} 
              <span className="text-xs text-muted-foreground ml-2">
                ({(data.meta_title || '').length}/60 {t('projectForm.characters') || 'caractères'})
              </span>
            </Label>
            <Input
              id="meta_title"
              value={data.meta_title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={projectTitle ? `${projectTitle} - Cyprus Real Estate` : t('projectForm.metaTitlePlaceholder') || 'Titre optimisé pour les moteurs de recherche'}
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">
              {t('projectForm.metaTitleHint') || "Titre qui apparaît dans les résultats de recherche Google. Maximum 60 caractères."}
            </p>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="meta_description">
              {t('projectForm.metaDescription') || 'Description SEO'}
              <span className="text-xs text-muted-foreground ml-2">
                ({(data.meta_description || '').length}/160 {t('projectForm.characters') || 'caractères'})
              </span>
            </Label>
            <Textarea
              id="meta_description"
              value={data.meta_description || ''}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              placeholder={t('projectForm.metaDescriptionPlaceholder') || 'Description attractive pour inciter au clic dans les résultats de recherche'}
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {t('projectForm.metaDescriptionHint') || "Description qui apparaît sous le titre dans Google. Maximum 160 caractères."}
            </p>
          </div>

          {/* URL Slug */}
          <div className="space-y-2">
            <Label htmlFor="url_slug">
              {t('projectForm.urlSlug') || 'URL personnalisée'}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/projects/</span>
              <Input
                id="url_slug"
                value={data.url_slug || ''}
                onChange={(e) => handleChange('url_slug', generateSlug(e.target.value))}
                placeholder={t('projectForm.urlSlugPlaceholder') || 'nom-du-projet'}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('projectForm.urlSlugHint') || "URL conviviale pour le référencement. Utilisez uniquement des lettres minuscules, chiffres et tirets."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
