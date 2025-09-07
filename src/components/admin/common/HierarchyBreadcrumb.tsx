import React from 'react';
import { ChevronRight, Building, Home, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  developer?: { id: string; name: string };
  project?: { id: string; title: string };
  building?: { id: string; name: string };
  property?: { id: string; title: string };
  currentPage?: string;
}

const HierarchyBreadcrumb: React.FC<BreadcrumbProps> = ({
  developer,
  project,
  building,
  property,
  currentPage
}) => {
  const breadcrumbItems = [];

  // Add developer if provided
  if (developer) {
    breadcrumbItems.push({
      label: developer.name,
      href: `/admin/developers/${developer.id}`,
      icon: <User className="w-4 h-4" />
    });
  }

  // Add project if provided
  if (project) {
    breadcrumbItems.push({
      label: project.title,
      href: `/admin/projects/${project.id}`,
      icon: <Building className="w-4 h-4" />
    });
  }

  // Add building if provided
  if (building) {
    breadcrumbItems.push({
      label: building.name,
      href: `/admin/buildings/${building.id}`,
      icon: <Home className="w-4 h-4" />
    });
  }

  // Add property if provided
  if (property) {
    breadcrumbItems.push({
      label: property.title,
      href: `/admin/properties/${property.id}`,
      icon: <Home className="w-4 h-4" />
    });
  }

  // Add current page if provided and not already included
  if (currentPage && !breadcrumbItems.some(item => item.label === currentPage)) {
    breadcrumbItems.push({
      label: currentPage,
      href: '',
      icon: null
    });
  }

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          )}
          <div className="flex items-center space-x-2">
            {item.icon && (
              <span className="text-muted-foreground/70">
                {item.icon}
              </span>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">
                {item.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default HierarchyBreadcrumb;