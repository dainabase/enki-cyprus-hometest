import React from 'react';
import { UnifiedAIImporter } from '@/components/admin/ai/UnifiedAIImporter';
import { SEOHead } from '@/components/SEOHead';

export default function AdminAIImportUnified() {
  return (
    <>
      <SEOHead 
        title="Import IA Unifié - Extraction Complète | Enki Reality Admin"
        description="Système d'import intelligent pour extraire automatiquement toute la hiérarchie immobilière : développeur, projet, bâtiments et propriétés en une seule fois."
        canonical="/admin/ai-import-unified"
      />
      <div className="min-h-screen bg-gray-50">
        <UnifiedAIImporter />
      </div>
    </>
  );
}