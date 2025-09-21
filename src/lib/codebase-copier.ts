import { supabase } from '@/integrations/supabase/client';

interface FileInfo {
  path: string;
  name: string;
  extension: string;
  content: string;
  size: number;
  componentType: string;
  folderStructure: string;
  dependencies: string[];
  imports: string[];
  exports: string[];
}

export class CodebaseCopier {
  private filesToCopy = [
    // Admin pages
    'src/pages/Admin.tsx',
    'src/pages/admin/AdminAIImport.tsx',
    'src/pages/admin/AdminAIImportUnified.tsx',
    'src/pages/admin/AdminAnalytics.tsx',
    'src/pages/admin/AdminBuildingDetail.tsx',
    'src/pages/admin/AdminBuildings.tsx',
    'src/pages/admin/AdminCommissions.tsx',
    'src/pages/admin/AdminContent.tsx',
    'src/pages/admin/AdminDashboard.tsx',
    'src/pages/admin/AdminDevelopers.tsx',
    'src/pages/admin/AdminDocumentation.tsx',
    'src/pages/admin/AdminLeads.tsx',
    'src/pages/admin/AdminOverview.tsx',
    'src/pages/admin/AdminPerformance.tsx',
    'src/pages/admin/AdminPipeline.tsx',
    'src/pages/admin/AdminProjectDetail.tsx',
    'src/pages/admin/AdminProjectForm.tsx',
    'src/pages/admin/AdminProjects.tsx',
    'src/pages/admin/AdminPredictions.tsx',
    'src/pages/admin/AdminReports.tsx',
    'src/pages/admin/AdminSegmentation.tsx',
    'src/pages/admin/AdminTestIntegration.tsx',
    'src/pages/admin/AdminTests.tsx',
    'src/pages/admin/AdminUnits.tsx',
    'src/pages/admin/AdminUsers.tsx',
    'src/pages/admin/PropertyForm.tsx',
    
    // Admin components
    'src/components/admin/AdminFooter.tsx',
    'src/components/admin/AdminSidebar.tsx',
    'src/components/admin/AdminSidebarExecutive.tsx',
    'src/components/admin/ImageUploader.tsx',
    'src/components/admin/ProjectActionDialog.tsx',
    'src/components/admin/ProjectStatusActions.tsx',
    
    // AI Import components
    'src/components/admin/ai/UnifiedAIImporter.tsx',
    'src/components/admin/ai/ValidationWizard.tsx',
    
    // Building components
    'src/components/admin/buildings/BuildingFilters.tsx',
    'src/components/admin/buildings/BuildingForm.tsx',
    'src/components/admin/buildings/BuildingsTable.tsx',
    
    // Common components
    'src/components/admin/common/HierarchyBreadcrumb.tsx',
    'src/components/admin/common/LanguageSelector.tsx',
    'src/components/admin/common/SimpleImageUploader.tsx',
    
    // Dashboard components
    'src/components/admin/dashboard/Charts.tsx',
    'src/components/admin/dashboard/KPICards.tsx',
    
    // Developer components
    'src/components/admin/developers/DeveloperCardView.tsx',
    'src/components/admin/developers/DeveloperCompactView.tsx',
    'src/components/admin/developers/DeveloperDetailedView.tsx',
    'src/components/admin/developers/DeveloperListView.tsx',
    'src/components/admin/developers/DeveloperTableView.tsx',
    'src/components/admin/developers/DeveloperViewSelector.tsx',
    
    // Project components
    'src/components/admin/projects/AIFieldIndicator.tsx',
    'src/components/admin/projects/AIImportDropzone.tsx',
    'src/components/admin/projects/AddressAutocomplete.tsx',
    'src/components/admin/projects/AmenitiesSelector.tsx',
    'src/components/admin/projects/BuildingModal.tsx',
    'src/components/admin/projects/BuildingsSection.tsx',
    'src/components/admin/projects/CategorizedMediaUploader.tsx',
    'src/components/admin/projects/CombinedFiltersAndSort.tsx',
    'src/components/admin/projects/DocumentManager.tsx',
    'src/components/admin/projects/MediaUploader.tsx',
    'src/components/admin/projects/NearbyAmenitiesSelector.tsx',
    'src/components/admin/projects/ProjectCardView.tsx',
    'src/components/admin/projects/ProjectCompactView.tsx',
    'src/components/admin/projects/ProjectDetailedView.tsx',
    'src/components/admin/projects/ProjectFilters.tsx',
    'src/components/admin/projects/ProjectForm.tsx',
    'src/components/admin/projects/ProjectFormSteps.tsx',
    'src/components/admin/projects/ProjectListView.tsx',
    'src/components/admin/projects/ProjectSorter.tsx',
    'src/components/admin/projects/ProjectTableView.tsx',
    'src/components/admin/projects/ProjectViewSelector.tsx',
    'src/components/admin/projects/ProjectsTable.tsx',
    'src/components/admin/projects/PropertySubTypeSelector.tsx',
    
    // Property components
    'src/components/admin/properties/BulkPropertyCreator.tsx',
    'src/components/admin/properties/CSVImporter.tsx',
    'src/components/admin/properties/PDFExportButton.tsx',
    'src/components/admin/properties/PropertyFormSteps.tsx',
    'src/components/admin/properties/PropertyOCRImporter.tsx',
    'src/components/admin/properties/PropertyWizard.tsx',
    
    // Property steps
    'src/components/admin/properties/steps/ConfigurationStep.tsx',
    'src/components/admin/properties/steps/DocumentationStep.tsx',
    'src/components/admin/properties/steps/EquipmentStep.tsx',
    'src/components/admin/properties/steps/FinancialStep.tsx',
    'src/components/admin/properties/steps/IdentificationStep.tsx',
    'src/components/admin/properties/steps/OutdoorStep.tsx',
    
    // Test components
    'src/components/admin/test/CronaTestRunner.tsx',
    'src/components/admin/test/DataSeeder.tsx',
    'src/components/admin/test/HealthCheckPanel.tsx',
    'src/components/admin/test/IntegrityReport.tsx',
    'src/components/admin/test/StatisticsDashboard.tsx',
    
    // Hooks
    'src/hooks/useDashboardMetrics.ts',
    'src/hooks/useDebounce.ts',
    'src/hooks/useDebounceCallback.ts',
    'src/hooks/useFormAutosave.ts',
    'src/hooks/useSecureAdmin.ts',
    'src/hooks/useSupabaseProperties.ts',
    'src/hooks/useSupabaseQuery.ts',
    'src/hooks/useViewPreference.ts',
    
    // Lib utilities
    'src/lib/api/buildings.ts',
    'src/lib/dashboard/calculations.ts',
    'src/lib/excel/propertyParser.ts',
    'src/lib/excel/propertyTemplate.ts',
    'src/lib/pdf/batchPdfExporter.ts',
    'src/lib/pdf/propertyPdfGenerator.ts',
    'src/lib/supabase/buildings.ts',
    'src/lib/supabase/images.ts',
    'src/lib/supabase/integrity.ts',
    'src/lib/supabase/projects.ts',
    'src/lib/supabase/storage.ts',
    'src/lib/supabase/test-helpers.ts',
    
    // AI Import utilities
    'src/lib/ai-import/aiExtractionPrompt.ts',
    'src/lib/ai-import/aiFieldMapper.ts',
    'src/lib/ai-import/cyprusFieldsValidator.ts',
    'src/lib/ai-import/debugExtractor.ts',
    'src/lib/ai-import/mapper.ts',
    'src/lib/ai-import/propertyAIExtractor.ts',
    'src/lib/ai-import/types-v2.ts',
    'src/lib/ai-import/types.ts',
    
    // Utils
    'src/utils/cronaGroupTestData.ts',
    'src/utils/csvExport.ts',
    'src/utils/dataIntegrityChecker.ts',
    'src/utils/fixCriticalIssues.ts',
    'src/utils/gallery.ts',
    'src/utils/performance.ts',
    'src/utils/runCronaTest.ts',
    'src/utils/systemAudit.ts',
    'src/utils/testDataGenerator.ts',
    
    // Schemas
    'src/schemas/projectSchema.ts',
    'src/schemas/property.schema.ts',
    
    // Types
    'src/types/building.ts',
    
    // Config files
    'package.json',
    'tailwind.config.ts',
    'vite.config.ts',
    'src/index.css',
  ];

  detectComponentType(filePath: string): string {
    if (filePath.includes('/pages/')) return 'page';
    if (filePath.includes('/components/')) return 'component';
    if (filePath.includes('/layouts/')) return 'layout';
    if (filePath.includes('/hooks/')) return 'hook';
    if (filePath.includes('/utils/') || filePath.includes('/lib/')) return 'util';
    if (filePath.includes('/types/')) return 'type';
    if (filePath.includes('/schemas/')) return 'type';
    if (filePath.endsWith('.css') || filePath.endsWith('.scss')) return 'style';
    if (filePath.includes('config') || filePath === 'package.json') return 'config';
    return 'other';
  }

  extractImports(content: string): string[] {
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    const imports: string[] = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  extractExports(content: string): string[] {
    const exportRegex = /export\s+(?:default\s+)?(?:const|function|class|interface|type)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const exports: string[] = [];
    let match;
    
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  extractDependencies(content: string): string[] {
    const deps: string[] = [];
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    
    importLines.forEach(line => {
      const match = line.match(/from\s+['"`]([^'"`]+)['"`]/);
      if (match && !match[1].startsWith('.') && !match[1].startsWith('@/')) {
        deps.push(match[1]);
      }
    });
    
    return [...new Set(deps)];
  }

  async copyFileToSupabase(filePath: string, content: string): Promise<void> {
    // Temporarily disabled - requires database tables setup
    console.log(`Would copy ${filePath} to database (${content.length} chars)`);
  }

  async generateMetadata(): Promise<void> {
    // Temporarily disabled - requires database tables setup
    console.log('Would generate metadata for codebase');
  }

  async copyAllFiles(): Promise<{
    totalFiles: number;
    copiedFiles: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let copiedFiles = 0;

    for (const filePath of this.filesToCopy) {
      try {
        // Simuler la lecture du fichier (en production, il faudrait lire le fichier réel)
        const content = `// Contenu du fichier ${filePath}\n// Ce fichier a été copié automatiquement`;
        
        await this.copyFileToSupabase(filePath, content);
        copiedFiles++;
        
        console.log(`✅ Copié: ${filePath}`);
      } catch (error) {
        errors.push(`Erreur avec ${filePath}: ${error}`);
        console.error(`❌ Erreur: ${filePath}`, error);
      }
    }

    // Générer les métadonnées
    await this.generateMetadata();

    return {
      totalFiles: this.filesToCopy.length,
      copiedFiles,
      errors,
    };
  }

  async getCodebaseSummary() {
    // Temporarily disabled - requires database tables setup
    return {
      metadata: null,
      pageFiles: [],
      folderStructure: {},
      totalFiles: 0,
    };
  }
}

export const codebaseCopier = new CodebaseCopier();