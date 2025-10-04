import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Building,
  Building2,
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  FileText,
  Home,
  Target,
  LayoutDashboard,
  FolderOpen,
  UserPlus,
  ChartBar,
  Activity,
  Settings2,
  BookOpen,
  CheckSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import LanguageSelector from './common/LanguageSelector';

const getNavigationStructure = (t: any) => ({
  // Tableau de bord - standalone
  dashboard: {
    title: t('admin.sidebar.dashboard'),
    url: '/admin',
    icon: LayoutDashboard
  },

  // Gestion Immobilière
  gestionImmobiliere: {
    title: t('admin.sidebar.gestionImmobiliere'),
    icon: Building2,
    collapsed: false,
    items: [
      { title: t('admin.sidebar.developers'), url: '/admin/developers', icon: Users },
      { title: t('admin.sidebar.projects'), url: '/admin/projects', icon: FolderOpen },
      { title: t('admin.sidebar.units'), url: '/admin/units', icon: Home }
    ]
  },

  // Ventes & CRM
  ventesCRM: {
    title: t('admin.sidebar.ventesCRM'),
    icon: TrendingUp,
    collapsed: false,
    items: [
      { title: t('admin.sidebar.prospects'), url: '/admin/leads', icon: UserPlus },
      { title: t('admin.sidebar.commissions'), url: '/admin/commissions', icon: DollarSign }
    ]
  },

  // Analytics
  analytics: {
    title: t('admin.sidebar.analytics'),
    icon: BarChart3,
    collapsed: true,
    items: [
      { title: t('admin.sidebar.analyses'), url: '/admin/analytics', icon: ChartBar },
      { title: t('admin.sidebar.segmentation'), url: '/admin/segmentation', icon: Target },
      { title: t('admin.sidebar.performance'), url: '/admin/performance', icon: Activity },
      { title: t('admin.sidebar.reports'), url: '/admin/reports', icon: FileText }
    ]
  },

  // Administration
  administration: {
    title: t('admin.sidebar.administration'),
    icon: Settings2,
    collapsed: true,
    items: [
      { title: t('admin.sidebar.documentation'), url: '/admin/documentation', icon: BookOpen },
      { title: t('admin.sidebar.settings'), url: '/admin/settings', icon: Settings },
      ...(process.env.NODE_ENV === 'development' ? [
        { title: t('admin.sidebar.tests'), url: '/admin/tests', icon: CheckSquare }
      ] : [])
    ]
  }
});

export function AdminSidebar() {
  const location = useLocation();
  const { t } = useTranslation();
  const { state, openMobile, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";

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

  const isActive = (path: string) => location.pathname === path;

  React.useEffect(() => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, openMobile, setOpenMobile]);

  React.useEffect(() => {
    const currentPath = location.pathname;
    const newStates = { ...categoryStates };
    let hasChanged = false;

    Object.entries(navigation).forEach(([key, section]: [string, any]) => {
      if (key !== 'dashboard' && section.items) {
        const hasActiveItem = section.items.some((item: any) => item.url === currentPath);
        if (hasActiveItem && !categoryStates[key]) {
          newStates[key] = true;
          hasChanged = true;
        }
      }
    });

    if (hasChanged) {
      setCategoryStates(newStates);
    }
  }, [location.pathname]);

  const toggleCategory = (categoryKey: string) => {
    const newStates = {
      ...categoryStates,
      [categoryKey]: !categoryStates[categoryKey]
    };
    setCategoryStates(newStates);
    localStorage.setItem('admin-sidebar-categories', JSON.stringify(newStates));
  };

  const renderMenuItem = (item: any, isSubItem = false) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
              isSubItem ? 'ml-4' : ''
            } ${
              isActive
                ? 'bg-primary/10 text-primary font-medium shadow-sm'
                : 'text-secondary hover:bg-accent/50 hover:text-primary'
            }`
          }
        >
          <item.icon 
            className={`w-5 h-5 transition-colors duration-200 ${
              isActive(item.url) 
                ? 'text-primary' 
                : 'text-secondary group-hover:text-primary'
            }`} 
          />
          
          {!collapsed && (
            <span className="text-sm font-medium truncate">
              {item.title}
            </span>
          )}

          {/* Active indicator */}
          {isActive(item.url) && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  const renderCategory = (categoryKey: string, category: any) => (
    <div key={categoryKey}>
      {/* Category separator */}
      <div className="h-px bg-border/50 my-3" />
      
      {/* Category header */}
      <div 
        className={`flex items-center justify-between px-3 py-2 cursor-pointer text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors ${
          collapsed ? 'justify-center' : ''
        }`}
        onClick={() => !collapsed && toggleCategory(categoryKey)}
      >
        <div className="flex items-center gap-2">
          <category.icon className="w-4 h-4" />
          {!collapsed && <span>{category.title}</span>}
        </div>
        {!collapsed && (
          categoryStates[categoryKey] ? 
            <ChevronDown className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
        )}
      </div>

      {/* Category items */}
      {(!collapsed && categoryStates[categoryKey]) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-1"
        >
          {category.items.map((item: any) => renderMenuItem(item, true))}
        </motion.div>
      )}
    </div>
  );

  return (
    <Sidebar
      className={collapsed ? "w-[72px]" : "w-64"}
      collapsible="icon"
    >
      {/* Header with trigger */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary">ENKI-REALTY</h2>
              <p className="text-xs text-secondary">{t('admin.sidebar.administration')}</p>
            </div>
          </motion.div>
        )}
        <SidebarTrigger className="ml-auto" />
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard - standalone */}
              {renderMenuItem(navigation.dashboard)}

              {/* Categories */}
              {Object.entries(navigation).map(([key, section]) => {
                if (key === 'dashboard') return null;
                return renderCategory(key, section);
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Language Selector */}
        {!collapsed && (
          <div className="mt-auto p-3 border-t border-border/50">
            <LanguageSelector />
          </div>
        )}

        {/* Bottom section - collapsed state indicator */}
        {collapsed && (
          <div className="mt-auto p-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div className="w-6 h-px bg-border"></div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}