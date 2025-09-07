import React from 'react';
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
  Home
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

const getAdminNavItems = (t: any) => [
  {
    title: t('nav.dashboard'),
    url: '/admin',
    icon: BarChart3,
    description: 'KPIs Enki Reality'
  },
  {
    title: t('nav.developers'),
    url: '/admin/developers', 
    icon: Building2,
    description: 'Gestion développeurs'
  },
  {
    title: t('nav.projects'),
    url: '/admin/projects', 
    icon: Building,
    description: 'Hiérarchie projets'
  },
  {
    title: t('nav.units'),
    url: '/admin/units',
    icon: Home,
    description: 'Inventaire unités'
  },
  {
    title: t('nav.leads'),
    url: '/admin/leads',
    icon: Users,
    description: 'Pipeline ventes'
  },
  {
    title: t('nav.commissions'),
    url: '/admin/commissions',
    icon: DollarSign,
    description: 'Tracking financier'
  },
  {
    title: t('nav.analytics'),
    url: '/admin/analytics', 
    icon: TrendingUp,
    description: 'Conversions & trafic'
  },
  {
    title: t('nav.settings'),
    url: '/admin/settings',
    icon: Settings,
    description: 'Configuration'
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useTranslation();
  const collapsed = state === "collapsed";
  
  const adminNavItems = getAdminNavItems(t);
  const isActive = (path: string) => location.pathname === path;
  const isAnyProjectsActive = adminNavItems.some((item) => isActive(item.url));

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
              <p className="text-xs text-secondary">Administration</p>
            </div>
          </motion.div>
        )}
        <SidebarTrigger className="ml-auto" />
      </div>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
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
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block">
                              {item.title}
                            </span>
                            <span className="text-xs text-secondary/70 truncate block mt-0.5">
                              {item.description}
                            </span>
                          </div>
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
                  </motion.div>
                </SidebarMenuItem>
              ))}
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