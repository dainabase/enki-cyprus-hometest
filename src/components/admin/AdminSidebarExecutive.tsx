import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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

const getNavigationStructure = () => ({
  // Tableau de bord - standalone
  dashboard: {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard
  },

  // Gestion Immobilière
  gestionImmobiliere: {
    title: 'Gestion Immobilière',
    icon: Building2,
    collapsed: false,
    items: [
      { title: 'Développeurs', url: '/admin/developers', icon: Users },
      { title: 'Projets', url: '/admin/projects', icon: FolderOpen },
      { title: 'Bâtiments', url: '/admin/buildings', icon: Building2 },
      { title: 'Propriétés', url: '/admin/units', icon: Home }
    ]
  },

  // Ventes & CRM
  ventesCRM: {
    title: 'Ventes & CRM',
    icon: TrendingUp,
    collapsed: false,
    items: [
      { title: 'Prospects', url: '/admin/leads', icon: UserPlus },
      { title: 'Commissions', url: '/admin/commissions', icon: DollarSign }
    ]
  },

  // Analytics
  analytics: {
    title: 'Analytics',
    icon: BarChart3,
    collapsed: true,
    items: [
      { title: 'Analyses', url: '/admin/analytics', icon: ChartBar },
      { title: 'Segmentation', url: '/admin/segmentation', icon: Target },
      { title: 'Performance', url: '/admin/performance', icon: Activity },
      { title: 'Rapports', url: '/admin/reports', icon: FileText }
    ]
  },

  // Administration
  administration: {
    title: 'Administration',
    icon: Settings2,
    collapsed: true,
    items: [
      { title: 'Documentation', url: '/admin/documentation', icon: BookOpen },
      { title: 'Paramètres', url: '/admin/settings', icon: Settings },
      ...(process.env.NODE_ENV === 'development' ? [
        { title: 'Tests', url: '/admin/tests', icon: CheckSquare }
      ] : [])
    ]
  }
});

export const AdminSidebarExecutive: React.FC = () => {
  const location = useLocation();
  const navigation = getNavigationStructure();
  
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
          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative
          ${active 
            ? 'text-slate-900 bg-slate-100 font-medium' 
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
          className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
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
    <div className="h-full bg-white border-r border-slate-200">
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

    </div>
  );
};