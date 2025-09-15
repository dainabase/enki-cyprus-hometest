import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FolderOpen, 
  Home, 
  TrendingUp, 
  UserPlus, 
  DollarSign, 
  BarChart3, 
  ChartBar, 
  Target, 
  Activity, 
  FileText, 
  Settings2, 
  BookOpen, 
  Settings, 
  CheckSquare,
  ChevronDown,
  ChevronRight 
} from 'lucide-react';

const getNavigationStructure = (t: any) => ({
  // Tableau de bord - standalone
  dashboard: {
    title: t('admin.sidebar.dashboard') || 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard
  },

  // Gestion Immobilière
  gestionImmobiliere: {
    title: t('admin.sidebar.gestionImmobiliere') || 'Gestion Immobilière',
    icon: Building2,
    collapsed: false,
    items: [
      { title: t('admin.sidebar.developers') || 'Développeurs', url: '/admin/developers', icon: Users },
      { title: t('admin.sidebar.projects') || 'Projets', url: '/admin/projects', icon: FolderOpen },
      { title: t('admin.sidebar.units') || 'Propriétés', url: '/admin/units', icon: Home }
    ]
  },

  // Ventes & CRM
  ventesCRM: {
    title: t('admin.sidebar.ventesCRM') || 'Ventes & CRM',
    icon: TrendingUp,
    collapsed: false,
    items: [
      { title: t('admin.sidebar.prospects') || 'Prospects', url: '/admin/leads', icon: UserPlus },
      { title: t('admin.sidebar.commissions') || 'Commissions', url: '/admin/commissions', icon: DollarSign }
    ]
  },

  // Analytics
  analytics: {
    title: t('admin.sidebar.analytics') || 'Analytics',
    icon: BarChart3,
    collapsed: true,
    items: [
      { title: t('admin.sidebar.analyses') || 'Analyses', url: '/admin/analytics', icon: ChartBar },
      { title: t('admin.sidebar.segmentation') || 'Segmentation', url: '/admin/segmentation', icon: Target },
      { title: t('admin.sidebar.performance') || 'Performance', url: '/admin/performance', icon: Activity },
      { title: t('admin.sidebar.reports') || 'Rapports', url: '/admin/reports', icon: FileText }
    ]
  },

  // Administration
  administration: {
    title: t('admin.sidebar.administration') || 'Administration',
    icon: Settings2,
    collapsed: true,
    items: [
      { title: t('admin.sidebar.documentation') || 'Documentation', url: '/admin/documentation', icon: BookOpen },
      { title: t('admin.sidebar.settings') || 'Paramètres', url: '/admin/settings', icon: Settings },
      ...(process.env.NODE_ENV === 'development' ? [
        { title: t('admin.sidebar.tests') || 'Tests', url: '/admin/tests', icon: CheckSquare }
      ] : [])
    ]
  }
});

export const AdminSidebarExecutive: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigation = getNavigationStructure(t);
  
  const [categoryStates, setCategoryStates] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-categories');
    return saved ? JSON.parse(saved) : {
      gestionImmobiliere: !navigation.gestionImmobiliere.collapsed,
      ventesCRM: !navigation.ventesCRM.collapsed,
      analytics: !navigation.analytics.collapsed,
      administration: !navigation.administration.collapsed
    };
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleCategory = (categoryKey: string) => {
    const newStates = {
      ...categoryStates,
      [categoryKey]: !categoryStates[categoryKey]
    };
    setCategoryStates(newStates);
    localStorage.setItem('admin-sidebar-categories', JSON.stringify(newStates));
  };

  const renderMenuItem = (item: any, isSubItem = false) => {
    const Icon = item.icon;
    const active = isActive(item.url);
    
    return (
      <a
        key={item.url}
        href={item.url}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }
          ${isSubItem ? 'ml-4 py-2' : ''}
        `}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium">{item.title}</span>
      </a>
    );
  };

  const renderCategory = (categoryKey: string, category: any) => {
    const Icon = category.icon;
    const isExpanded = categoryStates[categoryKey];
    
    return (
      <div key={categoryKey} className="space-y-2">
        <button
          onClick={() => toggleCategory(categoryKey)}
          className="flex items-center justify-between w-full px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" />
            <span className="font-semibold">{category.title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="space-y-1 ml-2">
            {category.items.map((item: any) => renderMenuItem(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Enki Realty</h2>
        <p className="text-sm text-slate-400 mt-1">Cyprus Admin</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-4">
        {/* Dashboard - standalone */}
        {renderMenuItem(navigation.dashboard)}

        {/* Gestion Immobilière */}
        {renderCategory('gestionImmobiliere', navigation.gestionImmobiliere)}

        {/* Ventes & CRM */}
        {renderCategory('ventesCRM', navigation.ventesCRM)}

        {/* Analytics */}
        {renderCategory('analytics', navigation.analytics)}

        {/* Administration */}
        {renderCategory('administration', navigation.administration)}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          Executive Dashboard v1.3.0
        </div>
      </div>
    </div>
  );
};