import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Book, Zap, Settings, BarChart3, Users, Home, FileText } from 'lucide-react';

const AdminDocumentation = () => {
  const { t } = useTranslation();

  const quickStartSteps = [
    {
      step: 1,
      title: 'Configure Supabase',
      description: 'Set up your .env file with Supabase credentials',
      icon: <Settings className="h-4 w-4" />
    },
    {
      step: 2,
      title: 'Install Dependencies',
      description: 'Run npm install and npm run dev',
      icon: <Zap className="h-4 w-4" />
    },
    {
      step: 3,
      title: 'Access Admin Panel',
      description: 'Navigate to /admin and start managing',
      icon: <Home className="h-4 w-4" />
    },
    {
      step: 4,
      title: 'Generate Test Data',
      description: 'Use /admin/tests to generate demo data',
      icon: <BarChart3 className="h-4 w-4" />
    }
  ];

  const features = [
    {
      category: 'Core Management',
      items: [
        'Multi-level hierarchy: Developer → Project → Building → Property',
        'CRUD operations for all entities with validation',
        'Image upload with Supabase Storage integration',
        'Hierarchical navigation with breadcrumbs'
      ]
    },
    {
      category: 'Business Logic',
      items: [
        'Golden Visa detection for investments ≥€300,000',
        'Automatic commission calculation on sales',
        'Lead scoring and pipeline management',
        'Cyprus zone classification (5 regions)'
      ]
    },
    {
      category: 'Analytics & Reports',
      items: [
        'Real-time KPIs and performance metrics',
        'Advanced charts with Recharts integration',
        'CSV export with customizable filters',
        'Predictive analytics and trend analysis'
      ]
    },
    {
      category: 'Internationalization',
      items: [
        '8 languages support (EN, FR, EL, RU, ES, IT, DE, NL)',
        'Instant language switching',
        'Localized number and date formats',
        'Market-specific content adaptation'
      ]
    }
  ];

  const shortcuts = [
    { key: 'Ctrl+K', action: 'Quick search across entities' },
    { key: 'Ctrl+N', action: 'Create new entity' },
    { key: 'Ctrl+S', action: 'Save current form' },
    { key: 'Ctrl+E', action: 'Export current data' },
    { key: 'Escape', action: 'Close modal or form' }
  ];

  const apiEndpoints = [
    {
      table: 'developers',
      description: 'Property developers and their commission rates',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    {
      table: 'projects',
      description: 'Real estate projects with location and pricing',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    {
      table: 'buildings',
      description: 'Buildings within projects with construction details',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    {
      table: 'leads',
      description: 'CRM prospects with scoring and pipeline tracking',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    {
      table: 'commissions',
      description: 'Sales commissions with automatic calculation',
      methods: ['GET', 'POST', 'PUT']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Complete guide for the Enki Reality Admin Panel
        </p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get up and running in 4 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickStartSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Key Features
          </CardTitle>
          <CardDescription>
            Comprehensive real estate management capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {features.map((category, index) => (
              <AccordionItem key={index} value={`feature-${index}`}>
                <AccordionTrigger className="text-left">
                  {category.category}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
          <CardDescription>
            Speed up your workflow with these shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{shortcut.action}</span>
                <Badge variant="secondary" className="font-mono">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            API Reference
          </CardTitle>
          <CardDescription>
            Supabase tables and their REST endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">/rest/v1/{endpoint.table}</h4>
                  <div className="flex gap-1">
                    {endpoint.methods.map((method) => (
                      <Badge 
                        key={method} 
                        variant={method === 'GET' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {endpoint.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* External Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Documentation
          </CardTitle>
          <CardDescription>
            Additional resources and guides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div>
                <h4 className="font-medium">Project Overview</h4>
                <p className="text-sm text-muted-foreground">README.md</p>
              </div>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="/INSTALLATION.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div>
                <h4 className="font-medium">Installation Guide</h4>
                <p className="text-sm text-muted-foreground">INSTALLATION.md</p>
              </div>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="/USER_GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div>
                <h4 className="font-medium">User Guide</h4>
                <p className="text-sm text-muted-foreground">USER_GUIDE.md</p>
              </div>
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href="/API_DOCUMENTATION.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div>
                <h4 className="font-medium">API Documentation</h4>
                <p className="text-sm text-muted-foreground">API_DOCUMENTATION.md</p>
              </div>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDocumentation;